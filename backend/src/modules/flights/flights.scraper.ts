import puppeteer from 'puppeteer';

export const fetchFlightsFromScraper = async (isCritical: boolean = false) => {
  const results: any[] = [];
  // Target airports - since the PAA site is for Karachi, we'll scrape from there
  // For other airports, we might need different sites or APIs
  const targetAirports = isCritical ? ['KHI'] : ['KHI'];

  try {
    console.log(`[Scraper] Scraping ${isCritical ? 'critical' : 'all'} flights from PAA website...`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const airport of targetAirports) {
      const page = await browser.newPage();

      try {
        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Navigate to the schedule page
        await page.goto('https://karachiairport.com.pk/schedule.aspx', {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Wait for the page to load and potentially for data to appear
        await page.waitForTimeout(5000); // Wait 5 seconds for JS to load data

        // Try to extract flight data from the page
        // Since it's a SPA, we need to look for the rendered content
        const flights = await page.evaluate(() => {
          const flightElements = document.querySelectorAll('[data-flight], .flight, .flight-item, tr, .card'); // Generic selectors
          const extractedFlights: any[] = [];

          flightElements.forEach((el, index) => {
            if (index > 10) return; // Limit to first 10 for testing

            const text = el.textContent || '';
            // Look for flight number patterns like PK303
            const flightMatch = text.match(/PK\d{3,4}/);
            if (flightMatch) {
              const number = flightMatch[0];
              // Try to extract other info
              const timeMatch = text.match(/\d{1,2}:\d{2}/);
              const destinationMatch = text.match(/(?:to|arriving|departing)\s+([A-Z]{3})/i);

              extractedFlights.push({
                number,
                origin: 'KHI', // Assume Karachi
                destination: destinationMatch ? destinationMatch[1] : 'UNKNOWN',
                scheduledDeparture: timeMatch ? new Date(`2026-05-11T${timeMatch[0]}:00`) : new Date(),
                status: text.toLowerCase().includes('delay') ? 'delayed' : 'scheduled',
                source: 'scraper'
              });
            }
          });

          return extractedFlights;
        });

        results.push(...flights);
        console.log(`[Scraper] Extracted ${flights.length} flights from ${airport}`);

      } catch (e) {
        console.error(`[Scraper] Error scraping ${airport}:`, e);
      } finally {
        await page.close();
      }
    }

    await browser.close();
    console.log(`[Scraper] Successfully scraped ${results.length} flights from PAA website.`);
    return results;
  } catch (error) {
    console.error('[Scraper] Critical failure during scraping:', error);
    return [];
  }
};
