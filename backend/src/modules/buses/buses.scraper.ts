import { db } from '../../db/db';
import { busRoutes, busStops, busRouteStops } from '../../db/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = 'https://mnzil.app';
const SITEMAP_URL = `${BASE_URL}/api/sitemap`;

// Delay helper to rate-limit requests
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch the mnzil.app sitemap and extract all vehicle slugs.
 */
async function fetchVehicleSlugs(): Promise<string[]> {
  console.log('[BusScraper] Fetching sitemap from', SITEMAP_URL);
  const res = await fetch(SITEMAP_URL, {
    headers: { 'User-Agent': 'TransportDataPlatform/1.0 (+research)' },
  });
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();

  // Extract all /vehicles/{slug} URLs
  const matches = [...xml.matchAll(/https?:\/\/mnzil\.app\/vehicles\/([^\s<>\"]+)/g)];
  const slugs = [...new Set(matches.map((m) => m[1]))].filter(
    (s) => s && s !== 'vehicles'
  );
  console.log(`[BusScraper] Found ${slugs.length} vehicle slugs`);
  return slugs;
}

interface StationData {
  id: number;
  slug: string;
  name_english: string;
  latitude: number;
  longitude: number;
}

interface VehicleData {
  slug: string;
  id: number;
  name: string;
  formal_name: string;
  image: string;
  type_id: number;
}

interface ScrapedRoute {
  vehicle: VehicleData;
  stations: StationData[];
}

/**
 * Fetch a single vehicle page and extract vehicleData + stationsData
 * from the embedded Next.js RSC payload.
 */
async function fetchVehiclePage(slug: string): Promise<ScrapedRoute | null> {
  const url = `${BASE_URL}/vehicles/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TransportDataPlatform/1.0 (+research)' },
    });
    if (!res.ok) {
      console.warn(`[BusScraper] ${slug}: HTTP ${res.status}`);
      return null;
    }
    const html = await res.text();
    return extractRouteData(html);
  } catch (err) {
    console.warn(`[BusScraper] ${slug}: fetch error`, (err as Error).message);
    return null;
  }
}

/**
 * Extract vehicleData and stationsData from the Next.js RSC payload embedded in HTML.
 * We look for the literal JSON pattern "vehicleData":{...},"stationsData":[...]
 * that Next.js inlines in self.__next_f.push() script tags.
 */
function extractRouteData(html: string): ScrapedRoute | null {
  // Try relaxed parser for escaped JSON payload embedded in strings
  const escapedVehicleMatch = html.match(/\\?"vehicleData\\?"\s*:\s*(\\?{.*?\\?})/);
  const escapedStationsMatch = html.match(/\\?"stationsData\\?"\s*:\s*(\\?\[.*?\\?\])/);
  
  if (escapedVehicleMatch && escapedStationsMatch) {
    try {
      let vStr = escapedVehicleMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      let sStr = escapedStationsMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      
      // Strip outer quotes if string got double-escaped
      if (vStr.startsWith('"') && vStr.endsWith('"')) vStr = JSON.parse(vStr);
      if (sStr.startsWith('"') && sStr.endsWith('"')) sStr = JSON.parse(sStr);
      
      const vehicle: VehicleData = typeof vStr === 'string' ? JSON.parse(vStr) : vStr;
      const stations: StationData[] = typeof sStr === 'string' ? JSON.parse(sStr) : sStr;
      return { vehicle, stations };
    } catch (e) {
      console.warn('Escaped extraction JSON parse failed:', (e as Error).message);
    }
  }

  // Fallback to direct matching
  const vehicleMatch = html.match(/"vehicleData"\s*:\s*({.*?})/);
  const stationsMatch = html.match(/"stationsData"\s*:\s*(\[.*?\])/);
  
  if (vehicleMatch && stationsMatch) {
    try {
      const vehicle: VehicleData = JSON.parse(vehicleMatch[1]);
      const stations: StationData[] = JSON.parse(stationsMatch[1]);
      return { vehicle, stations };
    } catch (e) {
      console.warn('Direct extraction JSON parse failed:', (e as Error).message);
    }
  }

  return null;
}

/**
 * Upsert a single route and its stops into the database.
 */
async function upsertRoute(data: ScrapedRoute): Promise<void> {
  const { vehicle, stations } = data;

  // Upsert the route
  await db
    .insert(busRoutes)
    .values({
      slug: vehicle.slug,
      name: vehicle.name,
      formalName: vehicle.formal_name || null,
      image: vehicle.image || null,
      typeId: vehicle.type_id || null,
      source: 'mnzil',
    })
    .onConflictDoUpdate({
      target: busRoutes.slug,
      set: {
        name: vehicle.name,
        formalName: vehicle.formal_name || null,
        image: vehicle.image || null,
        typeId: vehicle.type_id || null,
        updatedAt: new Date(),
      },
    });

  // Fetch the route's UUID from DB
  const [route] = await db
    .select({ id: busRoutes.id })
    .from(busRoutes)
    .where(eq(busRoutes.slug, vehicle.slug));
  if (!route) return;

  // Upsert each stop
  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];

    await db
      .insert(busStops)
      .values({
        mnzilId: s.id,
        slug: s.slug,
        nameEnglish: s.name_english,
        latitude: s.latitude ?? null,
        longitude: s.longitude ?? null,
      })
      .onConflictDoUpdate({
        target: busStops.slug,
        set: {
          nameEnglish: s.name_english,
          latitude: s.latitude ?? null,
          longitude: s.longitude ?? null,
        },
      });

    const [stop] = await db
      .select({ id: busStops.id })
      .from(busStops)
      .where(eq(busStops.slug, s.slug));
    if (!stop) continue;

    await db
      .insert(busRouteStops)
      .values({
        routeId: route.id,
        stopId: stop.id,
        stopOrder: i + 1,
      })
      .onConflictDoUpdate({
        target: [busRouteStops.routeId, busRouteStops.stopId],
        set: { stopOrder: i + 1 },
      });
  }
}

/**
 * Main sync function: scrape all bus routes from mnzil.app and upsert to DB.
 */
export async function syncBusRoutes(): Promise<{
  total: number;
  synced: number;
  failed: number;
}> {
  const slugs = await fetchVehicleSlugs();
  let synced = 0;
  let failed = 0;

  // Process in batches of 5 with a 300ms gap between batches
  const BATCH_SIZE = 5;
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    const batch = slugs.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (slug) => {
        const data = await fetchVehiclePage(slug);
        if (!data) throw new Error(`No data for ${slug}`);
        await upsertRoute(data);
        console.log(`[BusScraper] ✓ ${slug} (${data.stations.length} stops)`);
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') synced++;
      else {
        failed++;
        console.warn('[BusScraper] ✗', r.reason?.message ?? r.reason);
      }
    }

    if (i + BATCH_SIZE < slugs.length) await delay(300);
  }

  console.log(`[BusScraper] Done: ${synced} synced, ${failed} failed out of ${slugs.length}`);
  return { total: slugs.length, synced, failed };
}
