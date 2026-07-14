import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-2 border-brand-dark bg-brand-cream text-brand-dark py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <Link href="/flights" className="hover:text-brand-green transition-colors">Flights</Link>
            <span className="text-brand-dark/20">|</span>
            <Link href="/buses" className="hover:text-brand-green transition-colors">Buses</Link>
            <span className="text-brand-dark/20">|</span>
            <Link href="/about" className="hover:text-brand-green transition-colors">About</Link>
          </div>
          <p className="text-brand-dark/50 text-[10px]">
            © 2026 Pakistan Transport
          </p>
        </div>
      </div>
    </footer>
  );
}
