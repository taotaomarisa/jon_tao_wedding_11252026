import './globals.css';

import { Alex_Brush, Cormorant_Garamond, Manrope } from 'next/font/google';

import { GoogleAnalytics } from '@/components/google-analytics';
import { NavigationProgress } from '@/components/navigation-progress';
import { StaleDataBanner } from '@/components/stale-data-banner';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

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
    template: '%s | Jon & Tao 2026',
    default: 'Jon & Tao 2026',
  },
  description:
    'An interactive destination wedding website for Wymara Villa in Turks and Caicos.',
  icons: {
    icon: [{ url: '/favicon-wedding-crest.png', type: 'image/png' }],
    shortcut: ['/favicon-wedding-crest.png'],
    apple: [{ url: '/favicon-wedding-crest.png', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
