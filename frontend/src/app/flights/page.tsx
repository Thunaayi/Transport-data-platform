import FlightSearch from '@/components/FlightSearch';

export default function FlightsPage() {
  return (
    <main className="flex-1 min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display text-brand-dark">Flights</h1>
          <p className="mt-2 text-sm text-brand-dark/60 leading-7 max-w-2xl">
            Browse arrivals and departures across Pakistan airports. Search by flight number, origin, or destination.
          </p>
        </div>

        <div className="border-2 border-brand-dark bg-brand-cream p-6">
          <FlightSearch />
        </div>
      </div>
    </main>
  );
}
