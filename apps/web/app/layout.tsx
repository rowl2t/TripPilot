import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'TripPilot - AI Travel Assistant',
  description: 'AI itinerary planning, saved SNS places, booking checklist, and calendar sync for confident travel.',
  openGraph: {
    title: 'TripPilot',
    description: 'Plan smarter trips with AI + verified place data',
    images: [{ url: '/og-placeholder.png', alt: 'TripPilot service preview' }]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#f7fafc' }}>
        <a href="#main-content" style={{ position: 'absolute', left: -9999, top: 0 }} onFocus={(e) => (e.currentTarget.style.left = '8px')}>본문으로 건너뛰기</a>
        {children}
      </body>
    </html>
  );
}
