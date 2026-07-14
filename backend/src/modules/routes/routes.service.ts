const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

type Waypoint = { lat: number; lng: number };

const routeCache = new Map<string, { path: [number, number][]; distance: number; duration: number }>();

const cacheKey = (waypoints: Waypoint[]) =>
  waypoints.map((w) => `${w.lat.toFixed(5)},${w.lng.toFixed(5)}`).join('|');

export const getOsrmRoute = async (waypoints: Waypoint[]) => {
  if (waypoints.length < 2) {
    return { path: [] as [number, number][], distance: 0, duration: 0 };
  }

  const key = cacheKey(waypoints);
  const cached = routeCache.get(key);
  if (cached) return cached;

  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
  const url = `${OSRM_BASE}/${coords}?geometries=geojson&overview=full&alternatives=false`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`OSRM responded ${res.status}`);

    const data = await res.json() as { code: string; routes: Array<{ geometry: { coordinates: [number, number][] }; distance: number; duration: number }> };
    if (data.code !== 'Ok' || !data.routes?.length) {
      return getStraightPath(waypoints);
    }

    const route = data.routes[0];
    const result = {
      path: route.geometry.coordinates,
      distance: route.distance,
      duration: route.duration,
    };

    routeCache.set(key, result);
    return result;
  } catch {
    return getStraightPath(waypoints);
  }
};

const getStraightPath = (waypoints: Waypoint[]) => {
  const path: [number, number][] = waypoints.map((w) => [w.lng, w.lat]);
  let distance = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const R = 6371000;
    const dLat = ((waypoints[i].lat - waypoints[i - 1].lat) * Math.PI) / 180;
    const dLng = ((waypoints[i].lng - waypoints[i - 1].lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((waypoints[i - 1].lat * Math.PI) / 180) *
        Math.cos((waypoints[i].lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    distance += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return { path, distance, duration: distance / 8.33 };
};
