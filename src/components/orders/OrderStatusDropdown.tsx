import React from 'react';
import { Filter } from 'lucide-react';

type OrderStatus = 'pending' | 'completed' | 'cancelled';

type Props = {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
};

const OrderStatusDropdown: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-5 w-5 text-content-muted" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        className="bg-surface-light text-content border border-surface-hover rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-thrifty-500/50"
      >
        <option value="pending">Pending Orders</option>
        <option value="completed">Completed Orders</option>
        <option value="cancelled">Cancelled Orders</option>
      </select>
    </div>
  );
};

export default OrderStatusDropdown;