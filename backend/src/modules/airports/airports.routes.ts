import { Router } from 'express';
import { listAirports, getAirport } from './airports.controller';

const router = Router();

router.get('/', listAirports);
router.get('/:iata', getAirport);

export default router;
