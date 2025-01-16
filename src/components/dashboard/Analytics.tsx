import React, { useState } from 'react';
import { BarChart, PieChart, Calendar, CreditCard } from 'lucide-react';
import type { PaymentStats, TaxBreakdown } from '../../types/dashboard';

const PAYMENT_DATA: PaymentStats = {
  cash: 12450.75,
  card: 8970.25,
  wallet: 2680.50,
  duePayments: 1340.80,
  upi: 5670.90,
  other: 890.30
};

const TAX_DATA: TaxBreakdown = {
  cgst: 1250.45,
  sgst: 1250.45
};

const TIME_PERIODS = ['Daily', 'Monthly', 'Yearly'];

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
        <div className="flex gap-2">
          {TIME_PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedPeriod === period 
                  ? 'bg-starbucks-green text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Methods
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(PAYMENT_DATA).map(([method, amount]) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-starbucks-green" />
                  <span className="text-sm text-gray-600 capitalize">
                    {method.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="font-medium text-gray-900">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Tax Breakdown
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(TAX_DATA).map(([tax, amount]) => (
              <div key={tax} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 uppercase">{tax}</span>
                  <span className="font-medium text-gray-900">${amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-starbucks-green rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;