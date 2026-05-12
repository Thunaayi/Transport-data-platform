import { db } from '../../db/db';
import { transportEvents } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const getFlights = async () => {
  // For now, always return mock data since database is not available
  console.log('Returning mock flight data (database not available)');
  return [
    {
      id: 'mock-1',
      type: 'flight',
      number: 'PK303',
      origin: 'KHI',
      destination: 'LHE',
      scheduledDeparture: new Date(Date.now() + 3600000), // +1 hour
      scheduledArrival: new Date(Date.now() + 7200000), // +2 hours
      status: 'scheduled',
      source: 'mock'
    },
    {
      id: 'mock-2',
      type: 'flight',
      number: 'PK304',
      origin: 'LHE',
      destination: 'ISB',
      scheduledDeparture: new Date(Date.now() + 5400000), // +1.5 hour
      scheduledArrival: new Date(Date.now() + 9000000), // +2.5 hours
      status: 'delayed',
      source: 'mock'
    }
  ];

  // Uncomment below when database is available
  /*
  try {
    const results = await db.select().from(transportEvents).where(eq(transportEvents.type, 'flight'));
    return results;
  } catch (error) {
    console.warn('Database not available, returning mock data:', error.message);
    return mockFlights;
  }
  */
};

export const getSingleFlight = async (id: string) => {
  const flights = await getFlights();
  return flights.find(f => f.id === id) || null;

  // Uncomment below when database is available
  /*
  try {
    const result = await db.select().from(transportEvents).where(eq(transportEvents.id, id));
    return result[0] || null;
  } catch (error) {
    console.warn('Database not available for single flight lookup:', error.message);
    const flights = await getFlights();
    return flights.find(f => f.id === id) || null;
  }
  */
};

export const seedMockFlights = async () => {
  try {
    await db.insert(transportEvents).values([
      {
        type: 'flight',
        number: 'PK303',
        origin: 'KHI',
        destination: 'LHE',
        scheduledDeparture: new Date(Date.now() + 3600000), // +1 hour
        scheduledArrival: new Date(Date.now() + 7200000), // +2 hours
        status: 'scheduled',
        source: 'mock'
      },
      {
        type: 'flight',
        number: 'PK304',
        origin: 'LHE',
        destination: 'ISB',
        scheduledDeparture: new Date(Date.now() + 5400000), // +1.5 hour
        scheduledArrival: new Date(Date.now() + 9000000), // +2.5 hours
        status: 'delayed',
        source: 'mock'
      }
    ]);
  } catch (error) {
    console.warn('Could not seed database:', error.message);
  }
};
