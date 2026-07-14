import https from 'https';

const paaFlightsBaseUrl = 'https://paaconnectapi.paa.gov.pk/api/flights';
const paaHttpsAgent = new https.Agent({ rejectUnauthorized: false });

type PaaDirection = 'Departure' | 'Arrival';

type PaaFlight = {
  FlightNumber?: string;
  EnglishFromCity?: string;
  EnglishToCity?: string;
  ST?: string;
  ET?: string;
  EnglishRemarks?: string;
};

const cityFeeds = [
  { city: 'karachi', iata: 'KHI', major: true },
  { city: 'lahore', iata: 'LHE', major: true },
  { city: 'islamabad', iata: 'ISB', major: true },
  { city: 'multan', iata: 'MUX', major: false },
  { city: 'peshawar', iata: 'PEW', major: false },
  { city: 'quetta', iata: 'UET', major: false },
];

const cityToIata: Record<string, string> = {
  karachi: 'KHI',
  lahore: 'LHE',
  islamabad: 'ISB',
  multan: 'MUX',
  peshawar: 'PEW',
  quetta: 'UET',
  'abu dhabi': 'AUH',
  bahawalpur: 'BHV',
  beijing: 'PEK',
  dammam: 'DMM',
  doha: 'DOH',
  dubai: 'DXB',
  faisalabad: 'LYP',
  gilgit: 'GIL',
  gwadar: 'GWD',
  jeddah: 'JED',
  kabul: 'KBL',
  kuwait: 'KWI',
  manchester: 'MAN',
  medina: 'MED',
  muscat: 'MCT',
  riyadh: 'RUH',
  sharjah: 'SHJ',
  skardu: 'KDU',
  sialkot: 'SKT',
  sukkur: 'SKZ',
  toronto: 'YYZ',
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parsePakistanDateTime = (date: string, time?: string) => {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) {
    return null;
  }

  const normalizedTime = time.padStart(5, '0');
  const parsed = new Date(`${date}T${normalizedTime}:00+05:00`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeStatus = (value?: string) => {
  const status = value?.trim().toLowerCase();

  if (!status) return 'scheduled';
  if (status.includes('cancel')) return 'cancelled';
  if (status.includes('delay')) return 'delayed';
  if (status.includes('depart')) return 'departed';
  if (status.includes('arriv')) return 'arrived';
  if (status.includes('expected')) return 'scheduled';

  return status.replace(/\s+/g, '_');
};

const getIataForCity = (city?: string) => {
  const trimmed = city?.trim();
  if (!trimmed) return 'UNKNOWN';

  const normalized = trimmed.toLowerCase();
  return cityToIata[normalized] || trimmed.toUpperCase();
};

const buildPaaUrl = (date: string, direction: PaaDirection, city: string) =>
  `${paaFlightsBaseUrl}/${date}/${direction}/${city}`;

const fetchJson = (url: string) => new Promise<unknown>((resolve, reject) => {
  const request = https.get(
    url,
    {
      agent: paaHttpsAgent,
      headers: {
        accept: 'application/json, text/plain, */*',
        referer: 'https://paa.gov.pk/',
      },
    },
    (response) => {
      let body = '';

      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`PAA responded ${response.statusCode ?? 'unknown'} ${response.statusMessage ?? ''}`.trim()));
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    }
  );

  request.setTimeout(20000, () => {
    request.destroy(new Error('PAA request timed out'));
  });
  request.on('error', reject);
});

const fetchPaaFeed = async (date: string, direction: PaaDirection, city: string) => {
  const data = await fetchJson(buildPaaUrl(date, direction, city));
  return Array.isArray(data) ? data as PaaFlight[] : [];
};

const mapPaaFlight = (flight: PaaFlight, date: string, direction: PaaDirection, airportIata: string) => {
  const scheduledTime = parsePakistanDateTime(date, flight.ST);
  if (!flight.FlightNumber || !scheduledTime) {
    return null;
  }

  const estimatedTime = parsePakistanDateTime(date, flight.ET);
  const isDeparture = direction === 'Departure';
  const origin = isDeparture ? airportIata : getIataForCity(flight.EnglishFromCity);
  const destination = isDeparture ? getIataForCity(flight.EnglishToCity) : airportIata;

  return {
    type: 'flight',
    number: flight.FlightNumber.trim(),
    origin,
    destination,
    scheduledDeparture: isDeparture ? scheduledTime : estimatedTime || scheduledTime,
    scheduledArrival: isDeparture ? estimatedTime || scheduledTime : scheduledTime,
    actualDeparture: isDeparture && estimatedTime ? estimatedTime : null,
    actualArrival: !isDeparture && estimatedTime ? estimatedTime : null,
    direction: isDeparture ? 'departure' : 'arrival',
    status: normalizeStatus(flight.EnglishRemarks),
    source: 'paa',
  };
};

export const fetchFlightsFromScraper = async (isCritical: boolean = false) => {
  const date = formatDate(new Date());
  const results: any[] = [];
  const targetCities = cityFeeds.filter((feed) => isCritical ? feed.major : true);

  console.log(`[Scraper] Fetching ${isCritical ? 'major-city' : 'all-city'} flights from PAA JSON feeds for ${date}...`);

  for (const { city, iata } of targetCities) {
    for (const direction of ['Departure', 'Arrival'] as PaaDirection[]) {
      try {
        const rows = await fetchPaaFeed(date, direction, city);
        const mappedFlights = rows
          .map((flight) => mapPaaFlight(flight, date, direction, iata))
          .filter(Boolean);

        results.push(...mappedFlights);

        if (rows.length === 0) {
          console.warn(`[Scraper] PAA ${city} ${direction} feed returned no rows.`);
        } else {
          console.log(`[Scraper] PAA ${city} ${direction}: mapped ${mappedFlights.length}/${rows.length} rows.`);
        }
      } catch (error) {
        console.error(`[Scraper] Failed to fetch PAA ${city} ${direction} feed:`, error);
      }
    }
  }

  console.log(`[Scraper] Completed PAA JSON fetch with ${results.length} mapped flights.`);
  return results;
};
