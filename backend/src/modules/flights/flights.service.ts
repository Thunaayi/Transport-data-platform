import { db } from '../../db/db';
import { transportEvents } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const getFlights = async () => {
  const results = await db.select().from(transportEvents).where(eq(transportEvents.type, 'flight'));
  return results;
};

export const getSingleFlight = async (id: string) => {
  const result = await db.select().from(transportEvents).where(eq(transportEvents.id, id));
  return result[0] || null;
};

export const seedMockFlights = async () => {
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
};
