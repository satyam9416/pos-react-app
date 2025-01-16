import React, { useState, useEffect } from 'react';
import { Filter, Phone, AlertCircle, TrendingUp, TrendingDown, Package, Clock, FileText, DollarSign, Users, ShoppingBag, RefreshCw, Calendar, Wallet, CreditCard, Banknote } from 'lucide-react';

interface MenuItem {
  _id: string;
  label: string;
  configs?: Array<{
    contents: Array<{
      value: string;
    }>;
  }>;
  category: {
    _id: string;
    label: string;
  };
}

interface Order {
  _id: string;
  items: Array<{
    item: MenuItem;
    quantity: number;
  }>;
  state: number;
  orderType: string;
  createdAt: string;
  user: {
    name: string;
    phone: string;
  };
  paymentMethod: string;
  total: number;
  discount?: number;
  taxes?: {
    cgst: number;
    sgst: number;
  };
}

interface DashboardStats {
  totalSales: number;
  netSales: number;
  totalOrders: number;
  orderTypes: {
    dineIn: number;
    takeaway: number;
    delivery: number;
  };
  paymentMethods: {
    cash: number;
    card: number;
    wallet: number;
    onlinePaid: number;
  };
  taxes: {
    cgst: number;
    sgst: number;
  };
  topItems: Array<{
    name: string;
    count: number;
  }>;
  lowItems: Array<{
    name: string;
    count: number;
  }>;
}

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState('daily');
  const [outletFilter, setOutletFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    netSales: 0,
    totalOrders: 0,
    orderTypes: { dineIn: 0, takeaway: 0, delivery: 0 },
    paymentMethods: { cash: 0, card: 0, wallet: 0, onlinePaid: 0 },
    taxes: { cgst: 0, sgst: 0 },
    topItems: [],
    lowItems: []
  });

  const processOrdersData = (orders: Order[]): DashboardStats => {
    const stats: DashboardStats = {
      totalSales: 0,
      netSales: 0,
      totalOrders: orders.length,
      orderTypes: { dineIn: 0, takeaway: 0, delivery: 0 },
      paymentMethods: { cash: 0, card: 0, wallet: 0, onlinePaid: 0 },
      taxes: { cgst: 0, sgst: 0 },
      topItems: [],
      lowItems: []
    };

    // Process orders
    orders.forEach(order => {
      stats.totalSales += order.total;
      stats.netSales += order.total - (order.discount || 0);
      
      // Order types
      if (order.orderType === 'dine-in') stats.orderTypes.dineIn++;
      if (order.orderType === 'takeaway') stats.orderTypes.takeaway++;
      if (order.orderType === 'delivery') stats.orderTypes.delivery++;

      // Payment methods
      if (order.paymentMethod === 'cash') stats.paymentMethods.cash += order.total;
      if (order.paymentMethod === 'card') stats.paymentMethods.card += order.total;
      if (order.paymentMethod === 'wallet') stats.paymentMethods.wallet += order.total;
      if (order.paymentMethod === 'online') stats.paymentMethods.onlinePaid += order.total;

      // Taxes
      if (order.taxes) {
        stats.taxes.cgst += order.taxes.cgst;
        stats.taxes.sgst += order.taxes.sgst;
      }
    });

    return stats;
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch orders
      const ordersResponse = await fetch('https://node.api.dash.thriftyai.in/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (ordersResponse.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const ordersData = await ordersResponse.json();
      const processedStats = processOrdersData(ordersData.orders || []);
      setStats(processedStats);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [dateFilter, outletFilter]);

  // Static data for sections not yet connected to real-time
  const productStats = {
    topSelling: [
      { name: 'Chicken Biryani', orders: 145 },
      { name: 'Paneer Butter Masala', orders: 98 },
      { name: 'Veg Fried Rice', orders: 87 }
    ],
    lowSelling: [
      { name: 'Green Salad', orders: 12 },
      { name: 'Mushroom Soup', orders: 15 },
      { name: 'Fruit Bowl', orders: 18 }
    ]
  };

  const revenueLeak = {
    modifiedBills: { count: 12, amount: 2400 },
    reprintedBills: { count: 8, amount: 1600 },
    waivedOff: { count: 4, amount: 800 },
    cancelled: { count: 6, amount: 1200 },
    modifiedKOTs: { count: 10, amount: 2000 }
  };

  const operationalMetrics = {
    avgPrepTime: '22 mins',
    tableTurnover: '45 mins',
    peakHours: '7:00 PM - 9:00 PM',
    staffPerformance: 85
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Filters */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex gap-4">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white text-gray-700"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
          <button
            onClick={() => fetchDashboardData()}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Refresh Data"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Sales</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.netSales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tax</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(stats.taxes.cgst + stats.taxes.sgst).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Dine In</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.orderTypes.dineIn}</p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Takeaway</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.orderTypes.takeaway}</p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
            <div className="p-4 bg-green-50 rounded-full">
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Delivery</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.orderTypes.delivery}</p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-full">
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Payment Methods</h3>
        <div className="space-y-4">
          {Object.entries(stats.paymentMethods).map(([method, amount]) => (
            <div key={method} className="flex items-center justify-between">
              <span className="capitalize text-gray-700">{method}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-medium">₹{amount.toLocaleString()}</span>
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(amount / stats.totalSales * 100) || 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
          <div className="space-y-4">
            {productStats.topSelling.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-900 font-medium">{item.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Low Selling Items</h3>
          <div className="space-y-4">
            {productStats.lowSelling.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-900 font-medium">{item.orders} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Leakage */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Revenue Leakage Insights</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.entries(revenueLeak).map(([key, data]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm text-gray-600 capitalize mb-2">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-2xl font-bold text-gray-900">{data.count}</p>
              <p className="text-sm text-red-600">-₹{data.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Avg. Prep Time</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{operationalMetrics.avgPrepTime}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <RefreshCw className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Table Turnover</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{operationalMetrics.tableTurnover}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold">Peak Hours</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{operationalMetrics.peakHours}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Staff Performance</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{operationalMetrics.staffPerformance}%</p>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${operationalMetrics.staffPerformance}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Need Quick Help?</h3>
            <p className="text-blue-100">24/7 support with AI helper</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors">
              <AlertCircle className="h-5 w-5" />
              AI Helper
            </button>
            <button className="px-4 py-2 bg-blue-400 text-white rounded-lg flex items-center gap-2 hover:bg-blue-300 transition-colors">
              <Phone className="h-5 w-5" />
              Request Callback
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Price Discovery */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Price Discovery</h3>
            </div>
            <p className="text-sm text-gray-500">Compare prices across suppliers and get the best deals for your business.</p>
            <span className="inline-block mt-4 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">Coming Soon</span>
          </div>

          {/* Order Free Sample */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-100 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Order Free Sample</h3>
            </div>
            <p className="text-sm text-gray-500">Try before you buy with our free sample program for quality assurance.</p>
            <span className="inline-block mt-4 px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">Coming Soon</span>
          </div>

          {/* Suppliers Hub */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-100 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Suppliers Hub</h3>
            </div>
            <p className="text-sm text-gray-500">Connect with verified suppliers and manage all your purchases in one place.</p>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full hover:bg-green-100 transition-colors">
                Explore Now
              </button>
            </div>
          </div>

          {/* Zero Investment Outlet */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-amber-100 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <ShoppingBag className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Zero Investment Outlet</h3>
            </div>
            <p className="text-sm text-gray-500">Start your business with zero initial investment. Perfect for new entrepreneurs.</p>
            <span className="inline-block mt-4 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;