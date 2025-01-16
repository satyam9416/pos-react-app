import React, { useState } from 'react';
import { X } from 'lucide-react';

export type CustomerDetails = {
  name: string;
  phone: string;
  countryCode: string;
};

type Props = {
  onClose: () => void;
  onSubmit: (details: CustomerDetails) => void;
};

const CustomerDetailsModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [details, setDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    countryCode: '+91'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Customer Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={details.name}
              onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#2A2A2A] text-white px-3 py-2 rounded-lg border border-white/10"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="countryCode"
                value={details.countryCode}
                onChange={(e) => setDetails(prev => ({ ...prev, countryCode: e.target.value }))}
                className="w-20 bg-[#2A2A2A] text-white px-3 py-2 rounded-lg border border-white/10"
                placeholder="+91"
              />
              <input
                type="tel"
                id="phone"
                value={details.phone}
                onChange={(e) => setDetails(prev => ({ ...prev, phone: e.target.value }))}
                className="flex-1 bg-[#2A2A2A] text-white px-3 py-2 rounded-lg border border-white/10"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;