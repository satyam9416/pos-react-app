import React from 'react';
import { Map } from 'lucide-react';
import type { ZoneStats } from '../../types/dashboard';

const SAMPLE_DATA: ZoneStats[] = [
  { zone: 'North', sales: 12450.75, orderCount: 145, performance: 92 },
  { zone: 'South', sales: 9870.25, orderCount: 98, performance: 88 },
  { zone: 'East', sales: 15680.50, orderCount: 167, performance: 95 },
  { zone: 'West', sales: 11340.80, orderCount: 124, performance: 90 }
];

const ZoneStatistics: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Zone Statistics</h2>
        <Map className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {SAMPLE_DATA.map((zone) => (
          <div key={zone.zone} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{zone.zone}</h3>
              <span className="text-sm text-gray-500">{zone.orderCount} orders</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Sales</span>
              <span className="font-medium text-gray-900">${zone.sales.toLocaleString()}</span>
            </div>
            <div className="relative pt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-2 bg-starbucks-green rounded-full"
                  style={{ width: `${zone.performance}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">Performance</span>
                <span className="text-xs font-medium text-starbucks-green">{zone.performance}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneStatistics;