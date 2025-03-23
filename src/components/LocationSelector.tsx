
import React, { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  onSelectLocation: (address: string) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onSelectLocation,
  className 
}) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock function to simulate getting location suggestions
  const getSuggestions = (query: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockSuggestions = [
        '123 Main St, New York, NY 10001',
        '456 Broadway Ave, New York, NY 10002',
        '789 Park Ave, New York, NY 10003',
      ].filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()));
      
      setSuggestions(query ? mockSuggestions : []);
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    if (value.length > 2) {
      getSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setAddress(suggestion);
    setSuggestions([]);
    onSelectLocation(suggestion);
  };

  const handleUseCurrentLocation = () => {
    setIsLoading(true);
    
    // Simulate getting current location
    setTimeout(() => {
      const mockCurrentLocation = '350 Fifth Avenue, New York, NY 10118';
      setAddress(mockCurrentLocation);
      onSelectLocation(mockCurrentLocation);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Delivery Address</h3>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <input
            type="text"
            placeholder="Enter your delivery address"
            value={address}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
          
          {isLoading && (
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        
        {/* Location suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-2 bg-background border border-border rounded-lg overflow-hidden shadow-md">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-4 py-3 hover:bg-muted cursor-pointer flex items-start gap-2 transition-colors"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <MapPin size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleUseCurrentLocation}
          >
            <Navigation size={16} />
            <span>Use current location</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
