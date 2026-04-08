import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serene Wall Calendar',
  description: 'Interactive wall calendar inspired by the provided design reference.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
