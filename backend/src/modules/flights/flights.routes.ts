import { Router } from 'express';
import { getFlightsHandler, getSingleFlightHandler } from './flights.controller';

const router = Router();

router.get('/', getFlightsHandler);
router.get('/:id', getSingleFlightHandler);

export default router;
