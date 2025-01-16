import React, { useState } from 'react';
import { Printer, CreditCard, Wallet, Smartphone, Tag, X, MessageSquare } from 'lucide-react';
import type { CustomerDetails } from './CustomerDetailsModal';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  configs?: Array<{
    _id: string;
    label: string;
    required: boolean;
    contents: Array<{
      _id: string;
      label: string;
      value: number;
      translations: Record<string, string>;
    }>;
    translations: Record<string, string>;
  }>;
};

type Props = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onClose: () => void;
  customerDetails: CustomerDetails | null;
  orderType?: 'dine-in' | 'takeaway' | 'delivery';
};

const CartSection: React.FC<Props> = ({ cart, setCart, onClose, customerDetails, orderType = 'dine-in' }) => {
  const [discount, setDiscount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount ? parseFloat(discount) : 0;
  const total = subtotal - discountAmount;

  const handleAddNote = (itemId: string, note: string) => {
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes: note } : item
    ));
  };

  const handlePrint = (type: 'kot' | 'receipt' | 'both') => {
    console.log(`Printing ${type}...`);
    // Implement printing logic
  };

  const handleFinishOrder = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!customerDetails) {
        throw new Error('Customer details are required');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Prepare the order items with the required format
      const orderItems = cart.map(item => ({
        item: item.id,
        configs: item.configs || [{
          _id: "default-config",
          label: "Variants",
          required: true,
          contents: [{
            _id: "default-content",
            label: "standard",
            value: item.price,
            translations: {}
          }],
          translations: {}
        }],
        quantity: item.quantity,
        value: item.price,
        charges: [
          {
            id: "2585",
            label: "CGST",
            value: (item.price * item.quantity * 0.025), // 2.5% CGST
            chargeType: "tax"
          },
          {
            id: "2586",
            label: "SGST",
            value: (item.price * item.quantity * 0.025), // 2.5% SGST
            chargeType: "tax"
          }
        ]
      }));

      const orderData = {
        amount: total,
        orderType: orderType,
        discounts: discount ? [{
          label: "Manual Discount",
          value: discountAmount,
          type: "amount"
        }] : [],
        items: orderItems,
        modeOfPayment: paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'card' ? 'Card' : 'UPI',
        charges: [{
          id: "4b32b5bb-147c-4c15-984c-926d41fc1325",
          label: "Platform Fee",
          value: 0,
          chargeType: "charge"
        }],
        user: {
          phone: customerDetails.phone,
          name: customerDetails.name,
          countryCode: customerDetails.countryCode || ""
        }
      };

      const response = await fetch('https://node.api.dash.thriftyai.in/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to create order:', errorData);
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Order created successfully:', data);
      onClose();
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cart Items */}
      <div className="flex-1 overflow-auto mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Cart</h2>
        
        {cart.map((item) => (
          <div key={item.id} className="py-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-white">{item.name}</h3>
                <p className="text-emerald-500">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCart(prev => prev.map(i => 
                    i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                  ).filter(i => i.quantity > 0))}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"
                >
                  -
                </button>
                <span className="text-white">{item.quantity}</span>
                <button
                  onClick={() => setCart(prev => prev.map(i => 
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                  ))}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={item.notes || ''}
                onChange={(e) => handleAddNote(item.id, e.target.value)}
                placeholder="Add notes for this item..."
                className="flex-1 bg-[#1E1E1E] text-white px-2 py-1 rounded border border-white/10 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Payment Section */}
      <div className="border-t border-white/10 pt-4 space-y-4">
        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Discount</span>
              <button
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className="text-gray-400 hover:text-white"
              >
                <Tag className="h-4 w-4" />
              </button>
            </div>
            {showDiscountInput ? (
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-24 bg-[#1E1E1E] text-white px-2 py-1 rounded border border-white/10 text-right"
                placeholder="0.00"
              />
            ) : (
              <span className="text-white">₹{discountAmount.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-white">Total</span>
            <span className="text-emerald-500">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`flex items-center justify-center gap-2 p-2 rounded-lg border
              ${paymentMethod === 'cash' 
                ? 'bg-emerald-600 border-emerald-500 text-white' 
                : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
          >
            <Wallet className="h-4 w-4" />
            <span>Cash</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex items-center justify-center gap-2 p-2 rounded-lg border
              ${paymentMethod === 'card'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Card</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`flex items-center justify-center gap-2 p-2 rounded-lg border
              ${paymentMethod === 'upi'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
          >
            <Smartphone className="h-4 w-4" />
            <span>UPI</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePrint('kot')}
            className="flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            Print KOT
          </button>
          
          <button
            onClick={() => handlePrint('receipt')}
            className="flex items-center justify-center gap-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10"
          >
            Cancel Order
          </button>
          
          <button
            onClick={handleFinishOrder}
            disabled={isSubmitting}
            className={`p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Finish Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSection;