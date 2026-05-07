"use client";

import { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

type Flight = {
  id: string;
  number: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: string;
};

const SEARCH_INPUT_CLASS = "block w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none";
const FLIGHT_CARD_CLASS = "bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 transition-all hover:border-zinc-700 cursor-pointer group";
const META_LABEL_CLASS = "text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1";
const META_LABEL_CLASS_NO_MB = "text-[10px] font-bold text-zinc-500 uppercase tracking-widest";

const PAKISTANI_AIRPORTS = ['KHI', 'ISB', 'LHE', 'PEW', 'MUX', 'UET', 'LYP', 'SKT', 'MJD', 'GWD', 'TUK', 'UDR', 'KDD', 'RYK', 'SKZ'];

const isDomesticRoute = (origin: string, destination: string) => {
  if (destination === 'UNKNOWN') return true; 
  return PAKISTANI_AIRPORTS.includes(origin) && PAKISTANI_AIRPORTS.includes(destination);
};

const formatAirportCode = (code: string) => {
  return code === 'UNKNOWN' ? 'TBD' : code;
};

const formatFlightStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'IN AIR';
    case 'scheduled': return 'ON TIME';
    case 'landed': return 'ARRIVED';
    case 'cancelled': return 'CANCELLED';
    case 'incident': return 'DELAYED';
    case 'diverted': return 'DIVERTED';
    default: return status.toUpperCase();
  }
};

function SkeletonCard() {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-2.5 w-8 bg-zinc-800 rounded" />
            <div className="h-6 w-16 bg-zinc-800 rounded" />
          </div>
          <div className="h-10 w-px bg-zinc-800 hidden md:block" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-32 bg-zinc-800 rounded" />
            <div className="h-2 w-24 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-8">
            <div className="flex flex-col gap-1.5">
              <div className="h-2 w-12 bg-zinc-800 rounded" />
              <div className="h-5 w-10 bg-zinc-800 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-2 w-12 bg-zinc-800 rounded" />
              <div className="h-5 w-10 bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="h-5 w-20 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function FlightSearch() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'departures' | 'arrivals'>('all');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/flights');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFlights(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const filteredFlights = flights.filter(flight => {
    // 1. Text Search
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
                          flight.number.toLowerCase().includes(searchLower) || 
                          flight.origin.toLowerCase().includes(searchLower) ||
                          flight.destination.toLowerCase().includes(searchLower);

    // 2. Category Filter (Arrival vs Departure)
    const isOriginPK = PAKISTANI_AIRPORTS.includes(flight.origin);
    const isDestPK = PAKISTANI_AIRPORTS.includes(flight.destination);

    let matchesFilter = true;
    if (filter === 'departures') {
      matchesFilter = isOriginPK;
    } else if (filter === 'arrivals') {
      matchesFilter = isDestPK;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by flight number (e.g. PK303) or city code..."
          className={SEARCH_INPUT_CLASS}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'departures', 'arrivals'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === f 
                ? 'bg-primary-500 text-black' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <AnimatePresence>
            {filteredFlights.length > 0 ? filteredFlights.map((flight) => {
              const isDomestic = isDomesticRoute(flight.origin, flight.destination);
              const routeTypeLabel = isDomestic ? 'DOMESTIC' : 'INTERNATIONAL';
              return (
              <Link href={`/flight/${flight.id}`} key={flight.id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={FLIGHT_CARD_CLASS}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col font-sans">
                      <span className={META_LABEL_CLASS}>Flight</span>
                      <span className="text-2xl font-black text-white leading-none font-display">
                        {flight.number}
                      </span>
                    </div>
                    
                    <div className="h-10 w-px bg-zinc-800 hidden md:block" />

                    <div className="font-sans">
                      <div className="flex items-center gap-3 text-2xl font-bold text-white tracking-tight font-display">
                        <span>{formatAirportCode(flight.origin)}</span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full border border-zinc-700" />
                          <div className="w-8 border-t border-zinc-700 border-dashed" />
                          <div className="w-2 h-2 rounded-full bg-zinc-700" />
                        </div>
                        <span>{formatAirportCode(flight.destination)}</span>
                      </div>
                      <span className={META_LABEL_CLASS_NO_MB}>{routeTypeLabel} SCHEDULED</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 w-full md:w-auto border-t border-zinc-800 pt-4 md:border-0 md:pt-0 font-sans">
                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <div className="flex flex-col">
                        <span className={META_LABEL_CLASS_NO_MB}>Departure</span>
                        <span className="text-lg font-bold text-white leading-none">{format(new Date(flight.scheduledDeparture), 'HH:mm')}</span>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <span className={META_LABEL_CLASS_NO_MB}>Arrival</span>
                        <span className="text-lg font-bold text-white leading-none">{format(new Date(flight.scheduledArrival), 'HH:mm')}</span>
                      </div>
                    </div>
                    
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${
                      flight.status === 'scheduled' 
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700' 
                        : 'bg-primary-500/10 text-primary-500 border-primary-500/20'
                    }`}>
                      {flight.status === 'scheduled' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {formatFlightStatus(flight.status)}
                    </div>
                  </div>

                  </div>
                </motion.div>
              </Link>
            )}) : (
              <div className="text-center py-12 text-zinc-500 font-medium">
                <p>No flights found matching your search.</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
