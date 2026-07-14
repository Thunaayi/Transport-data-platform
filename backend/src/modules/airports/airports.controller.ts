import { Request, Response } from 'express';
import { getAllAirports, getAirportByIata } from './airports.service';

export const listAirports = async (_req: Request, res: Response) => {
  try {
    const results = await getAllAirports();
    res.json({ count: results.length, airports: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airports' });
  }
};

export const getAirport = async (req: Request, res: Response) => {
  try {
    const { iata } = req.params;
    const airport = await getAirportByIata(iata);
    if (!airport) {
      return res.status(404).json({ error: `Airport '${iata}' not found` });
    }
    res.json(airport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airport' });
  }
};
