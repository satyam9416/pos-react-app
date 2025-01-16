import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  ShoppingBag, 
  Store, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Link
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/menu', icon: MenuIcon, label: 'Menu' },
    { path: '/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/outlets', icon: Store, label: 'Outlets' },
    { path: '/integrations', icon: Link, label: 'Integrations' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300 relative`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-all"
      >
        {isCollapsed ? 
          <ChevronRight className="h-4 w-4 text-[#1a2666]" /> : 
          <ChevronLeft className="h-4 w-4 text-[#1a2666]" />
        }
      </button>

      <div className="flex flex-col h-full">
        {/* Logo and Title */}
        <div className={`${isCollapsed ? 'py-6 px-2' : 'p-6'} transition-all duration-300`}>
          <div className={`flex flex-col items-center ${isCollapsed ? 'space-y-1' : 'space-y-2'}`}>
            <div className={`${isCollapsed ? 'w-12 h-12' : 'w-16 h-16'} relative transition-all duration-300`}>
              <img 
                src="/src/assets/images/Logo.png" 
                alt="Thrifty POS Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="text-center">
                <h1 className="text-xl font-bold text-[#1a2666]">Thrifty POS</h1>
                <p className="text-sm text-[#1a2666]/70">AI powered POS</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} w-full px-4 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-[#1a2666]/10 text-[#1a2666]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} w-full px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;