'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bus, MapPin, GripHorizontal } from 'lucide-react';

const BusRouteMap = dynamic(() => import('@/components/BusRouteMap'), { ssr: false });

interface Stop {
  stopOrder: number;
  stopId: string;
  slug: string;
  nameEnglish: string;
  latitude: number | null;
  longitude: number | null;
}

interface BusRouteDetail {
  id: string;
  slug: string;
  name: string;
  formalName: string | null;
  image: string | null;
  typeId: number | null;
  stops: Stop[];
}

const SHEET_PEEK_H = 120;

export default function BusRoutePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [route, setRoute] = useState<BusRouteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + `/api/buses/routes/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch route details');
        return res.json();
      })
      .then((data) => {
        setRoute(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const getRouteHighlight = (routeSlug: string) => {
    const upper = routeSlug.toUpperCase();
    if (upper.startsWith('R-') && upper.length <= 4) {
      return { label: 'Peoples Bus Service', bg: 'bg-red-600', text: 'text-white' };
    }
    if (upper.includes('GREEN-LINE')) {
      return { label: 'Green Line BRT', bg: 'bg-green-600', text: 'text-white' };
    }
    if (upper.includes('ORANGE-LINE')) {
      return { label: 'Orange Line BRT', bg: 'bg-orange-500', text: 'text-white' };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="font-mono text-brand-dark/50 animate-pulse uppercase tracking-widest text-sm">
            Loading Manifest...
          </div>
        </main>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 pt-32 pb-8">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 font-mono text-sm mb-6">
            ERROR: {error || 'Route not found'}
          </div>
          <Link href="/buses" className="font-mono text-xs text-brand-dark hover:underline uppercase">
            ← Return to Routes
          </Link>
        </main>
      </div>
    );
  }

  const highlight = getRouteHighlight(route.slug);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Map fills the viewport minus navbar */}
      <div className="fixed inset-0 top-16 z-0">
        <BusRouteMap stops={route.stops} routeName={route.name} className="h-full border-0" />
      </div>

      {/* Back button floating on map */}
      <Link
        href="/buses"
        className="fixed top-20 left-4 z-20 flex items-center gap-2 bg-brand-cream border-2 border-brand-dark px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-dark hover:bg-brand-green transition-colors active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        All Routes
      </Link>

      {/* Desktop side panel */}
      <div className="hidden md:block fixed top-16 right-0 bottom-0 w-80 z-10 border-l-2 border-brand-dark bg-white">
        <div className="bg-brand-dark text-brand-cream px-5 py-4 flex items-center gap-2">
          <Bus className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-[0.2em]">Route Manifest</span>
        </div>
        <div className="overflow-y-auto h-full pb-16">
          {highlight && (
            <div className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest ${highlight.bg} ${highlight.text}`}>
              {highlight.label}
            </div>
          )}
          <div className="px-5 py-4 border-b-2 border-brand-dark">
            <p className="text-[10px] font-black text-brand-dark/60 uppercase tracking-[0.2em]">Route</p>
            <p className="text-3xl font-display text-brand-dark mt-1">{route.name}</p>
            {route.formalName && (
              <p className="text-sm text-brand-dark/70 mt-1">{route.formalName}</p>
            )}
          </div>
          <div className="px-5 py-3 border-b-2 border-brand-dark bg-brand-cream flex justify-between">
            <span className="font-mono text-xs font-bold text-brand-dark">{route.stops.length} stops</span>
            {route.typeId && (
              <span className="font-mono text-xs font-bold text-brand-dark/60">Type {route.typeId}</span>
            )}
          </div>
          <div className="relative pl-10 pr-5 py-4">
            {route.stops.map((stop, i) => (
              <div key={stop.stopId} className="relative pb-5 last:pb-0">
                {i < route.stops.length - 1 && (
                  <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-brand-dark/20" />
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 mt-1 shrink-0 rounded-full border-2 border-brand-dark ${i === 0 ? 'bg-brand-green' : i === route.stops.length - 1 ? 'bg-brand-dark' : 'bg-white'}`} />
                  <div>
                    <span className="text-[10px] font-black text-brand-dark/40 uppercase tracking-wider block">
                      Stop {stop.stopOrder.toString().padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-brand-dark mt-0.5 block">
                      {stop.nameEnglish}
                    </span>
                    {stop.latitude && stop.longitude && (
                      <span className="font-mono text-[10px] text-brand-dark/40 mt-0.5 block">
                        {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <motion.div
          layout
          className="bg-brand-cream border-t-2 border-brand-dark"
          animate={{ height: expanded ? 'auto' : SHEET_PEEK_H }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Drag handle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex flex-col items-center pt-2 pb-1 gap-0.5 active:bg-brand-dark/5 transition-colors"
          >
            <GripHorizontal className="w-5 h-5 text-brand-dark/40" />
          </button>

          {/* Peek content (always visible) */}
          {highlight && (
            <div className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-widest ${highlight.bg} ${highlight.text}`}>
              {highlight.label}
            </div>
          )}
          <div className="px-5 pb-4 flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-2xl font-display text-brand-dark truncate">{route.name}</p>
              {route.formalName && (
                <p className="text-xs text-brand-dark/70 mt-0.5 truncate">{route.formalName}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-black text-brand-dark/50 uppercase tracking-[0.2em]">Stops</p>
              <p className="text-xl font-display text-brand-dark">{route.stops.length}</p>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-y-auto border-t-2 border-brand-dark"
                style={{ maxHeight: 'calc(100vh - 280px)' }}
              >
                <div className="relative pl-10 pr-5 py-4">
                  {route.stops.map((stop, i) => (
                    <div key={stop.stopId} className="relative pb-5 last:pb-0">
                      {i < route.stops.length - 1 && (
                        <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-brand-dark/20" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 mt-1 shrink-0 rounded-full border-2 border-brand-dark ${i === 0 ? 'bg-brand-green' : i === route.stops.length - 1 ? 'bg-brand-dark' : 'bg-white'}`} />
                        <div>
                          <span className="text-[10px] font-black text-brand-dark/40 uppercase tracking-wider block">
                            Stop {stop.stopOrder.toString().padStart(2, '0')}
                          </span>
                          <span className="text-base font-bold text-brand-dark mt-0.5 block">
                            {stop.nameEnglish}
                          </span>
                          {stop.latitude && stop.longitude && (
                            <span className="font-mono text-[10px] text-brand-dark/40 mt-0.5 block">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
