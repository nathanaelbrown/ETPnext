'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { ProcessSection } from '@/components/ProcessSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

const Index = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref') || null;
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.includes('access_token') || hash.includes('type=recovery')) {
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      callbackUrl.hash = hash;
      router.replace((callbackUrl.pathname + callbackUrl.hash) as any);
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          referralCode={referralCode}
        />
        <TestimonialsSection />
        <BenefitsSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
