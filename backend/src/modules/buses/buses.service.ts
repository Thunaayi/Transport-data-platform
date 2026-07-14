import { db } from '../../db/db';
import { busRoutes, busStops, busRouteStops } from '../../db/schema';
import { eq, asc, notIlike, and, or, isNull } from 'drizzle-orm';
import { syncBusRoutes } from './buses.scraper';

/**
 * Get all bus routes (slug, name, formalName, typeId)
 */
export const getAllBusRoutes = async () => {
  try {
    const routes = await db
      .select({
        id: busRoutes.id,
        slug: busRoutes.slug,
        name: busRoutes.name,
        formalName: busRoutes.formalName,
        image: busRoutes.image,
        typeId: busRoutes.typeId,
        source: busRoutes.source,
        createdAt: busRoutes.createdAt,
      })
      .from(busRoutes)
      .orderBy(asc(busRoutes.name));
      
    // Filter out any chinchis robustly using JS
    const filteredRoutes = routes.filter(r => {
      const isChinchi = 
        r.name.toLowerCase().includes('chinchi') ||
        (r.formalName && r.formalName.toLowerCase().includes('chinchi')) ||
        r.slug.toLowerCase().includes('chinchi');
      return !isChinchi;
    });

    return filteredRoutes;
  } catch (error) {
    console.warn('[BusService] DB error in getAllBusRoutes:', (error as Error).message);
    throw error;
  }
};

/**
 * Get a single route with all its stops in order
 */
export const getBusRouteBySlug = async (slug: string) => {
  try {
    const [route] = await db
      .select()
      .from(busRoutes)
      .where(eq(busRoutes.slug, slug));

    if (!route) return null;

    const stops = await db
      .select({
        stopOrder: busRouteStops.stopOrder,
        stopId: busStops.id,
        slug: busStops.slug,
        nameEnglish: busStops.nameEnglish,
        latitude: busStops.latitude,
        longitude: busStops.longitude,
      })
      .from(busRouteStops)
      .innerJoin(busStops, eq(busRouteStops.stopId, busStops.id))
      .where(eq(busRouteStops.routeId, route.id))
      .orderBy(asc(busRouteStops.stopOrder));

    return { ...route, stops };
  } catch (error) {
    console.warn('[BusService] DB error in getBusRouteBySlug:', (error as Error).message);
    throw error;
  }
};

/**
 * Trigger the mnzil.app scrape and return a summary
 */
export const triggerBusSync = async () => {
  return syncBusRoutes();
};
