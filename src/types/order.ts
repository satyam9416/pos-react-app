export type OrderItem = {
  name: string;
  quantity: number;
  notes?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  type: 'delivery' | 'takeaway';
  status: 'pending' | 'completed' | 'cancelled';
  customerPhone: string;
  orderTime: string;
};