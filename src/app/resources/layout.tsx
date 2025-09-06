// app/resources/layout.tsx
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  // No padding here — each page controls its own spacing (hero vs. article)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
