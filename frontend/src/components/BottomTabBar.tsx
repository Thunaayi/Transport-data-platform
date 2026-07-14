'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Bus, Bell, Info } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: Plane },
  { href: '/flights', label: 'Flights', icon: Bell },
  { href: '/buses', label: 'Buses', icon: Bus },
  { href: '/about', label: 'About', icon: Info },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleTabClick = (e: React.MouseEvent, href: string) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    if (active) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t-2 border-brand-dark bg-brand-cream pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={(e) => handleTabClick(e, tab.href)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors active:scale-90 ${
                active
                  ? 'text-brand-dark'
                  : 'text-brand-dark/50 hover:text-brand-dark/80'
              }`}
            >
              <div className={`p-1 rounded transition-colors ${
                active ? 'bg-brand-green' : ''
              }`}>
                <Icon className={`w-4 h-4 ${active ? 'text-brand-dark' : ''}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${
                active ? 'text-brand-dark' : ''
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
