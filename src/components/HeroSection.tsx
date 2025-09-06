'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Search, Building2 } from "lucide-react";
import { useState } from "react";
import austinSkyline from "@/assets/austin-skyline.jpg";
import { AnimatedCounter } from "./AnimatedCounter";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";
import { SupportDialog } from "./SupportDialog";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { APP_URLS } from '@/config/urls';

interface PlacesData {
  placeId?: string;
  formattedAddress?: string;
  addressComponents?: any[];
  latitude?: number;
  longitude?: number;
  county?: string;
}

interface HeroSectionProps {
  referralCode?: string | null;
  initialAddress?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  referralCode, 
  initialAddress = "" 
}) => {
  const [, setPropertyData] = useLocalStorage('propertyData', {});
  const [address, setAddress] = useState(initialAddress);
  const [placesData, setPlacesData] = useState<PlacesData>({});
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      if (!placesData.placeId) {
        setShowSupportDialog(true);
        return;
      }
      
      const propertyData = {
        address: address,
        placeId: placesData.placeId,
        formattedAddress: placesData.formattedAddress,
        addressComponents: placesData.addressComponents,
        latitude: placesData.latitude,
        longitude: placesData.longitude,
        county: placesData.county,
        referralCode: referralCode
      };
      
      // Safe localStorage using custom hook
      setPropertyData(propertyData);
      
      // Safe redirect using environment variables
      if (typeof window !== 'undefined') {
        window.location.href = `${APP_URLS.CUSTOMER_APP}/onboarding`;
      }
    }
  };

  const handleMultiPropertyClick = () => {
    router.push('/multi-property-contact');
  };

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-16">
      {/* Keep your gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      
      {/* Austin skyline silhouette at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 md:h-48 lg:h-56 xl:h-64"
        style={{
          backgroundImage: `url('/lovable-uploads/ATXoutline.png')`,
          backgroundPosition: 'bottom center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: .6,
        }}
      />
      
      <div className="container px-4 mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Lower Your Property Taxes
            <span className="text-primary"> Guaranteed</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Our expert team has helped homeowners save over <AnimatedCounter end={50000000} prefix="$"/> {" "}
          in property taxes. Join thousands who've reduced their tax burden with our risk-free guarantee.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card rounded-xl shadow-hero">
              <GooglePlacesAutocomplete
                value={address}
                onChange={setAddress}
                onPlacesDataChange={(data) => {
                  setPlacesData({
                    placeId: data.placeId,
                    formattedAddress: data.formattedAddress,
                    addressComponents: data.addressComponents,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    county: data.county,
                  });
                }}
                placeholder="Enter your property address..."
                required
              />
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                className="h-14 px-8 text-lg font-semibold"
              >
                <Search className="mr-2 h-5 w-5" />
                Check Savings
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                $<AnimatedCounter end={2500} />
              </div>
              <p className="text-muted-foreground">Average Savings</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                <AnimatedCounter end={15000} suffix="+" />
              </div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Multiple Properties?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Save even more with our bulk property tax protest services. 
              Perfect for landlords and property investors.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleMultiPropertyClick}
              className="border-primary/20 hover:bg-primary/10"
            >
              Get Multi-Property Quote
            </Button>
          </div>
        </div>
      </div>
      
      <SupportDialog 
        open={showSupportDialog} 
        onOpenChange={setShowSupportDialog}
      />
    </section>
  );
};