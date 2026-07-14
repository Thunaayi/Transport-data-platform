import { fetchFlightsFromScraper as fetchFlightsFromPaa } from './flights.scraper';
import { fetchFlightsFromAPI } from './flights.api';
import { db } from '../../db/db';
import { transportEvents } from '../../db/schema';
import { sql } from 'drizzle-orm';

/**
 * Core synchronization logic for flights.
 * @param isCritical If true, only syncs major PAA airports (KHI, LHE, ISB).
 */
export const syncFlights = async (isCritical: boolean = false) => {
  console.log(`[Sync] Starting ${isCritical ? 'critical' : 'full'} flight sync...`);
  
  try {
    // PAA is the authoritative source for Pakistan airport schedules. Aviationstack
    // is kept as a fallback when PAA returns no usable rows.
    const paaFlights = await fetchFlightsFromPaa(isCritical);
    const apiFlights = paaFlights.length > 0 ? [] : await fetchFlightsFromAPI(isCritical);
    const source = paaFlights.length > 0 ? 'PAA' : 'Aviationstack fallback';

    if (paaFlights.length > 0) {
      console.log(`[Sync] Using ${paaFlights.length} flights from PAA. Skipping Aviationstack fallback.`);
    } else {
      console.warn(`[Sync] PAA returned no flights. Fetched ${apiFlights.length} from Aviationstack fallback.`);
    }
    
    // Deduplicate in-memory to prevent Postgres "ON CONFLICT DO UPDATE command cannot affect row a second time"
    const flightMap = new Map<string, any>();
    
    for (const flight of [...paaFlights, ...apiFlights]) {
      if (!flight || !flight.number || !flight.scheduledDeparture) {
        continue;
      }

      const dateStr = flight.scheduledDeparture instanceof Date 
        ? flight.scheduledDeparture.toISOString() 
        : new Date(flight.scheduledDeparture).toISOString();
      
      const uniqueKey = [
        flight.number.replace(/\s+/g, '').toUpperCase(),
        flight.origin || 'UNKNOWN',
        flight.destination || 'UNKNOWN',
        dateStr,
      ].join('_');

      flightMap.set(uniqueKey, flight);
    }
    
    const mergedFlights = Array.from(flightMap.values());

    if (mergedFlights.length > 0) {
      try {
        await db.insert(transportEvents)
          .values(mergedFlights)
          .onConflictDoUpdate({
            target: [transportEvents.number, transportEvents.scheduledDeparture],
            set: {
              origin: sql`EXCLUDED.origin`,
              destination: sql`EXCLUDED.destination`,
              scheduledArrival: sql`EXCLUDED.scheduled_arrival`,
              direction: sql`EXCLUDED.direction`,
              status: sql`EXCLUDED.status`,
              actualDeparture: sql`EXCLUDED.actual_departure`,
              actualArrival: sql`EXCLUDED.actual_arrival`,
              source: sql`EXCLUDED.source`,
              updatedAt: new Date(),
            }
          });

        console.log(`[Sync] Completed from ${source}. Upserted ${mergedFlights.length} records into database.`);
      } catch (insertError) {
        console.error('[Sync] Failed during DB upsert:', insertError);
      }
    } else {
      console.log(`[Sync] No records to upsert.`);
    }
  } catch (error) {
    // Master catch to prevent the process from crashing
    console.error('[Sync] Critical failure during sync operation:', error);
    console.error(error instanceof Error ? error.stack : error);
  }
};
