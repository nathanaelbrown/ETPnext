// src/app/fonts.ts
import { Inter, Lora } from 'next/font/google'

export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const serif = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '700'],
  display: 'swap',
})