import { Router } from 'express';
import { getRoutePath } from './routes.controller';

const router = Router();

router.post('/osm', getRoutePath);

export default router;
