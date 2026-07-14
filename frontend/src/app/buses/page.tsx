'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BusRoute {
  id: string;
  slug: string;
  name: string;
  formalName: string | null;
  image: string | null;
  typeId: number | null;
}

export default function BusesPage() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getRouteHighlight = (route: BusRoute) => {
    const slug = route.slug.toUpperCase();
    if (slug.startsWith('R-') && slug.length <= 4) {
      return { label: 'Peoples Bus Service', bg: 'bg-red-600', text: 'text-white' };
    }
    if (slug.includes('GREEN-LINE')) {
      return { label: 'Green Line BRT', bg: 'bg-green-600', text: 'text-white' };
    }
    if (slug.includes('ORANGE-LINE')) {
      return { label: 'Orange Line BRT', bg: 'bg-orange-500', text: 'text-white' };
    }
    return null;
  };

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/buses/routes')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch buses');
        return res.json();
      })
      .then((data) => {
        setRoutes(data.routes);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end border-b-2 border-brand-dark pb-4 mb-8 gap-3">
          <div>
            <p className="text-xs font-mono font-bold text-brand-dark/50 uppercase tracking-[0.25em] mb-2">
              Ground Transport
            </p>
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-brand-dark">Bus Routes</h1>
            <p className="text-brand-dark/60 font-mono text-xs mt-1">Karachi Metropolitan Area</p>
          </div>
          <div className="font-mono text-[10px] uppercase bg-brand-green border-2 border-brand-dark text-brand-dark px-3 py-1.5 font-bold">
            Schedule
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 font-mono text-xs mb-6">
            ERROR: {error}
          </div>
        )}

        {loading ? (
          <div className="font-mono text-brand-dark/50 animate-pulse uppercase text-xs">Fetching timetable...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => {
              const highlight = getRouteHighlight(route);
              return (
                <Link key={route.id} href={`/buses/${route.slug}`} className="group block">
                  <div className="border-2 border-brand-dark bg-white hover:bg-brand-cream transition-colors active:scale-[0.98]">
                    {highlight && (
                      <div className={`h-1.5 ${highlight.bg}`} />
                    )}
                    <div className={`border-b-2 border-brand-dark p-4 flex justify-between items-start ${highlight ? '' : ''}`}>
                      <div>
                        {highlight && (
                          <div className={`font-mono text-[9px] uppercase px-1.5 py-0.5 inline-block mb-1.5 font-bold ${highlight.bg} ${highlight.text}`}>
                            {highlight.label}
                          </div>
                        )}
                        <span className="font-display text-xl font-bold block text-brand-dark">{route.name}</span>
                      </div>
                      {route.typeId && (
                        <span className="font-mono text-[9px] uppercase border border-brand-dark px-1.5 py-0.5 shrink-0 ml-2 text-brand-dark/60">
                          Type {route.typeId}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-brand-dark/60 leading-5 line-clamp-2">
                        {route.formalName || `${route.name} Standard Route`}
                      </p>
                      <div className="mt-3 font-mono text-[10px] text-brand-green font-bold uppercase tracking-wider group-hover:text-brand-dark transition-colors">
                        View route →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
