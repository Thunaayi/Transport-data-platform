import { Request, Response } from 'express';
import { getOsrmRoute } from './routes.service';

export const getRoutePath = async (req: Request, res: Response) => {
  try {
    const { waypoints } = req.body as { waypoints: Array<{ lat: number; lng: number }> };

    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return res.status(400).json({ error: 'Provide at least 2 waypoints with lat/lng' });
    }

    for (const w of waypoints) {
      if (typeof w.lat !== 'number' || typeof w.lng !== 'number') {
        return res.status(400).json({ error: 'Each waypoint must have lat and lng as numbers' });
      }
    }

    const route = await getOsrmRoute(waypoints);
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Route fetch failed' });
  }
};
