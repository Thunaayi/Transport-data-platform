import { Router } from 'express';
import { listBusRoutes, getBusRoute, syncBuses } from './buses.controller';

const router = Router();

// GET /api/buses/routes         – list all routes
router.get('/routes', listBusRoutes);

// GET /api/buses/routes/:slug   – single route + stops
router.get('/routes/:slug', getBusRoute);

// POST /api/buses/sync          – trigger scrape sync
router.post('/sync', syncBuses);

export default router;
