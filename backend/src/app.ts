import express from 'express';
import cors from 'cors';
import flightRoutes from './modules/flights/flights.routes';
import busRoutes from './modules/buses/buses.routes';
import airportRoutes from './modules/airports/airports.routes';
import routeRoutes from './modules/routes/routes.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/flights', flightRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/routes', routeRoutes);
