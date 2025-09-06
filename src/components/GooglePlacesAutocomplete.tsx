'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

export interface GooglePlacesData {
  formattedAddress: string;
  placeId?: string;
  addressComponents?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  latitude?: number;
  longitude?: number;
  county?: string;
}

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlacesDataChange?: (data: GooglePlacesData) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  children?: any; // keep simple to avoid React type imports
}

export function GooglePlacesAutocomplete({
  value,
  onChange,
  onPlacesDataChange,
  placeholder = 'Enter your property address...',
  className = '',
  required = false,
  children,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
      setGoogleError('Google Maps key missing');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    let listener: google.maps.MapsEventListener | undefined;

    loader
      .load()
      .then(() => {
        if (!inputRef.current) return;

        acRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'address_components', 'place_id', 'geometry'],
        });

        listener = acRef.current.addListener('place_changed', () => {
          const place = acRef.current!.getPlace();
          if (!place?.formatted_address) return;

          onChange(place.formatted_address);

          // county
          let county = '';
          const comps = place.address_components ?? [];
          const countyComp = comps.find((c) => c.types.includes('administrative_area_level_2'));
          county = countyComp?.long_name || '';

          const latitude = place.geometry?.location?.lat();
          const longitude = place.geometry?.location?.lng();

          const data: GooglePlacesData = {
            formattedAddress: place.formatted_address,
            placeId: place.place_id,
            addressComponents: comps,
            latitude,
            longitude,
            county,
          };

          onPlacesDataChange?.(data);
        });

        setGoogleError(null);
      })
      .catch((err) => {
        console.error('Failed to load Google Maps:', err);
        setGoogleError('Google Maps failed to load');
      });

    return () => {
      listener?.remove();
    };
  }, [onChange, onPlacesDataChange]);

  return (
    <div className="flex-1 relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={googleError ? `${placeholder} (Manual entry)` : placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-12 h-14 text-lg border-0 bg-transparent focus:ring-0 ${className}`}
        required={required}
      />
      {googleError && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          Manual entry
        </div>
      )}
      {children}
    </div>
  );
}
