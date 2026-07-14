import { Request, Response } from 'express';
import {
  getAllBusRoutes,
  getBusRouteBySlug,
  triggerBusSync,
} from './buses.service';

export const listBusRoutes = async (req: Request, res: Response): Promise<void> => {
  try {
    const routes = await getAllBusRoutes();
    res.json({ count: routes.length, routes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus routes', detail: (error as Error).message });
  }
};

export const getBusRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const route = await getBusRouteBySlug(slug);
    if (!route) {
      res.status(404).json({ error: `Route "${slug}" not found` });
      return;
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus route', detail: (error as Error).message });
  }
};

export const syncBuses = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('[BusController] Starting bus sync from mnzil.app...');
    const result = await triggerBusSync();
    res.json({
      message: 'Bus sync complete',
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: 'Bus sync failed', detail: (error as Error).message });
  }
};
