import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'GhumoAI — Your AI-Powered Travel Companion for India',
  description:
    'Plan smarter trips across India with AI-powered itinerary planning, budget tracking, smart POI discovery, and virtual tourism guides. Explore Delhi, Jaipur, Goa, and more.',
  keywords: ['travel', 'India', 'AI', 'itinerary', 'trip planner', 'Jaipur', 'Delhi'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
