import React, { useState } from 'react';
import { X, Store, User, Phone, MapPin } from 'lucide-react';
import type { Outlet } from '../../types/outlet';

type Props = {
  outlet?: Outlet | null;
  onClose: () => void;
};

const OutletModal: React.FC<Props> = ({ outlet, onClose }) => {
  const [formData, setFormData] = useState<Omit<Outlet, 'id'>>({
    name: outlet?.name || '',
    owner: outlet?.owner || '',
    contact: outlet?.contact || '',
    address: outlet?.address || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save logic
    console.log('Saving outlet:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-[#2A2A2A] rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {outlet ? 'Edit Outlet' : 'Add New Outlet'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Outlet Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg border border-white/10"
                placeholder="Enter outlet name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Owner Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                className="w-full bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg border border-white/10"
                placeholder="Enter owner name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                className="w-full bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg border border-white/10"
                placeholder="Enter contact number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg border border-white/10"
                placeholder="Enter outlet address"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
              {outlet ? 'Update' : 'Add'} Outlet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutletModal;