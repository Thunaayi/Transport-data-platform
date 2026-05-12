import { Request, Response } from 'express';
import { getFlights, getSingleFlight as getFlight } from './flights.service';
import { syncFlights } from './flights.sync';

export const getFlightsHandler = async (req: Request, res: Response) => {
  try {
    const flights = await getFlights();
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
};

export const syncFlightsHandler = async (req: Request, res: Response) => {
  try {
    const isCritical = req.query.critical === 'true';
    await syncFlights(isCritical);
    res.json({ message: 'Flight sync completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sync flights' });
  }
};

export const getSingleFlightHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flight = await getFlight(id as string);
    
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    
    res.json(flight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flight' });
  }
};
