import type { Metadata } from 'next';
import { Inter, Archivo_Black, Inconsolata } from 'next/font/google';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
import Navbar from '@/components/Navbar';
import BottomTabBar from '@/components/BottomTabBar';
import Footer from '@/components/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const archivoBlack = Archivo_Black({ 
  subsets: ['latin'], 
  weight: ['400'],
  variable: '--font-archivo'
});

const inconsolata = Inconsolata({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono-display',
});

export const metadata: Metadata = {
  title: 'Pakistan Transport — Flight & Bus Dashboard',
  description: 'Real-time flight statuses across Pakistani airports',
  applicationName: 'Pakistan Transport',
  appleWebApp: {
    capable: true,
    title: 'Pakistan Transport',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
  },
  manifest: '/manifest.json',
  other: {
    'theme-color': '#f3f2eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivoBlack.variable} ${inconsolata.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col relative`}>
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <BottomTabBar />
        <Footer />
      </body>
    </html>
  );
}
