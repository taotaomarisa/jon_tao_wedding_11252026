import './globals.css';

import { GoogleAnalytics } from '@/components/google-analytics';
import { NavigationProgress } from '@/components/navigation-progress';
import { StaleDataBanner } from '@/components/stale-data-banner';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Alex_Brush, Cormorant_Garamond, Manrope } from 'next/font/google';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-romantic',
  weight: ['400', '500', '600', '700'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
});

const scriptFont = Alex_Brush({
  subsets: ['latin'],
  variable: '--font-calligraphy',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Turks & Caicos Wedding',
    default: 'Turks & Caicos Wedding',
  },
  description:
    'An interactive destination wedding website for Wymara Villa in Turks and Caicos.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${scriptFont.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationProgress />
          {children}
          <StaleDataBanner />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
