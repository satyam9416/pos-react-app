import React from 'react';
import { Edit2, Trash2, MapPin, Phone, User } from 'lucide-react';
import { outlets } from '../../data/outlets';
import type { Outlet } from '../../types/outlet';

type Props = {
  onEdit: (outlet: Outlet) => void;
};

const OutletsTable: React.FC<Props> = ({ onEdit }) => {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this outlet?')) {
      // Implement delete logic
      console.log('Deleting outlet:', id);
    }
  };

  return (
    <div className="bg-[#2A2A2A] rounded-xl border border-white/10">
      <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 text-sm font-medium text-gray-400">
        <div className="col-span-2">Outlet</div>
        <div>Owner</div>
        <div>Contact</div>
        <div>Address</div>
        <div>Actions</div>
      </div>

      <div className="divide-y divide-white/10">
        {outlets.map((outlet) => (
          <div key={outlet.id} className="grid grid-cols-6 gap-4 p-4 items-center">
            <div className="col-span-2">
              <h3 className="text-white font-medium">{outlet.name}</h3>
              <p className="text-sm text-gray-400">#{outlet.id}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-white">{outlet.owner}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-white">{outlet.contact}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-white truncate">{outlet.address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(outlet)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Edit2 className="h-4 w-4 text-blue-500" />
              </button>
              <button
                onClick={() => handleDelete(outlet.id)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletsTable;