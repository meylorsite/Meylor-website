import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MEYLOR School',
  description: 'Premium education from KG to Grade 12 in Jeddah, Saudi Arabia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
