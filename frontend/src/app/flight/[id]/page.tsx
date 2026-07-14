"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const FlightRouteMap = dynamic(() => import('@/components/FlightRouteMap'), { ssr: false });

type AirportInfo = {
  iataCode: string;
  name: string;
  city: string | null;
  country: string;
  latitude: number;
  longitude: number;
};

type FlightData = {
  id: string;
  number: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  direction?: string;
  status: string;
  originDetails: AirportInfo | null;
  destinationDetails: AirportInfo | null;
};

function barcodePattern(id: string): string {
  let seed = 0;
  for (let i = 0; i < id.length; i++) {
    seed = ((seed << 5) - seed + id.charCodeAt(i)) | 0;
  }
  const chars = ['|', '|', '|', ' ', '|', '|', ' ', '|', '|', ' ', '|', ' '];
  let result = '';
  for (let i = 0; i < 40; i++) {
    const idx = ((seed + i * 7) % chars.length + chars.length) % chars.length;
    result += chars[idx];
  }
  return result;
}

export default function FlightDetailPage() {
  const { id } = useParams();
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(true);

  const barcode = useMemo(() => barcodePattern((id as string) || ''), [id]);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + `/api/flights/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setFlight(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-28 px-4 flex justify-center">
      <div className="animate-pulse w-full max-w-4xl bg-brand-cream border-2 border-brand-dark h-80" />
    </div>
  );

  if (!flight) return (
    <div className="min-h-screen pt-28 px-4 text-center">
      <h1 className="text-3xl font-display text-brand-dark mb-4 uppercase tracking-tighter">Flight not found</h1>
      <Link href="/" className="text-xs font-mono font-bold text-brand-green hover:text-brand-dark uppercase tracking-wider">Return to directory</Link>
    </div>
  );

  const statusDisplay = flight.status === 'active' ? 'IN AIR' :
    flight.status === 'scheduled' ? 'ON TIME' :
    flight.status === 'landed' ? 'ARRIVED' :
    flight.status.toUpperCase();

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <Link
          href="/flights"
          className="inline-flex items-center gap-2 text-brand-dark/50 hover:text-brand-dark active:text-brand-dark mb-6 transition-colors text-xs font-mono font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Flights
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row w-full border-4 border-brand-dark shadow-[12px_12px_0px_0px_rgba(24,60,40,1)] bg-white relative"
        >
          {/* Main Left Section */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-brand-green border-b-4 border-brand-dark p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-1.5 border-2 border-brand-dark bg-brand-cream">
                  <Plane className="w-5 h-5 text-brand-dark" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-bold text-brand-dark/60 uppercase tracking-[0.2em] leading-none mb-0.5">Carrier</span>
                  <span className="text-xl font-display text-brand-dark leading-none uppercase">Pakistan Intl</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono font-bold text-brand-dark/60 uppercase tracking-[0.2em] leading-none mb-0.5">Flight</span>
                <span className="text-3xl font-display text-brand-dark leading-none">{flight.number}</span>
              </div>
            </div>

            {/* Giant Route */}
            <div className="p-6 md:p-8 bg-brand-cream flex-1 relative flex flex-col justify-center border-b-4 lg:border-b-0 border-brand-dark">
              <div className="absolute inset-0 opacity-[0.03] text-[7px] font-mono leading-none flex flex-wrap break-all whitespace-pre-wrap select-none overflow-hidden text-brand-dark p-4">
                {'|||| | || | |||| || | | || '.repeat(60)}
              </div>

              <div className="flex justify-between items-center relative z-10 w-full mb-8">
                <div className="flex flex-col w-2/5">
                  <span className="text-[9px] font-mono font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">Origin</span>
                  <span className="text-6xl md:text-7xl lg:text-[120px] font-display text-brand-dark leading-none">{flight.origin === 'UNKNOWN' ? 'TBD' : flight.origin}</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                  <div className="text-3xl md:text-5xl text-brand-green font-display mb-1">→</div>
                  <div className="border-t-2 border-dashed border-brand-dark w-full"></div>
                </div>
                <div className="flex flex-col items-end text-right w-2/5">
                  <span className="text-[9px] font-mono font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">Dest</span>
                  <span className="text-6xl md:text-7xl lg:text-[120px] font-display text-brand-dark leading-none">{flight.destination === 'UNKNOWN' ? 'TBD' : flight.destination}</span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-brand-dark bg-white relative z-10">
                <div className="p-3 border-b-2 md:border-b-0 border-r-2 border-brand-dark flex flex-col justify-center">
                  <span className="text-[9px] font-mono font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">Depart</span>
                  <span className="text-2xl font-mono font-bold text-brand-dark leading-none">{format(new Date(flight.scheduledDeparture), 'HH:mm')}</span>
                  <span className="text-[10px] font-mono font-bold text-brand-dark/60 uppercase mt-0.5">{format(new Date(flight.scheduledDeparture), 'dd MMM')}</span>
                </div>
                <div className="p-3 border-b-2 md:border-b-0 md:border-r-2 border-brand-dark flex flex-col justify-center">
                  <span className="text-[9px] font-mono font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">Gate</span>
                  <span className="text-2xl font-display text-brand-green leading-none">TBD</span>
                  <span className="text-[10px] font-mono font-bold text-brand-dark/60 uppercase mt-0.5">Main Terminal</span>
                </div>
                <div className="p-3 border-r-2 border-brand-dark flex flex-col justify-center">
                  <span className="text-[9px] font-mono font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">Class</span>
                  <span className="text-2xl font-display text-brand-dark leading-none">ECON</span>
                  <span className="text-[10px] font-mono font-bold text-brand-dark/60 uppercase mt-0.5">Standard</span>
                </div>
                <div className="p-3 flex flex-col justify-center bg-brand-cream">
                  <span className="text-[9px] font-mono font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">Status</span>
                  <span className="text-xl font-display text-brand-dark leading-none uppercase">{statusDisplay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stub */}
          <div className="w-full lg:w-72 bg-brand-green border-l-4 border-dashed border-brand-dark p-6 flex flex-col justify-between relative ticket-stub">
            <div className="flex flex-col gap-6 w-full z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono font-bold text-brand-dark/60 uppercase tracking-[0.2em]">Boarding</span>
                <span className="text-4xl font-mono font-bold text-brand-dark leading-none">
                  {format(new Date(new Date(flight.scheduledDeparture).getTime() - 45 * 60000), 'HH:mm')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono font-bold text-brand-dark/60 uppercase tracking-[0.2em]">Passenger</span>
                <span className="text-xl font-display text-brand-dark leading-none uppercase">GUEST-01</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono font-bold text-brand-dark/60 uppercase tracking-[0.2em]">Seq</span>
                <span className="text-xl font-mono font-bold text-brand-dark leading-none">0042</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-4 border-brand-dark w-full flex flex-col items-center z-10">
              <div className="w-full h-16 bg-brand-cream border-2 border-brand-dark flex items-center justify-center overflow-hidden px-2">
                <span className="text-brand-dark text-xs leading-none font-mono tracking-tighter scale-y-[3.5] select-none">
                  {barcode}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-dark mt-3 tracking-[0.3em]">
                {flight.id.substring(0, 10).toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        {flight.originDetails && flight.destinationDetails && (
          <div className="mt-8">
            <FlightRouteMap
              origin={flight.originDetails}
              destination={flight.destinationDetails}
              flightNumber={flight.number}
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-cream border-2 border-brand-dark text-brand-dark text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-brand-cream active:scale-[0.98] transition-all">
            <Calendar className="w-4 h-4" />
            Add to Itinerary
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-green border-2 border-brand-dark text-brand-dark text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-brand-cream active:scale-[0.98] transition-all">
            <Plane className="w-4 h-4" />
            View Route
          </button>
        </div>
      </div>
    </main>
  );
}
