import cron from 'node-cron';
import { syncFlights } from './flights.sync';

export const initCronJobs = () => {
  // 1. Critical routes (KHI, LHE, ISB) - Every 1 hour
  // '0 * * * *' -> runs at minute 0 past every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Triggering hourly critical flight sync');
    await syncFlights(true);
  });

  // 2. Full sync - Every 12 hours
  // '0 */12 * * *' -> runs at minute 0 past every 12th hour
  cron.schedule('0 */12 * * *', async () => {
    console.log('[Cron] Triggering 12-hour full flight sync');
    await syncFlights(false);
  });

  console.log('[Cron] Flight sync jobs registered.');
};
