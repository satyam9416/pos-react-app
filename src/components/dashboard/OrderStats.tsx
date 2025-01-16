import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';
import type { OrderStatistics, OrderTypeStats } from '../../types/dashboard';

const SAMPLE_ORDER_STATS: OrderStatistics = {
  successful: 285,
  canceled: 12,
  complimentary: 5,
  tableTurnover: 45
};

const SAMPLE_ORDER_TYPES: OrderTypeStats = {
  dineIn: {
    count: 150,
    maximum: 250,
    minimum: 50,
    average: 125,
    discounts: 450,
    taxes: 850
  },
  takeaway: {
    count: 85,
    sales: 4250
  },
  delivery: {
    count: 50,
    sales: 2800
  }
};

const OrderStats: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Statistics</h2>
        <ShoppingBag className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(SAMPLE_ORDER_STATS).map(([key, value]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm text-gray-500 capitalize mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-xl font-semibold text-gray-900">
              {key === 'tableTurnover' ? `${value} min` : value}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Order Types</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Dine In</span>
                <span className="text-sm font-medium text-gray-900">{SAMPLE_ORDER_TYPES.dineIn.count} orders</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-500">Max: ${SAMPLE_ORDER_TYPES.dineIn.maximum}</div>
                <div className="text-gray-500">Min: ${SAMPLE_ORDER_TYPES.dineIn.minimum}</div>
                <div className="text-gray-500">Avg: ${SAMPLE_ORDER_TYPES.dineIn.average}</div>
                <div className="text-gray-500">Discounts: ${SAMPLE_ORDER_TYPES.dineIn.discounts}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-2">Takeaway</h4>
                <p className="text-lg font-medium text-gray-900">{SAMPLE_ORDER_TYPES.takeaway.count} orders</p>
                <p className="text-sm text-gray-500">${SAMPLE_ORDER_TYPES.takeaway.sales} sales</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-2">Delivery</h4>
                <p className="text-lg font-medium text-gray-900">{SAMPLE_ORDER_TYPES.delivery.count} orders</p>
                <p className="text-sm text-gray-500">${SAMPLE_ORDER_TYPES.delivery.sales} sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;