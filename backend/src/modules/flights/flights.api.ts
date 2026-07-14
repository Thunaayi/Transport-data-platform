export const fetchFlightsFromAPI = async (isCritical: boolean = false) => {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    console.warn('[API] AVIATIONSTACK_API_KEY is missing. Skipping API fetch.');
    return [];
  }

  // Critical routes: major hubs. Full sync could include smaller airports later.
  const targetAirports = isCritical ? ['KHI', 'ISB', 'LHE'] : ['KHI', 'ISB', 'LHE', 'PEW', 'MUX', 'UET'];
  const results: any[] = [];

  const parseDate = (value: any) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  try {
    console.log(`[API] Fetching ${isCritical ? 'critical' : 'all'} flights from Aviationstack...`);
    
    // Aviationstack free tier only supports HTTP, not HTTPS
    for (const airport of targetAirports) {
      // Fetch departures for the airport
      const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${airport}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`[API] Failed to fetch for ${airport}: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      
      if (!data || !data.data) continue;

      // Map to our DB schema
      const mappedFlights = data.data.map((flight: any) => {
        const scheduledDeparture = parseDate(flight.departure?.scheduled);
        const scheduledArrival = parseDate(flight.arrival?.scheduled) || parseDate(flight.departure?.scheduled);

        return {
          type: 'flight',
          number: flight.flight?.iata || flight.flight?.icao || 'UNKNOWN',
          origin: flight.departure?.iata || 'UNKNOWN',
          destination: flight.arrival?.iata || 'UNKNOWN',
          scheduledDeparture,
          scheduledArrival,
          actualDeparture: parseDate(flight.departure?.actual),
          actualArrival: parseDate(flight.arrival?.actual),
          direction: 'departure',
          status: flight.flight_status || 'scheduled',
          source: 'api',
        };
      }).filter((flight: any) => {
        const valid =
          typeof flight.type === 'string' &&
          typeof flight.number === 'string' &&
          typeof flight.origin === 'string' &&
          typeof flight.destination === 'string' &&
          flight.scheduledDeparture instanceof Date &&
          flight.scheduledArrival instanceof Date;

        if (!valid) {
          console.warn('[API] Skipping invalid flight record:', flight);
        }

        return valid;
      });

      results.push(...mappedFlights);
    }

    console.log(`[API] Successfully fetched ${results.length} flights from external API.`);
    return results;
  } catch (error) {
    console.error('[API] Failed to fetch data:', error);
    return []; // Fail gracefully
  }
};
