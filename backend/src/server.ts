import { app } from './app';
import { initCronJobs } from './modules/flights/flights.cron';
import { syncFlights } from './modules/flights/flights.sync';

const PORT = process.env.PORT || 4000;

// Initialize background tasks
initCronJobs();

// Trigger an initial sync immediately so the UI isn't empty
// syncFlights(true).catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
