import { Router } from 'express';
import { getFlightsHandler, getSingleFlightHandler, syncFlightsHandler } from './flights.controller';

const router = Router();

router.get('/', getFlightsHandler);
router.post('/sync', syncFlightsHandler);
router.get('/:id', getSingleFlightHandler);

export default router;
