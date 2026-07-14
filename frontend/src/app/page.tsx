import Link from 'next/link';
import { ArrowRight, Bus, Plane, Train } from 'lucide-react';

const modes = [
  {
    title: 'Flights',
    description: 'Search arrivals and departures across Pakistan airports.',
    icon: Plane,
    active: true,
    href: '/flights',
  },
  {
    title: 'Buses',
    description: 'Karachi Metropolitan bus routes with map and stops.',
    icon: Bus,
    active: true,
    href: '/buses',
  },
  {
    title: 'Trains',
    description: 'Route and schedule data coming soon.',
    icon: Train,
    active: false,
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-mono font-bold text-brand-dark/50 uppercase tracking-[0.25em] mb-3">
              Flight tracker
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-brand-dark leading-tight tracking-tight mb-4">
              Flight status across Pakistan
            </h1>
            <p className="text-base leading-7 text-brand-dark/70 max-w-2xl">
              Search flights by number, origin, or destination. Track arrivals, departures, and delays.
            </p>
            <div className="mt-6">
              <Link
                href="/flights"
                className="inline-flex items-center gap-3 bg-brand-dark text-brand-cream px-5 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-green transition-colors active:scale-95"
              >
                View flights
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return mode.active && mode.href ? (
                <Link
                  key={mode.title}
                  href={mode.href}
                  className="border-2 border-brand-dark bg-white p-5 hover:bg-brand-cream transition-colors group active:scale-[0.98]"
                >
                  <Icon className="w-5 h-5 text-brand-dark mb-3" />
                  <h2 className="text-lg font-display text-brand-dark mb-1">{mode.title}</h2>
                  <p className="text-sm text-brand-dark/60 leading-6 mb-3">{mode.description}</p>
                  <span className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-wider group-hover:text-brand-dark transition-colors">
                    Operational →
                  </span>
                </Link>
              ) : (
                <div
                  key={mode.title}
                  className="border-2 border-brand-dark bg-brand-cream/50 p-5"
                >
                  <Icon className="w-5 h-5 text-brand-dark/40 mb-3" />
                  <h2 className="text-lg font-display text-brand-dark/50 mb-1">{mode.title}</h2>
                  <p className="text-sm text-brand-dark/40 leading-6 mb-3">{mode.description}</p>
                  <span className="text-[10px] font-mono font-bold text-brand-dark/30 uppercase tracking-wider">
                    Coming soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
