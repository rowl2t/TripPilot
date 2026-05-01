import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'TripPilot - AI Travel Assistant',
  description: 'AI itinerary planning, saved SNS places, booking checklist, and calendar sync for confident travel.',
  openGraph: {
    title: 'TripPilot',
    description: 'Plan smarter trips with AI + verified place data',
    images: ['/og-placeholder.png']
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#f7fafc' }}>{children}</body>
    </html>
  );
}
