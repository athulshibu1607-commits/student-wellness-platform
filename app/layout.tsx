import type { Metadata } from 'next';
import './globals.css';
import { StateProvider } from '@/components/StateContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CrisisModal } from '@/components/ui/CrisisModal';

export const metadata: Metadata = {
  title: {
    default: 'Jijnasu — Engineering Student Wellness & Productivity Platform',
    template: '%s | Jijnasu'
  },
  description: 'The intelligent workspace for engineering students to manage academic pressure, deep focus, cognitive wellbeing, and progress in one calm system.',
  keywords: [
    'Jijnasu',
    'engineering student productivity',
    'study planner',
    'focus studio',
    'student wellness',
    'MentorAI',
    'academic burnout prevention',
    'GATE preparation',
    'engineering education'
  ],
  authors: [{ name: 'Jijnasu Platform' }],
  creator: 'Jijnasu Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://jijnasu.edu'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Jijnasu — Engineering Student Wellness & Productivity Platform',
    description: 'Study smarter. Feel better. Build your future. The calm command cockpit designed specifically for engineering scholars.',
    siteName: 'Jijnasu'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jijnasu — Engineering Student Wellness & Productivity Platform',
    description: 'Study smarter. Feel better. Build your future. A calm, intelligent workspace for engineering students.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#080D1A] text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
        <StateProvider>
          <Navbar />
          <main className="flex-1 w-full" id="main-content">
            {children}
          </main>
          <CrisisModal />
          <Footer />
        </StateProvider>
      </body>
    </html>
  );
}
