import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import OrdersList from '../components/orders/OrdersList';
import NewOrderModal from '../components/orders/NewOrderModal';

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'completed' | 'cancelled'>('pending');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check token validity on component mount
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        // Make a test API call to check token validity
        const response = await fetch('https://node.api.dash.thriftyai.in/orders?page=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          throw new Error('Authentication token expired or invalid');
        }
      } catch (err: any) {
        console.error('Token validation error:', err);
        if (err.message.includes('token')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        setError(err.message);
      }
    };

    checkToken();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === 'completed'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setSelectedStatus('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedStatus === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cancelled
          </button>
        </div>

        <button
          onClick={() => setShowNewOrderModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          New Order
        </button>
      </div>

      {error && (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <OrdersList status={selectedStatus} />

      {showNewOrderModal && (
        <NewOrderModal onClose={() => setShowNewOrderModal(false)} />
      )}
    </div>
  );
};

export default Orders;