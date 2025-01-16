import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import type { OutletData } from '../../types/dashboard';

const SAMPLE_OUTLETS: OutletData[] = [
  { id: '1', name: 'Downtown Branch', location: 'City Center', zone: 'North' },
  { id: '2', name: 'Mall Location', location: 'Shopping District', zone: 'South' },
  { id: '3', name: 'Business Park', location: 'Tech Hub', zone: 'East' },
];

const OutletSelector: React.FC = () => {
  const [selectedOutlet, setSelectedOutlet] = useState<OutletData>(SAMPLE_OUTLETS[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-starbucks-green"
      >
        <MapPin className="h-4 w-4 text-starbucks-green" />
        <span>{selectedOutlet.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {SAMPLE_OUTLETS.map((outlet) => (
              <button
                key={outlet.id}
                onClick={() => {
                  setSelectedOutlet(outlet);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{outlet.name}</p>
                  <p className="text-xs text-gray-500">{outlet.location}</p>
                </div>
                <span className="text-xs font-medium text-starbucks-green">{outlet.zone}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletSelector;