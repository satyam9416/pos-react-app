import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { RevenueLoss as RevenueLossType } from '../../types/dashboard';

const SAMPLE_DATA: RevenueLossType = {
  modifiedBills: 450.75,
  reprintedBills: 280.50,
  waivedBills: 670.25,
  modifiedKOTs: 180.90,
  unusedItems: 340.60
};

const RevenueLoss: React.FC = () => {
  const total = Object.values(SAMPLE_DATA).reduce((sum, value) => sum + value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Revenue Leakage Insights</h2>
        <AlertTriangle className="h-5 w-5 text-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(SAMPLE_DATA).map(([key, value]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm text-gray-500 capitalize mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-xl font-semibold text-gray-900">${value.toLocaleString()}</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 bg-amber-500 rounded-full"
                style={{ width: `${(value / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h3 className="font-medium text-amber-900">Total Potential Loss</h3>
        </div>
        <p className="text-2xl font-bold text-amber-900">${total.toLocaleString()}</p>
        <p className="text-sm text-amber-700 mt-1">
          Take action to minimize these losses and improve profitability
        </p>
      </div>
    </div>
  );
};

export default RevenueLoss;