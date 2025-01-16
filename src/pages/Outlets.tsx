import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import OutletsTable from '../components/outlets/OutletsTable';
import OutletModal from '../components/outlets/OutletModal';
import type { Outlet } from '../types/outlet';

const Outlets = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Outlets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Outlet
        </button>
      </div>

      <OutletsTable onEdit={handleEdit} />
      
      {showModal && (
        <OutletModal
          outlet={editingOutlet}
          onClose={() => {
            setShowModal(false);
            setEditingOutlet(null);
          }}
        />
      )}
    </div>
  );
};

export default Outlets;