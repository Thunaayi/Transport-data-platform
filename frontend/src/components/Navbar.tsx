import Link from 'next/link';
import { Plane } from 'lucide-react';
import AuthButton from './AuthButton';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-primary-500 rounded-lg">
            <Plane className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-white font-display">
            PT <span className="text-primary-500">Live</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <Link href="/" className="hover:text-primary-500 transition-colors">Flights</Link>
            <Link href="/" className="hover:text-primary-500 transition-colors opacity-50 cursor-not-allowed">Trains</Link>
          </div>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
