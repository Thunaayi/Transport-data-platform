import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex-1 min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-mono font-bold text-brand-dark/50 uppercase tracking-[0.25em] mb-3">
          About
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-brand-dark leading-tight tracking-tight mb-6">
          An operations board for Pakistan&apos;s transport network.
        </h1>
        <div className="space-y-4 text-sm leading-7 text-brand-dark/70">
          <p>
            Flight data sourced from the Pakistan Airports Authority and Aviationstack. Bus routes from mnzil.app. Map data from OpenStreetMap.
          </p>
          <p>
            This is a dashboard for searching, filtering, and tracking flight and bus information across Pakistan. No ads, no marketing — just the data in a clean interface.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/flights"
            className="inline-flex items-center gap-3 bg-brand-dark text-brand-cream px-5 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-green transition-colors active:scale-95"
          >
            View flights
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
