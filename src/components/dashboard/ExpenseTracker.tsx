import React from 'react';
import { DollarSign, PieChart } from 'lucide-react';
import type { Expenses } from '../../types/dashboard';

const SAMPLE_DATA: Expenses = {
  total: 12450.75,
  ownerPayments: 5000.00,
  productExpenses: 4500.75,
  maintenance: [
    { category: 'Equipment', amount: 1500.00 },
    { category: 'Utilities', amount: 850.00 },
    { category: 'Cleaning', amount: 600.00 }
  ]
};

const ExpenseTracker: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Expense Tracking</h2>
        <DollarSign className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Expenses</h3>
          <p className="text-2xl font-semibold text-gray-900">
            ${SAMPLE_DATA.total.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm text-gray-500 mb-1">Owner Payments</h3>
          <p className="text-2xl font-semibold text-gray-900">
            ${SAMPLE_DATA.ownerPayments.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm text-gray-500 mb-1">Product Expenses</h3>
          <p className="text-2xl font-semibold text-gray-900">
            ${SAMPLE_DATA.productExpenses.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-gray-400" />
          <h3 className="font-medium text-gray-900">Maintenance Expenses</h3>
        </div>
        <div className="space-y-3">
          {SAMPLE_DATA.maintenance.map((item) => (
            <div key={item.category} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{item.category}</span>
                <span className="font-medium text-gray-900">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-1 bg-starbucks-green rounded-full"
                  style={{ width: `${(item.amount / SAMPLE_DATA.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;