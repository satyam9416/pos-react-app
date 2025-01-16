import React from 'react';
import { CreditCard } from 'lucide-react';

type PaymentMethod = {
  name: string;
  percentage: number;
  color: string;
};

const paymentMethods: PaymentMethod[] = [
  { name: 'Cash', percentage: 36.0, color: 'bg-thrifty-500' },
  { name: 'Card', percentage: 28.0, color: 'bg-blue-500' },
  { name: 'Wallet', percentage: 12.0, color: 'bg-purple-500' },
  { name: 'UPI', percentage: 16.0, color: 'bg-amber-500' }
];

const PaymentMethods = () => {
  return (
    <div className="bg-surface-light rounded-xl p-6 border border-surface-hover">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-5 w-5 text-thrifty-500" />
        <h2 className="text-lg font-semibold text-content">Payment Methods</h2>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-content-muted">{method.name}</span>
              <span className="text-content">{method.percentage}%</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div
                className={`h-full ${method.color} rounded-full transition-all`}
                style={{ width: `${method.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;