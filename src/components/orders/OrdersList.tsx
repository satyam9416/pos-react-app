import React, { useEffect, useState, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, Phone, TruckIcon, ShoppingBag, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OrderItem {
  _id: string;
  item: {
    _id: string;
    label: string;
  };
  quantity: number;
  notes?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  state: number; // 0: pending, 1: completed, 2: cancelled
  orderType: string;
  createdAt: string;
  user: {
    name: string;
    phone: string;
  };
  notes?: string;
}

interface OrdersResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  totalPages: number;
}

type Props = {
  status: 'pending' | 'completed' | 'cancelled';
};

const OrdersList: React.FC<Props> = ({ status }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let state;
      switch (status.toLowerCase()) {
        case 'pending':
          state = 0;
          break;
        case 'completed':
          state = 2;
          break;
        case 'cancelled':
          state = -1;
          break;
        default:
          state = 0;
      }

      const response = await fetch(
        `https://node.api.dash.thriftyai.in/orders?state=${state}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]); // Re-fetch when status changes

  const getStatusFromState = (state: number): 'pending' | 'completed' | 'cancelled' => {
    switch (state) {
      case 0:
        return 'pending';
      case 1:
        return 'completed';
      case 2:
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const getStatusColor = (state: number) => {
    switch (state) {
      case 0: // pending
        return 'border-amber-500 bg-amber-50';
      case 1: // completed
        return 'border-emerald-500 bg-emerald-50';
      case 2: // cancelled
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'delivery':
        return <TruckIcon className="h-5 w-5 text-emerald-600" />;
      case 'take-away':
      case 'takeaway':
        return <ShoppingBag className="h-5 w-5 text-emerald-600" />;
      case 'dine-in':
        return <Clock className="h-5 w-5 text-emerald-600" />;
      default:
        return null;
    }
  };

  const getTimePassed = (createdAt: string) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const hours = Math.floor(diffInMinutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return order.state === 0;
        case 'cancelled':
          return order.state === -1;
        case 'completed':
          return order.state === 2;
        default:
          return true;
      }
    });
  }, [orders, status]);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleFoodReady = async (orderId: string) => {
    try {
      const response = await fetch(`https://node.api.dash.thriftyai.in/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          order_status: 2
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      toast.success('Order completed successfully!', {
        duration: 3000,
        position: 'top-right',
      });

      // Refresh the orders list after successful update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to complete order. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`https://node.api.dash.thriftyai.in/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          order_status: -1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      toast.success('Order cancelled successfully!', {
        duration: 3000,
        position: 'top-right',
      });

      // Refresh the orders list after successful update
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 capitalize">{status} Orders</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow">
          No {status} orders found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div 
              key={order._id}
              className={`bg-white rounded-lg shadow border-l-4 ${getStatusColor(order.state)} p-4 space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">#{order.orderNumber}</span>
                  {getTypeIcon(order.orderType)}
                  <span className="text-sm text-gray-600 capitalize">
                    {order.orderType.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {getTimePassed(order.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{order.user.phone}</span>
                {order.user.name && (
                  <span className="font-medium text-gray-800">({order.user.name})</span>
                )}
              </div>

              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={item._id}>
                    <div className="flex items-start justify-between">
                      <div className="text-gray-800">
                        {item.quantity}x {item.item?.label || 'Unknown Item'}
                      </div>
                    </div>
                    {item.notes && (
                      <div className="text-sm text-amber-600 mt-0.5 pl-4">
                        Note: {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="text-sm bg-amber-50 border border-amber-200 rounded p-2 text-amber-700">
                  <span className="font-medium">Order Note:</span> {order.notes}
                </div>
              )}

              {status === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleFoodReady(order._id)}
                    className="flex-1 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium"
                  >
                    Food Ready
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="flex-1 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded ${
                page === pageNum
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;