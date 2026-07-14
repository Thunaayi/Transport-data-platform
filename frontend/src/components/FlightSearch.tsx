"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
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
  direction?: 'departure' | 'arrival' | 'unknown';
  status: string;
};

const SEARCH_INPUT_CLASS = "block w-full pl-12 pr-4 py-4 bg-brand-cream border-2 border-brand-dark text-brand-dark placeholder-brand-dark/50 focus:ring-0 focus:outline-none focus:bg-white text-base font-bold transition-colors uppercase";
const META_LABEL_CLASS = "text-[10px] font-bold text-brand-dark/70 uppercase tracking-[0.2em]";

const PAKISTANI_AIRPORTS = ['KHI', 'ISB', 'LHE', 'PEW', 'MUX', 'UET', 'LYP', 'SKT', 'MJD', 'GWD', 'TUK', 'UDR', 'KDD', 'RYK', 'SKZ'];

const formatFlightStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'IN AIR';
    case 'scheduled': return 'ON TIME';
    case 'landed': return 'ARRIVED';
    case 'arrived': return 'ARRIVED';
    case 'cancelled': return 'CANCELLED';
    case 'incident': return 'DELAYED';
    case 'delayed': return 'DELAYED';
    case 'diverted': return 'DIVERTED';
    case 'on_time': return 'ON TIME';
    default: return status.toUpperCase();
  }
};

const statusColor = (status: string): string => {
  const s = status.toLowerCase();
  if (s === 'arrived' || s === 'landed') return 'bg-brand-dark text-brand-cream';
  if (s === 'on_time' || s === 'scheduled') return 'bg-brand-green text-brand-dark';
  if (s === 'delayed' || s === 'incident') return 'bg-yellow-500 text-brand-dark';
  if (s === 'cancelled') return 'bg-red-600 text-white';
  if (s === 'diverted') return 'bg-orange-500 text-white';
  return 'bg-brand-cream text-brand-dark border-2 border-brand-dark';
};

function SkeletonRow() {
  return (
    <div className="flex w-full animate-pulse opacity-50 border-2 border-brand-dark">
      <div className="flex-1 bg-white h-14 p-4"></div>
      <div className="w-24 bg-brand-green h-14"></div>
    </div>
  );
}

export default function FlightSearch() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'departures' | 'arrivals'>('all');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const pullRef = useRef(false);

  const fetchFlights = useCallback(async () => {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/flights');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFlights(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY <= 0) {
      touchStartY.current = e.touches[0].clientY;
      pullRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pullRef.current || refreshing) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 0) {
      const damped = Math.min(dy * 0.4, 80);
      setPullDistance(damped);
    }
  }, [refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!pullRef.current) return;
    pullRef.current = false;
    if (pullDistance > 55 && !refreshing) {
      setRefreshing(true);
      setLoading(true);
      await fetchFlights();
      setRefreshing(false);
    }
    setPullDistance(0);
  }, [pullDistance, refreshing, fetchFlights]);

  const filteredFlights = flights.filter(flight => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
                          flight.number.toLowerCase().includes(searchLower) || 
                          flight.origin.toLowerCase().includes(searchLower) ||
                          flight.destination.toLowerCase().includes(searchLower);

    if (flight.direction === 'departure' || flight.direction === 'arrival' || flight.direction === 'unknown') {
      const matchesDirection =
        filter === 'all' ||
        (filter === 'departures' && flight.direction === 'departure') ||
        (filter === 'arrivals' && flight.direction === 'arrival');
      return matchesSearch && matchesDirection;
    }

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
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredFlights.length / PAGE_SIZE));
  const paginatedFlights = filteredFlights.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const Pagination = () => (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        disabled={page <= 1}
        onClick={() => setPage(p => Math.max(p - 1, 1))}
        className={`px-4 py-2 border-2 border-brand-dark font-bold uppercase tracking-[0.2em] text-sm ${page <= 1 ? 'bg-brand-cream text-brand-dark opacity-50 cursor-not-allowed' : 'bg-brand-dark text-brand-cream hover:bg-brand-green active:scale-95'} transition-all`}
      >Prev</button>
      <span className="text-brand-dark font-mono text-sm font-bold">{page} / {totalPages}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
        className={`px-4 py-2 border-2 border-brand-dark font-bold uppercase tracking-[0.2em] text-sm ${page >= totalPages ? 'bg-brand-cream text-brand-dark opacity-50 cursor-not-allowed' : 'bg-brand-dark text-brand-cream hover:bg-brand-green active:scale-95'} transition-all`}
      >Next</button>
    </div>
  );

  return (
    <div
      className="w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div
          className="flex items-center justify-center gap-2 text-brand-dark/60 text-xs font-black uppercase tracking-[0.2em] transition-all mb-4"
          style={{ opacity: Math.min(pullDistance / 40, 1), height: pullDistance + 8 }}
        >
          <RefreshCw className={`w-4 h-4 ${pullDistance > 55 ? 'text-brand-green' : ''}`} />
          {pullDistance > 55 ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}
      {refreshing && (
        <div className="flex items-center justify-center gap-2 text-brand-green text-xs font-black uppercase tracking-[0.2em] py-2 mb-4">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Refreshing...
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] font-black text-brand-dark/70 mb-2">Flight Status</p>
          <h2 className="text-2xl md:text-3xl font-display text-brand-dark">Flight status dashboard</h2>
        </div>
        {lastUpdated && (
          <div className="border-2 border-brand-dark bg-brand-cream px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-brand-dark font-mono">
            {format(lastUpdated, 'HH:mm:ss, dd MMM')}
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-brand-dark" />
          </div>
          <input
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="Search Flight No. or City..."
            className={SEARCH_INPUT_CLASS}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex border-2 border-brand-dark bg-brand-cream">
          {(['all', 'departures', 'arrivals'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-3 text-sm font-black uppercase tracking-[0.2em] transition-all border-r-2 last:border-r-0 border-brand-dark active:scale-95 ${
                filter === f 
                  ? 'bg-brand-dark text-brand-cream' 
                  : 'bg-brand-cream text-brand-dark hover:bg-brand-green'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header - Desktop only */}
      <div className="hidden md:flex border-2 border-b-0 border-brand-dark bg-brand-dark text-brand-cream text-xs font-black uppercase tracking-[0.2em]">
        <div className="w-36 px-4 py-3 border-r border-brand-cream/20">Flight</div>
        <div className="flex-1 px-4 py-3 border-r border-brand-cream/20">Route</div>
        <div className="w-24 px-4 py-3 border-r border-brand-cream/20">Depart</div>
        <div className="w-24 px-4 py-3 border-r border-brand-cream/20">Arrive</div>
        <div className="w-28 px-4 py-3 text-center">Status</div>
      </div>

      {/* Results */}
      <div className="space-y-[1px] bg-brand-dark">
        {loading ? (
          <div className="space-y-[1px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {paginatedFlights.map((flight) => (
              <Link href={`/flight/${flight.id}`} key={flight.id} className="block">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="group border-2 border-t-0 border-brand-dark bg-white hover:bg-brand-cream transition-colors active:bg-brand-cream"
                >
                  {/* Desktop row */}
                  <div className="hidden md:flex items-center">
                    <div className="w-36 px-4 py-4 border-r-2 border-brand-dark">
                      <span className="font-display text-lg text-brand-dark">{flight.number}</span>
                    </div>
                    <div className="flex-1 px-4 py-4 border-r-2 border-brand-dark">
                      <span className="font-mono text-sm font-bold text-brand-dark">
                        {flight.origin} <span className="text-brand-green mx-2">→</span> {flight.destination}
                      </span>
                    </div>
                    <div className="w-24 px-4 py-4 border-r-2 border-brand-dark">
                      <span className="font-mono text-sm font-bold text-brand-dark">
                        {format(new Date(flight.scheduledDeparture), 'HH:mm')}
                      </span>
                    </div>
                    <div className="w-24 px-4 py-4 border-r-2 border-brand-dark">
                      <span className="font-mono text-sm font-bold text-brand-dark">
                        {format(new Date(flight.scheduledArrival), 'HH:mm')}
                      </span>
                    </div>
                    <div className="w-28 px-3 py-4 flex justify-center">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusColor(flight.status)}`}>
                        {formatFlightStatus(flight.status)}
                      </span>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="flex md:hidden items-center p-4">
                    <div className="flex-1 min-w-0">
                      <span className="font-display text-base text-brand-dark block">{flight.number}</span>
                      <span className="font-mono text-xs text-brand-dark/70 mt-1 block">
                        {flight.origin} → {flight.destination}
                      </span>
                      <span className="font-mono text-xs text-brand-dark/50 mt-0.5 block">
                        {format(new Date(flight.scheduledDeparture), 'HH:mm')} — {format(new Date(flight.scheduledArrival), 'HH:mm')}
                      </span>
                    </div>
                    <span className={`shrink-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${statusColor(flight.status)}`}>
                      {formatFlightStatus(flight.status)}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredFlights.length === 0 && (
        <div className="border-2 border-brand-dark bg-brand-cream p-8 text-center">
          <p className="font-mono text-sm text-brand-dark/60">No flights match your search.</p>
        </div>
      )}

      {!loading && filteredFlights.length > 0 && <Pagination />}
    </div>
  );
}
