import React from 'react';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    message: 'Low stock alert: Caramel Syrup',
    time: '5 min ago',
    icon: AlertCircle,
    color: 'text-red-500'
  },
  {
    id: 2,
    type: 'success',
    message: 'Daily sales target achieved',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-green-500'
  },
  {
    id: 3,
    type: 'info',
    message: 'New menu items available',
    time: '1 day ago',
    icon: Info,
    color: 'text-blue-500'
  }
];

const Notifications: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <Bell className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {NOTIFICATIONS.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <notification.icon className={`h-5 w-5 ${notification.color} mt-0.5`} />
            <div className="flex-1">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-starbucks-green hover:text-starbucks-green-dark">
        View all notifications
      </button>
    </div>
  );
};

export default Notifications;