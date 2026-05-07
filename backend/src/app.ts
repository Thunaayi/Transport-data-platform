import express from 'express';
import cors from 'cors';
import flightRoutes from './modules/flights/flights.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/flights', flightRoutes);
