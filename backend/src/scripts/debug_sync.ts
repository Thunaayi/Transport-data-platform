import { fetchFlightsFromAPI } from '../modules/flights/flights.api';
import { fetchFlightsFromScraper } from '../modules/flights/flights.scraper';
import { syncFlights } from '../modules/flights/flights.sync';

(async () => {
  console.log('Starting debug sync script...');

  const api = await fetchFlightsFromAPI(true);
  console.log(`API returned ${api.length} records`);

  const scraped = await fetchFlightsFromScraper(true);
  console.log(`Scraper returned ${scraped.length} records`);

  console.log('Running syncFlights directly...');
  await syncFlights(true);

  console.log('Debug script completed.');
})();
