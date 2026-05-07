export const fetchFlightsFromAPI = async (isCritical: boolean = false) => {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    console.warn('[API] AVIATIONSTACK_API_KEY is missing. Skipping API fetch.');
    return [];
  }

  // Critical routes: major hubs. Full sync could include smaller airports later.
  const targetAirports = isCritical ? ['KHI', 'ISB', 'LHE'] : ['KHI', 'ISB', 'LHE', 'PEW', 'MUX', 'UET'];
  const results: any[] = [];

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
        return {
          type: 'flight',
          number: flight.flight.iata || flight.flight.icao || 'UNKNOWN',
          origin: flight.departure.iata,
          destination: flight.arrival.iata || 'UNKNOWN',
          scheduledDeparture: new Date(flight.departure.scheduled),
          scheduledArrival: flight.arrival.scheduled ? new Date(flight.arrival.scheduled) : new Date(flight.departure.scheduled), // Fallback
          actualDeparture: flight.departure.actual ? new Date(flight.departure.actual) : null,
          actualArrival: flight.arrival.actual ? new Date(flight.arrival.actual) : null,
          status: flight.flight_status || 'scheduled',
          source: 'api',
        };
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
