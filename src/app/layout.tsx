// src/app/layout.tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { sans, serif } from './fonts' // from src/app/fonts.ts

export const metadata: Metadata = {
  title: {
    default: 'EasyTaxProtest.com',
    template: '%s | Your App',
  },
  description: 'The best damn property tax service in Texas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <head>
     </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {/* Load Google Maps Places once, after hydration */}
        <Script
          id="google-maps"
          strategy="afterInteractive"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
        /> 
     </body>
    </html>
  )
}
