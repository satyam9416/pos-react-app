import React from 'react';
import { UtensilsCrossed, ShoppingBag, Bike } from 'lucide-react';

type OrderType = {
  type: 'Dine-in' | 'Takeaway' | 'Delivery';
  orders: number;
  sales: number;
  icon: React.ComponentType<any>;
};

const orderTypes: OrderType[] = [
  { type: 'Dine-in', orders: 750, sales: 45000, icon: UtensilsCrossed },
  { type: 'Takeaway', orders: 350, sales: 25000, icon: ShoppingBag },
  { type: 'Delivery', orders: 150, sales: 15000, icon: Bike }
];

const OrderTypes = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {orderTypes.map((type) => (
        <div key={type.type} className="bg-surface-light rounded-xl p-6 border border-surface-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-thrifty-50 rounded-lg">
              <type.icon className="h-5 w-5 text-thrifty-500" />
            </div>
            <h3 className="text-lg font-medium text-content">{type.type}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-content-muted">Orders</span>
              <span className="text-content">{type.orders}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-content-muted">Sales</span>
              <span className="text-thrifty-500">${type.sales.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTypes;