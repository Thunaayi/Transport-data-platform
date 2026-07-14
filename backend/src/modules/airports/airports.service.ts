import { db } from '../../db/db';
import { airports } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const getAllAirports = async () => {
  try {
    return await db.select().from(airports).orderBy(airports.iataCode);
  } catch (error) {
    console.warn('[AirportService] DB error:', (error as Error).message);
    return [];
  }
};

export const getAirportByIata = async (iataCode: string) => {
  try {
    const result = await db.select().from(airports).where(eq(airports.iataCode, iataCode.toUpperCase()));
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.warn('[AirportService] DB error:', (error as Error).message);
    return null;
  }
};

export const getAirportsByCodes = async (codes: string[]) => {
  if (codes.length === 0) return {};
  try {
    const results = await db.select().from(airports);
    const map: Record<string, typeof results[0]> = {};
    for (const a of results) {
      map[a.iataCode] = a;
    }
    return map;
  } catch (error) {
    console.warn('[AirportService] DB error:', (error as Error).message);
    return {};
  }
};
