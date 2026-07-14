import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

const airportData = [
  // Pakistan
  { iataCode: 'KHI', icaoCode: 'OPKC', name: 'Jinnah International Airport', city: 'Karachi', country: 'Pakistan', latitude: 24.9065, longitude: 67.1608, timezone: 'Asia/Karachi' },
  { iataCode: 'LHE', icaoCode: 'OPLA', name: 'Allama Iqbal International Airport', city: 'Lahore', country: 'Pakistan', latitude: 31.5216, longitude: 74.4022, timezone: 'Asia/Karachi' },
  { iataCode: 'ISB', icaoCode: 'OPIS', name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan', latitude: 33.5607, longitude: 72.8516, timezone: 'Asia/Karachi' },
  { iataCode: 'PEW', icaoCode: 'OPPS', name: 'Bacha Khan International Airport', city: 'Peshawar', country: 'Pakistan', latitude: 33.9939, longitude: 71.5146, timezone: 'Asia/Karachi' },
  { iataCode: 'MUX', icaoCode: 'OPMT', name: 'Multan International Airport', city: 'Multan', country: 'Pakistan', latitude: 30.2032, longitude: 71.4191, timezone: 'Asia/Karachi' },
  { iataCode: 'UET', icaoCode: 'OPQT', name: 'Quetta International Airport', city: 'Quetta', country: 'Pakistan', latitude: 30.2514, longitude: 66.9377, timezone: 'Asia/Karachi' },
  { iataCode: 'SKT', icaoCode: 'OPST', name: 'Sialkot International Airport', city: 'Sialkot', country: 'Pakistan', latitude: 32.5357, longitude: 74.3639, timezone: 'Asia/Karachi' },
  { iataCode: 'LYP', icaoCode: 'OPFA', name: 'Faisalabad International Airport', city: 'Faisalabad', country: 'Pakistan', latitude: 31.3650, longitude: 72.9948, timezone: 'Asia/Karachi' },
  { iataCode: 'GWD', icaoCode: 'OPGD', name: 'Gwadar International Airport', city: 'Gwadar', country: 'Pakistan', latitude: 25.2333, longitude: 62.3294, timezone: 'Asia/Karachi' },
  { iataCode: 'KDU', icaoCode: 'OPSD', name: 'Skardu Airport', city: 'Skardu', country: 'Pakistan', latitude: 35.3355, longitude: 75.5360, timezone: 'Asia/Karachi' },
  { iataCode: 'GIL', icaoCode: 'OPGT', name: 'Gilgit Airport', city: 'Gilgit', country: 'Pakistan', latitude: 35.9188, longitude: 74.3336, timezone: 'Asia/Karachi' },
  { iataCode: 'BHV', icaoCode: 'OPBW', name: 'Bahawalpur Airport', city: 'Bahawalpur', country: 'Pakistan', latitude: 29.3481, longitude: 71.7180, timezone: 'Asia/Karachi' },
  { iataCode: 'SKZ', icaoCode: 'OPSU', name: 'Sukkur Airport', city: 'Sukkur', country: 'Pakistan', latitude: 27.7220, longitude: 68.7917, timezone: 'Asia/Karachi' },
  { iataCode: 'MJD', icaoCode: 'OPMJ', name: 'Moenjodaro Airport', city: 'Moenjodaro', country: 'Pakistan', latitude: 27.3352, longitude: 68.1431, timezone: 'Asia/Karachi' },
  { iataCode: 'PZH', icaoCode: 'OPZH', name: 'Zhob Airport', city: 'Zhob', country: 'Pakistan', latitude: 31.3584, longitude: 69.4636, timezone: 'Asia/Karachi' },
  { iataCode: 'TUK', icaoCode: 'OPTU', name: 'Turbat International Airport', city: 'Turbat', country: 'Pakistan', latitude: 26.0064, longitude: 63.0493, timezone: 'Asia/Karachi' },
  { iataCode: 'UDR', icaoCode: 'OPUD', name: 'Umerkot Airport', city: 'Umerkot', country: 'Pakistan', latitude: 25.6825, longitude: 69.7341, timezone: 'Asia/Karachi' },
  { iataCode: 'KDD', icaoCode: 'OPKH', name: 'Khuzdar Airport', city: 'Khuzdar', country: 'Pakistan', latitude: 27.7908, longitude: 66.6403, timezone: 'Asia/Karachi' },
  { iataCode: 'RYK', icaoCode: 'OPRK', name: 'Shaikh Zayed International Airport', city: 'Rahim Yar Khan', country: 'Pakistan', latitude: 28.3839, longitude: 70.2796, timezone: 'Asia/Karachi' },
  { iataCode: 'DBA', icaoCode: 'OPDB', name: 'Dalbandin Airport', city: 'Dalbandin', country: 'Pakistan', latitude: 28.8783, longitude: 64.3997, timezone: 'Asia/Karachi' },
  { iataCode: 'CJL', icaoCode: 'OPCH', name: 'Chitral Airport', city: 'Chitral', country: 'Pakistan', latitude: 35.8867, longitude: 71.7989, timezone: 'Asia/Karachi' },
  { iataCode: 'DEA', icaoCode: 'OPDI', name: 'Dera Ghazi Khan Airport', city: 'Dera Ghazi Khan', country: 'Pakistan', latitude: 29.9610, longitude: 70.4859, timezone: 'Asia/Karachi' },
  { iataCode: 'DSK', icaoCode: 'OPDK', name: 'Dera Ismail Khan Airport', city: 'Dera Ismail Khan', country: 'Pakistan', latitude: 31.9094, longitude: 70.8966, timezone: 'Asia/Karachi' },
  { iataCode: 'JAG', icaoCode: 'OPJA', name: 'Shahbaz Air Base', city: 'Jacobabad', country: 'Pakistan', latitude: 28.2842, longitude: 68.4497, timezone: 'Asia/Karachi' },
  { iataCode: 'KBH', icaoCode: 'OPKN', name: 'Kalat Airport', city: 'Kalat', country: 'Pakistan', latitude: 29.1033, longitude: 66.5925, timezone: 'Asia/Karachi' },
  { iataCode: 'LYP', icaoCode: 'OPFA', name: 'Faisalabad International Airport', city: 'Faisalabad', country: 'Pakistan', latitude: 31.3650, longitude: 72.9948, timezone: 'Asia/Karachi' },
  { iataCode: 'MWD', icaoCode: 'OPMI', name: 'Mianwali Airport', city: 'Mianwali', country: 'Pakistan', latitude: 32.5631, longitude: 71.5707, timezone: 'Asia/Karachi' },
  { iataCode: 'NHS', icaoCode: 'OP19', name: 'Nushki Airport', city: 'Nushki', country: 'Pakistan', latitude: 29.5400, longitude: 66.0250, timezone: 'Asia/Karachi' },
  { iataCode: 'ORW', icaoCode: 'OPOR', name: 'Ormara Airport', city: 'Ormara', country: 'Pakistan', latitude: 25.2747, longitude: 64.5858, timezone: 'Asia/Karachi' },
  { iataCode: 'PAJ', icaoCode: 'OPPC', name: 'Parachinar Airport', city: 'Parachinar', country: 'Pakistan', latitude: 33.9021, longitude: 70.0715, timezone: 'Asia/Karachi' },
  { iataCode: 'PSI', icaoCode: 'OPPI', name: 'Pasni Airport', city: 'Pasni', country: 'Pakistan', latitude: 25.2905, longitude: 63.3451, timezone: 'Asia/Karachi' },
  { iataCode: 'RAZ', icaoCode: 'OPRT', name: 'Rawalakot Airport', city: 'Rawalakot', country: 'Pakistan', latitude: 33.8497, longitude: 73.7981, timezone: 'Asia/Karachi' },
  { iataCode: 'SBQ', icaoCode: 'OPSB', name: 'Sibi Airport', city: 'Sibi', country: 'Pakistan', latitude: 29.5700, longitude: 67.8450, timezone: 'Asia/Karachi' },
  { iataCode: 'SDT', icaoCode: 'OPSS', name: 'Saidu Sharif Airport', city: 'Saidu Sharif', country: 'Pakistan', latitude: 34.8136, longitude: 72.3528, timezone: 'Asia/Karachi' },
  { iataCode: 'SUL', icaoCode: 'OPSU', name: 'Sui Airport', city: 'Sui', country: 'Pakistan', latitude: 28.6450, longitude: 69.1769, timezone: 'Asia/Karachi' },
  { iataCode: 'WAF', icaoCode: 'OPWN', name: 'Wana Airport', city: 'Wana', country: 'Pakistan', latitude: 32.3047, longitude: 69.5704, timezone: 'Asia/Karachi' },
  { iataCode: 'WGB', icaoCode: 'OP19', name: 'Walhar Airport', city: 'Walhar', country: 'Pakistan', latitude: 29.4400, longitude: 68.3500, timezone: 'Asia/Karachi' },
  { iataCode: 'OMM', icaoCode: '', name: 'Marmol Airport', city: 'Marmol', country: 'Pakistan', latitude: 32.8200, longitude: 66.5200, timezone: 'Asia/Karachi' },
  { iataCode: 'BHW', icaoCode: 'OP19', name: 'Bhagatanwala Airport', city: 'Sargodha', country: 'Pakistan', latitude: 32.0586, longitude: 72.6866, timezone: 'Asia/Karachi' },
  { iataCode: 'ISB', icaoCode: 'OPIS', name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan', latitude: 33.5607, longitude: 72.8516, timezone: 'Asia/Karachi' },

  // UAE / Gulf
  { iataCode: 'DXB', icaoCode: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657, timezone: 'Asia/Dubai' },
  { iataCode: 'AUH', icaoCode: 'OMAA', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4330, longitude: 54.6511, timezone: 'Asia/Dubai' },
  { iataCode: 'SHJ', icaoCode: 'OMSJ', name: 'Sharjah International Airport', city: 'Sharjah', country: 'United Arab Emirates', latitude: 25.3286, longitude: 55.5172, timezone: 'Asia/Dubai' },
  { iataCode: 'DOH', icaoCode: 'OTHH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', latitude: 25.2731, longitude: 51.6081, timezone: 'Asia/Qatar' },
  { iataCode: 'AUH', icaoCode: 'OMAA', name: 'Zayed International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.6511, timezone: 'Asia/Dubai' },
  { iataCode: 'MCT', icaoCode: 'OOMS', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', latitude: 23.5880, longitude: 58.2847, timezone: 'Asia/Muscat' },
  { iataCode: 'KWI', icaoCode: 'OKKK', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', latitude: 29.2266, longitude: 47.9689, timezone: 'Asia/Kuwait' },
  { iataCode: 'BAH', icaoCode: 'OBBI', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', latitude: 26.2708, longitude: 50.6336, timezone: 'Asia/Bahrain' },
  { iataCode: 'DMM', icaoCode: 'OEDF', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia', latitude: 26.4712, longitude: 49.7978, timezone: 'Asia/Riyadh' },
  { iataCode: 'RUH', icaoCode: 'OERK', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.9576, longitude: 46.6983, timezone: 'Asia/Riyadh' },
  { iataCode: 'JED', icaoCode: 'OEJN', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', latitude: 21.6796, longitude: 39.1565, timezone: 'Asia/Riyadh' },
  { iataCode: 'MED', icaoCode: 'OEMA', name: 'Prince Mohammad Bin Abdulaziz International Airport', city: 'Medina', country: 'Saudi Arabia', latitude: 24.5500, longitude: 39.7058, timezone: 'Asia/Riyadh' },
  { iataCode: 'DAC', icaoCode: 'VGHS', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh', latitude: 23.8433, longitude: 90.3978, timezone: 'Asia/Dhaka' },
  { iataCode: 'CCU', icaoCode: 'VECC', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India', latitude: 22.6547, longitude: 88.4467, timezone: 'Asia/Kolkata' },
  { iataCode: 'DEL', icaoCode: 'VIDP', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', latitude: 28.5562, longitude: 77.1000, timezone: 'Asia/Kolkata' },
  { iataCode: 'BOM', icaoCode: 'VABB', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', latitude: 19.0896, longitude: 72.8656, timezone: 'Asia/Kolkata' },
  { iataCode: 'MAA', icaoCode: 'VOMM', name: 'Chennai International Airport', city: 'Chennai', country: 'India', latitude: 12.9815, longitude: 80.1630, timezone: 'Asia/Kolkata' },
  { iataCode: 'KTM', icaoCode: 'VNKT', name: 'Tribhuvan International Airport', city: 'Kathmandu', country: 'Nepal', latitude: 27.6966, longitude: 85.3592, timezone: 'Asia/Kathmandu' },
  { iataCode: 'CMB', icaoCode: 'VCBI', name: 'Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka', latitude: 7.1811, longitude: 79.8836, timezone: 'Asia/Colombo' },
  { iataCode: 'MLE', icaoCode: 'VRMM', name: 'Velana International Airport', city: 'Malé', country: 'Maldives', latitude: 4.1918, longitude: 73.5291, timezone: 'Indian/Maldives' },

  // Middle East
  { iataCode: 'KBL', icaoCode: 'OAKB', name: 'Kabul International Airport', city: 'Kabul', country: 'Afghanistan', latitude: 34.5659, longitude: 69.2137, timezone: 'Asia/Kabul' },
  { iataCode: 'IKA', icaoCode: 'OIIE', name: 'Imam Khomeini International Airport', city: 'Tehran', country: 'Iran', latitude: 35.4083, longitude: 51.1525, timezone: 'Asia/Tehran' },
  { iataCode: 'THR', icaoCode: 'OIII', name: 'Mehrabad International Airport', city: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.3134, timezone: 'Asia/Tehran' },
  { iataCode: 'SYZ', icaoCode: 'OISS', name: 'Shiraz International Airport', city: 'Shiraz', country: 'Iran', latitude: 29.5392, longitude: 52.5894, timezone: 'Asia/Tehran' },
  { iataCode: 'MHD', icaoCode: 'OIMM', name: 'Mashhad International Airport', city: 'Mashhad', country: 'Iran', latitude: 36.2340, longitude: 59.6431, timezone: 'Asia/Tehran' },
  { iataCode: 'ISU', icaoCode: 'ORSU', name: 'Sulaymaniyah International Airport', city: 'Sulaymaniyah', country: 'Iraq', latitude: 35.5617, longitude: 45.3175, timezone: 'Asia/Baghdad' },
  { iataCode: 'BGW', icaoCode: 'ORBI', name: 'Baghdad International Airport', city: 'Baghdad', country: 'Iraq', latitude: 33.2625, longitude: 44.2347, timezone: 'Asia/Baghdad' },
  { iataCode: 'EBL', icaoCode: 'ORER', name: 'Erbil International Airport', city: 'Erbil', country: 'Iraq', latitude: 36.2375, longitude: 43.9631, timezone: 'Asia/Baghdad' },
  { iataCode: 'AMM', icaoCode: 'OJAI', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', latitude: 31.7226, longitude: 35.9932, timezone: 'Asia/Amman' },
  { iataCode: 'BEY', icaoCode: 'OLBA', name: 'Beirut–Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon', latitude: 33.8209, longitude: 35.4884, timezone: 'Asia/Beirut' },
  { iataCode: 'CAI', icaoCode: 'HECA', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', latitude: 30.1113, longitude: 31.4057, timezone: 'Africa/Cairo' },
  { iataCode: 'IST', icaoCode: 'LTFM', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', latitude: 41.2753, longitude: 28.7519, timezone: 'Europe/Istanbul' },
  { iataCode: 'SAW', icaoCode: 'LTFJ', name: 'Sabiha Gökçen International Airport', city: 'Istanbul', country: 'Turkey', latitude: 40.8985, longitude: 29.3092, timezone: 'Europe/Istanbul' },
  { iataCode: 'ESB', icaoCode: 'LTAC', name: 'Esenboğa International Airport', city: 'Ankara', country: 'Turkey', latitude: 40.1281, longitude: 32.9951, timezone: 'Europe/Istanbul' },

  // East Asia
  { iataCode: 'PEK', icaoCode: 'ZBAA', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', latitude: 40.0799, longitude: 116.6031, timezone: 'Asia/Shanghai' },
  { iataCode: 'PKX', icaoCode: 'ZBAD', name: 'Beijing Daxing International Airport', city: 'Beijing', country: 'China', latitude: 39.5098, longitude: 116.4105, timezone: 'Asia/Shanghai' },
  { iataCode: 'PVG', icaoCode: 'ZSPD', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', latitude: 31.1443, longitude: 121.8083, timezone: 'Asia/Shanghai' },
  { iataCode: 'CAN', icaoCode: 'ZGGG', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China', latitude: 23.3925, longitude: 113.2988, timezone: 'Asia/Shanghai' },
  { iataCode: 'HKG', icaoCode: 'VHHH', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China', latitude: 22.3080, longitude: 113.9185, timezone: 'Asia/Hong_Kong' },
  { iataCode: 'SZX', icaoCode: 'ZGSZ', name: 'Shenzhen Bao\'an International Airport', city: 'Shenzhen', country: 'China', latitude: 22.6394, longitude: 113.8148, timezone: 'Asia/Shanghai' },
  { iataCode: 'CTU', icaoCode: 'ZUUU', name: 'Chengdu Tianfu International Airport', city: 'Chengdu', country: 'China', latitude: 30.3197, longitude: 104.4413, timezone: 'Asia/Shanghai' },
  { iataCode: 'XIY', icaoCode: 'ZLXY', name: 'Xi\'an Xianyang International Airport', city: 'Xi\'an', country: 'China', latitude: 34.4471, longitude: 108.7516, timezone: 'Asia/Shanghai' },
  { iataCode: 'URC', icaoCode: 'ZWWW', name: 'Ürümqi Diwopu International Airport', city: 'Ürümqi', country: 'China', latitude: 43.9071, longitude: 87.4742, timezone: 'Asia/Shanghai' },
  { iataCode: 'NRT', icaoCode: 'RJAA', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', latitude: 35.7647, longitude: 140.3864, timezone: 'Asia/Tokyo' },
  { iataCode: 'HND', icaoCode: 'RJTT', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798, timezone: 'Asia/Tokyo' },
  { iataCode: 'KIX', icaoCode: 'RJBB', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan', latitude: 34.4320, longitude: 135.2304, timezone: 'Asia/Tokyo' },
  { iataCode: 'ICN', icaoCode: 'RKSI', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407, timezone: 'Asia/Seoul' },
  { iataCode: 'GMP', icaoCode: 'RKSS', name: 'Gimpo International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.5583, longitude: 126.7906, timezone: 'Asia/Seoul' },

  // Southeast Asia
  { iataCode: 'BKK', icaoCode: 'VTBS', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', latitude: 13.6811, longitude: 100.7470, timezone: 'Asia/Bangkok' },
  { iataCode: 'DMK', icaoCode: 'VTBD', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand', latitude: 13.9125, longitude: 100.6067, timezone: 'Asia/Bangkok' },
  { iataCode: 'SIN', icaoCode: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3592, longitude: 103.9894, timezone: 'Asia/Singapore' },
  { iataCode: 'KUL', icaoCode: 'WMKK', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', latitude: 2.7456, longitude: 101.7100, timezone: 'Asia/Kuala_Lumpur' },
  { iataCode: 'CGK', icaoCode: 'WIII', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', latitude: -6.1275, longitude: 106.6537, timezone: 'Asia/Jakarta' },
  { iataCode: 'MNL', icaoCode: 'RPLL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines', latitude: 14.5086, longitude: 121.0195, timezone: 'Asia/Manila' },
  { iataCode: 'HAN', icaoCode: 'VVNB', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', latitude: 21.2211, longitude: 105.8065, timezone: 'Asia/Ho_Chi_Minh' },
  { iataCode: 'SGN', icaoCode: 'VVTS', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', latitude: 10.8188, longitude: 106.6519, timezone: 'Asia/Ho_Chi_Minh' },
  { iataCode: 'RGN', icaoCode: 'VYYY', name: 'Yangon International Airport', city: 'Yangon', country: 'Myanmar', latitude: 16.9073, longitude: 96.1332, timezone: 'Asia/Yangon' },

  // Central Asia
  { iataCode: 'TAS', icaoCode: 'UTTT', name: 'Islam Karimov Tashkent International Airport', city: 'Tashkent', country: 'Uzbekistan', latitude: 41.2579, longitude: 69.2812, timezone: 'Asia/Tashkent' },
  { iataCode: 'ALA', icaoCode: 'UAAA', name: 'Almaty International Airport', city: 'Almaty', country: 'Kazakhstan', latitude: 43.3521, longitude: 77.0415, timezone: 'Asia/Almaty' },
  { iataCode: 'FRU', icaoCode: 'UAFM', name: 'Manas International Airport', city: 'Bishkek', country: 'Kyrgyzstan', latitude: 43.0613, longitude: 74.4776, timezone: 'Asia/Bishkek' },
  { iataCode: 'DYU', icaoCode: 'UTDD', name: 'Dushanbe International Airport', city: 'Dushanbe', country: 'Tajikistan', latitude: 38.5433, longitude: 68.8250, timezone: 'Asia/Dushanbe' },
  { iataCode: 'ASB', icaoCode: 'UTAA', name: 'Ashgabat International Airport', city: 'Ashgabat', country: 'Turkmenistan', latitude: 37.9868, longitude: 58.3610, timezone: 'Asia/Ashgabat' },

  // Europe
  { iataCode: 'LHR', icaoCode: 'EGLL', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543, timezone: 'Europe/London' },
  { iataCode: 'LGW', icaoCode: 'EGKK', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', latitude: 51.1537, longitude: -0.1821, timezone: 'Europe/London' },
  { iataCode: 'STN', icaoCode: 'EGSS', name: 'London Stansted Airport', city: 'London', country: 'United Kingdom', latitude: 51.8850, longitude: 0.2350, timezone: 'Europe/London' },
  { iataCode: 'MAN', icaoCode: 'EGCC', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', latitude: 53.3537, longitude: -2.2753, timezone: 'Europe/London' },
  { iataCode: 'BHX', icaoCode: 'EGBB', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom', latitude: 52.4539, longitude: -1.7495, timezone: 'Europe/London' },
  { iataCode: 'GLA', icaoCode: 'EGPF', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom', latitude: 55.8719, longitude: -4.4333, timezone: 'Europe/London' },
  { iataCode: 'EDI', icaoCode: 'EGPH', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', latitude: 55.9500, longitude: -3.3725, timezone: 'Europe/London' },
  { iataCode: 'CDG', icaoCode: 'LFPG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5478, timezone: 'Europe/Paris' },
  { iataCode: 'ORY', icaoCode: 'LFPO', name: 'Paris Orly Airport', city: 'Paris', country: 'France', latitude: 48.7262, longitude: 2.3653, timezone: 'Europe/Paris' },
  { iataCode: 'FRA', icaoCode: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622, timezone: 'Europe/Berlin' },
  { iataCode: 'MUC', icaoCode: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Germany', latitude: 48.3538, longitude: 11.7759, timezone: 'Europe/Berlin' },
  { iataCode: 'TXL', icaoCode: 'EDDT', name: 'Berlin Tegel Airport', city: 'Berlin', country: 'Germany', latitude: 52.5597, longitude: 13.2877, timezone: 'Europe/Berlin' },
  { iataCode: 'BER', icaoCode: 'EDDB', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', latitude: 52.3667, longitude: 13.5033, timezone: 'Europe/Berlin' },
  { iataCode: 'AMS', icaoCode: 'EHAM', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3105, longitude: 4.7683, timezone: 'Europe/Amsterdam' },
  { iataCode: 'MAD', icaoCode: 'LEMD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.4936, longitude: -3.5668, timezone: 'Europe/Madrid' },
  { iataCode: 'BCN', icaoCode: 'LEBL', name: 'Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain', latitude: 41.2974, longitude: 2.0785, timezone: 'Europe/Madrid' },
  { iataCode: 'FCO', icaoCode: 'LIRF', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy', latitude: 41.8003, longitude: 12.2389, timezone: 'Europe/Rome' },
  { iataCode: 'MXP', icaoCode: 'LIMC', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', latitude: 45.6301, longitude: 8.7242, timezone: 'Europe/Rome' },
  { iataCode: 'ZRH', icaoCode: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', latitude: 47.4583, longitude: 8.5481, timezone: 'Europe/Zurich' },
  { iataCode: 'GVA', icaoCode: 'LSGG', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', latitude: 46.2380, longitude: 6.1090, timezone: 'Europe/Zurich' },
  { iataCode: 'VIE', icaoCode: 'LOWW', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', latitude: 48.1197, longitude: 16.5638, timezone: 'Europe/Vienna' },
  { iataCode: 'CPH', icaoCode: 'EKCH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', latitude: 55.6180, longitude: 12.6508, timezone: 'Europe/Copenhagen' },
  { iataCode: 'ARN', icaoCode: 'ESSA', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', latitude: 59.6498, longitude: 17.9294, timezone: 'Europe/Stockholm' },
  { iataCode: 'OSL', icaoCode: 'ENGM', name: 'Oslo Airport, Gardermoen', city: 'Oslo', country: 'Norway', latitude: 60.1210, longitude: 11.0500, timezone: 'Europe/Oslo' },
  { iataCode: 'HEL', icaoCode: 'EFHK', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finland', latitude: 60.3172, longitude: 24.9533, timezone: 'Europe/Helsinki' },
  { iataCode: 'BRU', icaoCode: 'EBBR', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', latitude: 50.9014, longitude: 4.4844, timezone: 'Europe/Brussels' },
  { iataCode: 'DUB', icaoCode: 'EIDW', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', latitude: 53.4213, longitude: -6.2701, timezone: 'Europe/Dublin' },
  { iataCode: 'LIS', icaoCode: 'LPPT', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal', latitude: 38.7813, longitude: -9.1359, timezone: 'Europe/Lisbon' },
  { iataCode: 'ATH', icaoCode: 'LGAV', name: 'Athens International Airport', city: 'Athens', country: 'Greece', latitude: 37.9364, longitude: 23.9470, timezone: 'Europe/Athens' },
  { iataCode: 'WAW', icaoCode: 'EPWA', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland', latitude: 52.1659, longitude: 20.9682, timezone: 'Europe/Warsaw' },
  { iataCode: 'PRG', icaoCode: 'LKPR', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'Czech Republic', latitude: 50.1008, longitude: 14.2600, timezone: 'Europe/Prague' },
  { iataCode: 'BUD', icaoCode: 'LHBP', name: 'Budapest Ferenc Liszt International Airport', city: 'Budapest', country: 'Hungary', latitude: 47.4300, longitude: 19.2611, timezone: 'Europe/Budapest' },
  { iataCode: 'ZAG', icaoCode: 'LDZA', name: 'Zagreb Airport', city: 'Zagreb', country: 'Croatia', latitude: 45.7429, longitude: 16.0688, timezone: 'Europe/Zagreb' },

  // North America
  { iataCode: 'YYZ', icaoCode: 'CYYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', latitude: 43.6772, longitude: -79.6306, timezone: 'America/Toronto' },
  { iataCode: 'YUL', icaoCode: 'CYUL', name: 'Montréal–Trudeau International Airport', city: 'Montreal', country: 'Canada', latitude: 45.4577, longitude: -73.7499, timezone: 'America/Montreal' },
  { iataCode: 'YVR', icaoCode: 'CYVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', latitude: 49.1939, longitude: -123.1840, timezone: 'America/Vancouver' },
  { iataCode: 'YYC', icaoCode: 'CYYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canada', latitude: 51.1139, longitude: -114.0203, timezone: 'America/Edmonton' },
  { iataCode: 'JFK', icaoCode: 'KJFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781, timezone: 'America/New_York' },
  { iataCode: 'EWR', icaoCode: 'KEWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'United States', latitude: 40.6895, longitude: -74.1745, timezone: 'America/New_York' },
  { iataCode: 'ORD', icaoCode: 'KORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States', latitude: 41.9742, longitude: -87.9073, timezone: 'America/Chicago' },
  { iataCode: 'LAX', icaoCode: 'KLAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9425, longitude: -118.4081, timezone: 'America/Los_Angeles' },
  { iataCode: 'SFO', icaoCode: 'KSFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', latitude: 37.6213, longitude: -122.3790, timezone: 'America/Los_Angeles' },
  { iataCode: 'IAD', icaoCode: 'KIAD', name: 'Washington Dulles International Airport', city: 'Washington D.C.', country: 'United States', latitude: 38.9445, longitude: -77.4558, timezone: 'America/New_York' },
  { iataCode: 'DFW', icaoCode: 'KDFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', latitude: 32.8998, longitude: -97.0403, timezone: 'America/Chicago' },
  { iataCode: 'IAH', icaoCode: 'KIAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'United States', latitude: 29.9902, longitude: -95.3368, timezone: 'America/Chicago' },
  { iataCode: 'ATL', icaoCode: 'KATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', latitude: 33.6407, longitude: -84.4277, timezone: 'America/New_York' },
  { iataCode: 'MIA', icaoCode: 'KMIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', latitude: 25.7932, longitude: -80.2906, timezone: 'America/New_York' },

  // Africa
  { iataCode: 'NBO', icaoCode: 'HKJK', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', latitude: -1.3192, longitude: 36.9278, timezone: 'Africa/Nairobi' },
  { iataCode: 'ADD', icaoCode: 'HAAB', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia', latitude: 8.9778, longitude: 38.7993, timezone: 'Africa/Addis_Ababa' },
  { iataCode: 'JNB', icaoCode: 'FAOR', name: 'O. R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', latitude: -26.1392, longitude: 28.2460, timezone: 'Africa/Johannesburg' },
  { iataCode: 'CPT', icaoCode: 'FACT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', latitude: -33.9715, longitude: 18.6021, timezone: 'Africa/Johannesburg' },
  { iataCode: 'LOS', icaoCode: 'DNMM', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', latitude: 6.5774, longitude: 3.3212, timezone: 'Africa/Lagos' },
  { iataCode: 'CMN', icaoCode: 'GMMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco', latitude: 33.3675, longitude: -7.5900, timezone: 'Africa/Casablanca' },
  { iataCode: 'TUN', icaoCode: 'DTTA', name: 'Tunis–Carthage International Airport', city: 'Tunis', country: 'Tunisia', latitude: 36.8515, longitude: 10.2269, timezone: 'Africa/Tunis' },
  { iataCode: 'ALG', icaoCode: 'DAAG', name: 'Houari Boumediene Airport', city: 'Algiers', country: 'Algeria', latitude: 36.6939, longitude: 3.2169, timezone: 'Africa/Algiers' },

  // Australia / Oceania
  { iataCode: 'SYD', icaoCode: 'YSSY', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753, timezone: 'Australia/Sydney' },
  { iataCode: 'MEL', icaoCode: 'YMML', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', latitude: -37.6733, longitude: 144.8433, timezone: 'Australia/Melbourne' },
  { iataCode: 'BNE', icaoCode: 'YBBN', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', latitude: -27.3833, longitude: 153.1172, timezone: 'Australia/Brisbane' },
  { iataCode: 'PER', icaoCode: 'YPPH', name: 'Perth Airport', city: 'Perth', country: 'Australia', latitude: -31.9403, longitude: 115.9669, timezone: 'Australia/Perth' },
  { iataCode: 'AKL', icaoCode: 'NZAA', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', latitude: -37.0081, longitude: 174.7915, timezone: 'Pacific/Auckland' },
];

const seedAirports = async () => {
  console.log(`Seeding ${airportData.length} airports...`);

  const seen = new Set<string>();
  let inserted = 0;

  for (const airport of airportData) {
    const key = airport.iataCode;
    if (seen.has(key)) continue;
    seen.add(key);

    try {
      await pool.query(
        `INSERT INTO airports (iata_code, icao_code, name, city, country, latitude, longitude, timezone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (iata_code) DO NOTHING`,
        [
          airport.iataCode,
          airport.icaoCode || null,
          airport.name,
          airport.city || null,
          airport.country,
          airport.latitude,
          airport.longitude,
          airport.timezone || null,
        ]
      );
      inserted++;
    } catch (error: any) {
      console.warn(`Failed to insert ${key}: ${error.message}`);
      if (error.detail) console.warn(`  Detail: ${error.detail}`);
    }
  }

  console.log(`Seeded ${inserted} airports (${airportData.length - inserted} duplicates skipped).`);
  await pool.end();
  process.exit(0);
};

seedAirports().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
