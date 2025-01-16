import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Percent } from 'lucide-react';
import type { SalesOverview as SalesOverviewType } from '../../types/dashboard';

const SAMPLE_DATA: SalesOverviewType = {
  totalSales: 25890.50,
  netSales: 24500.75,
  orderCount: 342,
  expenses: 5670.25,
  cashCollection: 85,
  onlineSales: 15780.30,
  taxes: 2100.45,
  discounts: 890.20
};

const SalesOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales Overview</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Sales</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${SAMPLE_DATA.totalSales.toLocaleString()}
          </p>
          <div className="text-xs text-green-600 bg-green-50 rounded-full px-2 py-1 inline-block">
            +12.5% from last week
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Orders</span>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {SAMPLE_DATA.orderCount}
          </p>
          <div className="text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-1 inline-block">
            +8.2% from last week
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Online Sales</span>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${SAMPLE_DATA.onlineSales.toLocaleString()}
          </p>
          <div className="text-xs text-purple-600 bg-purple-50 rounded-full px-2 py-1 inline-block">
            +15.3% from last week
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Cash Collection</span>
            <Percent className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {SAMPLE_DATA.cashCollection}%
          </p>
          <div className="text-xs text-orange-600 bg-orange-50 rounded-full px-2 py-1 inline-block">
            +5.7% from last week
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Taxes</h3>
          <p className="text-lg font-semibold text-gray-900">
            ${SAMPLE_DATA.taxes.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Discounts</h3>
          <p className="text-lg font-semibold text-gray-900">
            ${SAMPLE_DATA.discounts.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Net Sales</h3>
          <p className="text-lg font-semibold text-gray-900">
            ${SAMPLE_DATA.netSales.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;