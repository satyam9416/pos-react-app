import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ProductAnalytics as ProductAnalyticsType } from '../../types/dashboard';

const SAMPLE_DATA: ProductAnalyticsType = {
  topSelling: [
    { id: '1', name: 'Caramel Frappuccino', quantity: 145, revenue: 862.75 },
    { id: '2', name: 'Iced Latte', quantity: 128, revenue: 512.00 },
    { id: '3', name: 'Chocolate Muffin', quantity: 98, revenue: 294.00 }
  ],
  lowSelling: [
    { id: '4', name: 'Green Tea', quantity: 12, revenue: 36.00 },
    { id: '5', name: 'Plain Bagel', quantity: 8, revenue: 16.00 },
    { id: '6', name: 'Hot Chocolate', quantity: 5, revenue: 20.00 }
  ]
};

const ProductAnalytics: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Analytics</h2>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-gray-900">Top Selling Products</h3>
          </div>
          <div className="space-y-3">
            {SAMPLE_DATA.topSelling.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="text-green-600">${product.revenue}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {product.quantity} units sold
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-gray-900">Low Selling Products</h3>
          </div>
          <div className="space-y-3">
            {SAMPLE_DATA.lowSelling.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="text-red-600">${product.revenue}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {product.quantity} units sold
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;