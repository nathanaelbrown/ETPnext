'use client';

import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Building2 } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { APP_URLS } from '@/config/urls';
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete"; // Add this import
import { SupportDialog } from "./SupportDialog"; // Add this import

interface PlacesData {
  placeId?: string;
  formattedAddress?: string;
  addressComponents?: any[];
  latitude?: number;
  longitude?: number;
  county?: string;
}

export const CTASection = () => {
  const [address, setAddress] = useState("");
  const [placesData, setPlacesData] = useState<PlacesData>({});
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [, setPropertyData] = useLocalStorage('propertyData', {});

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
        referralCode: null
      };
      
      setPropertyData(propertyData);
      
      if (typeof window !== 'undefined') {
        window.location.href = `${APP_URLS.CUSTOMER_APP}/onboarding`;
      }
    }
  };

  const handleMultiProperty = () => {
    if (typeof window !== 'undefined') {
      window.location.href = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL || 'http://localhost:3002/multi-property';
    }
  };

  return (
    <section className="py-20 bg-gradient-primary">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Reduce Your Property Taxes?
          </h2>
          
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Don't overpay on your property taxes. Get started today with our risk-free service and see how much you can save.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-background rounded-xl shadow-xl">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
                <GooglePlacesAutocomplete
                  value={address}
                  onChange={setAddress}
                  onPlacesDataChange={setPlacesData}
                  placeholder="Enter your property address..."
                  className="pl-12 h-14 text-lg border-0 bg-transparent focus:ring-0 w-full"
                />
              </div>
              <Button 
                type="submit" 
                variant="accent" 
                size="lg"
                className="h-14 px-8 text-lg font-semibold"
              >
                <Search className="mr-2 h-5 w-5" />
                Check Savings
              </Button>
            </div>
          </form>

          <div className="flex justify-center mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMultiProperty}
              className="text-primary-foreground/70 hover:text-primary-foreground"
            >
              <Building2 className="mr-2 h-4 w-4" />
              I have multiple properties
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-primary-foreground/90">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>Call us: (555) 012-3456</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-primary-foreground/30"></div>
            <div>No upfront fees • 100% risk-free • Results guaranteed</div>
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