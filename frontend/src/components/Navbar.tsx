import Link from 'next/link';
import { Plane } from 'lucide-react';
import AuthButton from './AuthButton';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/flights', label: 'Flights' },
  { href: '/buses', label: 'Buses' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 w-full z-50 border-b-2 border-brand-dark bg-brand-cream/95 backdrop-blur-sm"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 active:scale-95 transition-transform">
          <div className="p-1.5 bg-brand-green border-2 border-brand-dark">
            <Plane className="w-4 h-4 text-brand-dark" />
          </div>
          <span className="text-xl font-display tracking-widest uppercase text-brand-dark ml-1">
            PT
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5 text-xs font-bold text-brand-dark uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-green transition-colors active:text-brand-green"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
