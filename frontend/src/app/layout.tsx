import type { Metadata } from 'next';
import { Inter, Barlow } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const barlow = Barlow({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow'
});

export const metadata: Metadata = {
  title: 'Transport Data Platform',
  description: 'Track flights and trains in real-time across Pakistan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col relative`}>
        <Navbar />
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[200px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
