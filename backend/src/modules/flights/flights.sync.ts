import { fetchFlightsFromScraper } from './flights.scraper';
import { fetchFlightsFromAPI } from './flights.api';
import { db } from '../../db/db';
import { transportEvents } from '../../db/schema';
import { sql } from 'drizzle-orm';

/**
 * Core synchronization logic for flights.
 * @param isCritical If true, only syncs major routes (e.g. KHI, ISB, LHE).
 */
export const syncFlights = async (isCritical: boolean = false) => {
  console.log(`[Sync] Starting ${isCritical ? 'critical' : 'full'} flight sync...`);
  
  try {
    // 1. Fetch data from all sources (they will fail gracefully if needed)
    const [scrapedFlights, apiFlights] = await Promise.all([
      fetchFlightsFromScraper(isCritical),
      fetchFlightsFromAPI(isCritical)
    ]);

    console.log(`[Sync] Fetched ${scrapedFlights.length} from scraper, ${apiFlights.length} from API`);
    
    // Deduplicate in-memory to prevent Postgres "ON CONFLICT DO UPDATE command cannot affect row a second time"
    const flightMap = new Map<string, any>();
    
    // Process scraped flights first, then API flights (API can override if preferred)
    for (const flight of [...scrapedFlights, ...apiFlights]) {
      // Create a unique key: Number + Date string
      const dateStr = flight.scheduledDeparture instanceof Date 
        ? flight.scheduledDeparture.toISOString() 
        : new Date(flight.scheduledDeparture).toISOString();
      
      const uniqueKey = `${flight.number}_${dateStr}`;
      flightMap.set(uniqueKey, flight);
    }
    
    const mergedFlights = Array.from(flightMap.values());
    // 3. Database Upsert using Drizzle
    if (mergedFlights.length > 0) {
      await db.insert(transportEvents)
        .values(mergedFlights)
        .onConflictDoUpdate({
          target: [transportEvents.number, transportEvents.scheduledDeparture],
          set: {
            status: sql`EXCLUDED.status`,
            actualDeparture: sql`EXCLUDED.actual_departure`,
            actualArrival: sql`EXCLUDED.actual_arrival`,
            updatedAt: new Date(),
          }
        });
      
      console.log(`[Sync] Completed. Upserted ${mergedFlights.length} records into database.`);
    } else {
      console.log(`[Sync] No records to upsert.`);
    }
  } catch (error) {
    // Master catch to prevent the process from crashing
    console.error('[Sync] Critical failure during sync operation:', error);
  }
};
