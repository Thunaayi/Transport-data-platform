import FlightSearch from '@/components/FlightSearch';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center pt-28 px-4 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col items-center text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none mb-4">
          Pakistan Transport <span className="text-primary-500">Live</span>
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-xl leading-relaxed">
          Real-time flight statuses and crowd sourced updates across Pakistan.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <FlightSearch />
      </div>
    </main>
  );
}
