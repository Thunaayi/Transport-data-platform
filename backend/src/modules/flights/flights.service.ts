import { db } from '../../db/db';
import { transportEvents, airports } from '../../db/schema';
import { eq } from 'drizzle-orm';

const mockFlights = [
  {
    id: 'mock-1',
    type: 'flight',
    number: 'PK303',
    origin: 'KHI',
    destination: 'LHE',
    scheduledDeparture: new Date(Date.now() + 3600000),
    scheduledArrival: new Date(Date.now() + 7200000),
    direction: 'departure',
    status: 'scheduled',
    source: 'mock',
    originDetails: { iataCode: 'KHI', name: 'Jinnah International Airport', city: 'Karachi', country: 'Pakistan', latitude: 24.9065, longitude: 67.1608 },
    destinationDetails: { iataCode: 'LHE', name: 'Allama Iqbal International Airport', city: 'Lahore', country: 'Pakistan', latitude: 31.5216, longitude: 74.4022 },
  },
  {
    id: 'mock-2',
    type: 'flight',
    number: 'PK304',
    origin: 'LHE',
    destination: 'ISB',
    scheduledDeparture: new Date(Date.now() + 5400000),
    scheduledArrival: new Date(Date.now() + 9000000),
    direction: 'departure',
    status: 'delayed',
    source: 'mock',
    originDetails: { iataCode: 'LHE', name: 'Allama Iqbal International Airport', city: 'Lahore', country: 'Pakistan', latitude: 31.5216, longitude: 74.4022 },
    destinationDetails: { iataCode: 'ISB', name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan', latitude: 33.5607, longitude: 72.8516 },
  },
];

const enrichWithAirports = async (flights: any[]) => {
  const codes = new Set<string>();
  for (const f of flights) {
    if (f.origin) codes.add(f.origin);
    if (f.destination) codes.add(f.destination);
  }

  let airportMap: Record<string, any> = {};
  try {
    const rows = await db.select().from(airports);
    for (const a of rows) {
      airportMap[a.iataCode] = a;
    }
  } catch {
    airportMap = {};
  }

  return flights.map((f) => {
    const originAirport = airportMap[f.origin];
    const destAirport = airportMap[f.destination];
    return {
      ...f,
      originDetails: originAirport
        ? { iataCode: originAirport.iataCode, name: originAirport.name, city: originAirport.city, country: originAirport.country, latitude: originAirport.latitude, longitude: originAirport.longitude }
        : null,
      destinationDetails: destAirport
        ? { iataCode: destAirport.iataCode, name: destAirport.name, city: destAirport.city, country: destAirport.country, latitude: destAirport.latitude, longitude: destAirport.longitude }
        : null,
    };
  });
};

export const getFlights = async () => {
  try {
    const results = await db.select().from(transportEvents).where(eq(transportEvents.type, 'flight'));
    if (results.length === 0) {
      console.log('Returning 0 flights from the database.');
    }
    return await enrichWithAirports(results);
  } catch (error) {
    console.warn('Database not available, returning mock flight data:', (error as Error).message);
    return mockFlights;
  }
};

export const getSingleFlight = async (id: string) => {
  try {
    const result = await db.select().from(transportEvents).where(eq(transportEvents.id, id));
    if (result.length === 0) return null;
    const enriched = await enrichWithAirports(result);
    return enriched[0];
  } catch (error) {
    console.warn('Database not available for single flight lookup:', (error as Error).message);
  }

  const flights = await getFlights();
  return flights.find((f: any) => f.id === id) || null;
};

export const seedMockFlights = async () => {
  try {
    await db.insert(transportEvents).values([
      {
        type: 'flight',
        number: 'PK303',
        origin: 'KHI',
        destination: 'LHE',
        scheduledDeparture: new Date(Date.now() + 3600000),
        scheduledArrival: new Date(Date.now() + 7200000),
        direction: 'departure',
        status: 'scheduled',
        source: 'mock',
      },
      {
        type: 'flight',
        number: 'PK304',
        origin: 'LHE',
        destination: 'ISB',
        scheduledDeparture: new Date(Date.now() + 5400000),
        scheduledArrival: new Date(Date.now() + 9000000),
        direction: 'departure',
        status: 'delayed',
        source: 'mock',
      },
    ]);
  } catch (error) {
    console.warn('Could not seed database:', error instanceof Error ? error.message : error);
  }
};
