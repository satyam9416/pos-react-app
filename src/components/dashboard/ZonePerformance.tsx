import React from 'react';
import { MapPin } from 'lucide-react';

type ZoneData = {
  name: string;
  orders: number;
  amount: number;
  change: number;
};

const zones: ZoneData[] = [
  { name: 'North', orders: 450, amount: 45000, change: 15 },
  { name: 'South', orders: 380, amount: 35000, change: -5 },
  { name: 'East', orders: 220, amount: 25000, change: 8 }
];

const ZonePerformance = () => {
  return (
    <div className="bg-surface-light rounded-xl p-6 border border-surface-hover">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-thrifty-500" />
        <h2 className="text-lg font-semibold text-content">Zone Performance</h2>
      </div>
      
      <div className="space-y-6">
        {zones.map((zone) => (
          <div key={zone.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-content">{zone.name}</span>
                <p className="text-content-muted">{zone.orders} orders • ${zone.amount}</p>
              </div>
              <span className={`${zone.change > 0 ? 'text-thrifty-500' : 'text-red-500'}`}>
                {zone.change > 0 ? '+' : ''}{zone.change}%
              </span>
            </div>
            
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-thrifty-500 rounded-full transition-all"
                style={{ width: `${Math.abs(zone.change)}0%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZonePerformance;