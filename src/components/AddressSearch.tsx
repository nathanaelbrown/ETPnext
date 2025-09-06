'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function AddressSearch() {
  const [address, setAddress] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const autocompleteRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (typeof window !== 'undefined' && window.google?.maps?.places && autocompleteRef.current) {
        try {
          const autocomplete = new window.google.maps.places.Autocomplete(
            autocompleteRef.current,
            { 
              types: ['address'],
              fields: ['formatted_address', 'place_id', 'address_components', 'geometry']
            }
          )
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            if (place.formatted_address) {
              setAddress(place.formatted_address)
            }
          })
          
          setIsLoaded(true)
        } catch (error) {
          console.error('Error initializing Google Places:', error)
          setIsLoaded(true) // Still allow manual input
        }
      }
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      initializeAutocomplete()
    } else {
      // Wait for Google Maps to load
      const checkGoogle = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkGoogle)
          initializeAutocomplete()
        }
      }, 100)

      // Cleanup after 10 seconds to prevent infinite checking
      const timeout = setTimeout(() => {
        clearInterval(checkGoogle)
        setIsLoaded(true) // Allow manual input even if Google Maps fails
      }, 10000)

      return () => {
        clearInterval(checkGoogle)
        clearTimeout(timeout)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      window.location.href = `/contact?address=${encodeURIComponent(address)}`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card rounded-xl shadow-hero">
        <input
          ref={autocompleteRef}
          type="text"
          placeholder={isLoaded ? "Enter your property address..." : "Loading address search..."}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1 h-14 px-4 bg-transparent border-0 focus:outline-none text-base placeholder-muted-foreground"
          required
          disabled={!isLoaded}
        />
        <Button 
          type="submit" 
          variant="hero"
          size="lg"
          className="h-14 px-8 text-lg font-semibold"
          disabled={!isLoaded}
        >
          <Search className="mr-2 h-5 w-5" />
          Check Savings
        </Button>
      </div>
    </form>
  )
}