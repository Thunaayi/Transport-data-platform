"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plane, ArrowLeft, Clock, ShieldCheck, MapPin, Calendar, PlaneTakeoff, PlaneLanding, Info } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function FlightDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen pt-32 px-4 flex justify-center">
      <div className="animate-pulse w-full max-w-2xl bg-zinc-900/50 h-96 rounded-3xl border border-zinc-800" />
    </div>
  );

  if (!flight) return (
    <div className="min-h-screen pt-32 px-4 text-center">
      <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Flight not found</h1>
      <button onClick={() => router.push('/')} className="text-primary-500 font-bold hover:underline">Return to dashboard</button>
    </div>
  );

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 flex flex-col items-center bg-[#050505]">
      <div className="w-full max-w-2xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to directory
        </button>

        {/* Boarding Pass Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header Section */}
          <div className="bg-primary-500 px-8 py-8 flex justify-between items-center border-b border-black/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl shadow-xl">
                <Plane className="w-6 h-6 text-primary-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 leading-none mb-1">Carrier</span>
                <span className="text-2xl font-black text-black leading-none font-display tracking-tight uppercase">Pakistan Intl</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40 leading-none mb-1">Flight Number</span>
              <span className="text-3xl font-black text-black leading-none font-display">{flight.number}</span>
            </div>
          </div>

          {/* Main Route Section */}
          <div className="p-10 space-y-12 bg-[#0a0a0a]">
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col">
                <span className="text-6xl md:text-8xl font-black text-white font-display tracking-tighter leading-none">{flight.origin === 'UNKNOWN' ? 'TBD' : flight.origin}</span>
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-4 ml-1">Departure Port</span>
              </div>
              
              <div className="flex-1 flex flex-col items-center px-6">
                <div className="w-full flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                  <div className="flex-1 border-t-2 border-zinc-800 border-dashed relative">
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-zinc-700 bg-[#0a0a0a] px-1" />
                  </div>
                  <div className="w-2 h-2 rounded-full border-2 border-zinc-800" />
                </div>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-6">Active Route</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-6xl md:text-8xl font-black text-white font-display tracking-tighter leading-none">{flight.destination === 'UNKNOWN' ? 'TBD' : flight.destination}</span>
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-4 mr-1">Arrival Port</span>
              </div>
            </div>

            {/* Tactical Grid Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 pt-10 border-t border-zinc-800/50">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Time</span>
                <span className="text-2xl font-bold text-white leading-none font-display">{format(new Date(flight.scheduledDeparture), 'HH:mm')}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">{format(new Date(flight.scheduledDeparture), 'dd MMM')}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Gate</span>
                <span className="text-2xl font-bold text-primary-500 leading-none font-display">A-24</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Main Concourse</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Class</span>
                <span className="text-2xl font-bold text-white leading-none font-display">Y-CLASS</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Economy Premium</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-xl font-bold text-white leading-none font-display uppercase">
                    {flight.status === 'active' ? 'IN AIR' : 
                     flight.status === 'scheduled' ? 'ON TIME' : 
                     flight.status === 'landed' ? 'ARRIVED' : 
                     flight.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Verified Live</span>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="bg-[#0a0a0a] px-10 py-4">
            <div className="border-t border-zinc-800 border-dashed h-px w-full" />
          </div>

          {/* Boarding stub section */}
          <div className="bg-zinc-950 p-10 flex justify-between items-center">
            <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Boarding</span>
                <span className="text-3xl font-black text-white leading-none font-display">14:20</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Passenger</span>
                <span className="text-3xl font-black text-zinc-400 leading-none font-display">GUEST-01</span>
              </div>
            </div>

            {/* QR/Data Stub */}
            <div className="flex items-center gap-6">
              <div className="h-16 w-32 border border-zinc-800 rounded flex flex-col items-center justify-center px-4">
                 <div className="w-full h-1 bg-zinc-800 rounded-full mb-1" />
                 <div className="w-full h-1 bg-zinc-800 rounded-full mb-1" />
                 <div className="w-2/3 h-1 bg-zinc-800 rounded-full" />
                 <span className="text-[8px] font-black text-zinc-700 mt-2 tracking-widest">PK-77421-LOG</span>
              </div>
              <div className="w-20 h-20 bg-primary-500 p-1.5 rounded-xl shadow-lg shadow-primary-500/10">
                <div className="w-full h-full bg-black rounded-lg flex items-center justify-center p-2">
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-primary-500" style={{ opacity: Math.random() > 0.3 ? 1 : 0.1 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer actions */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <button className="flex-1 flex items-center justify-center gap-3 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all">
            <Calendar className="w-4 h-4 text-primary-500" />
            Add to Wallet
          </button>
          <button className="flex-1 flex items-center justify-center gap-3 py-5 bg-primary-500 rounded-2xl text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all transform hover:-translate-y-1">
            <Info className="w-4 h-4" />
            Live Flight Map
          </button>
        </div>
      </div>
    </main>
  );
}
