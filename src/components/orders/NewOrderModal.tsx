import React, { useState } from 'react';
import { Search, ShoppingCart, X } from 'lucide-react';
import MenuSection from './MenuSection';
import CartSection from './CartSection';
import CustomerDetailsModal from './CustomerDetailsModal';
import type { CustomerDetails } from './CustomerDetailsModal';

type Props = {
  onClose: () => void;
};

const NewOrderModal: React.FC<Props> = ({ onClose }) => {
  const [showCustomerDetails, setShowCustomerDetails] = useState(true);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; quantity: number; notes?: string }>>([]);

  const handleCustomerSubmit = (details: CustomerDetails) => {
    setCustomerDetails(details);
    setShowCustomerDetails(false);
  };

  if (showCustomerDetails) {
    return <CustomerDetailsModal onClose={onClose} onSubmit={handleCustomerSubmit} />;
  }

  const handleItemSelect = (item: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="h-full flex">
        {/* Menu Section - Left Half */}
        <div className="w-1/2 bg-[#1E1E1E] p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Menu</h2>
              {customerDetails && (
                <p className="text-sm text-gray-400">
                  Order for: {customerDetails.name} ({customerDetails.phone})
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menu items..."
              className="w-full bg-[#2A2A2A] text-white pl-10 pr-4 py-2 rounded-lg border border-white/10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <MenuSection 
            searchTerm={searchTerm} 
            onItemSelect={handleItemSelect}
          />
        </div>

        {/* Cart Section - Right Half */}
        <div className="w-1/2 bg-[#2A2A2A] p-6 overflow-y-auto">
          <CartSection 
            cart={cart} 
            setCart={setCart} 
            onClose={onClose}
            customerDetails={customerDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;