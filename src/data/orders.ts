import type { Order } from '../types/order';

export const orders: Order[] = [
  {
    id: '1001',
    items: [
      { name: 'Caramel Frappuccino', quantity: 2 },
      { name: 'Chocolate Muffin', quantity: 1, notes: 'Warmed up please' }
    ],
    type: 'delivery',
    status: 'pending',
    customerPhone: '+1 234-567-8900',
    orderTime: '10 mins ago'
  },
  {
    id: '1002',
    items: [
      { name: 'Iced Latte', quantity: 1 },
      { name: 'Croissant', quantity: 2 }
    ],
    type: 'takeaway',
    status: 'completed',
    customerPhone: '+1 234-567-8901',
    orderTime: '25 mins ago'
  },
  {
    id: '1003',
    items: [
      { name: 'Espresso', quantity: 1 },
      { name: 'Blueberry Muffin', quantity: 1 }
    ],
    type: 'takeaway',
    status: 'cancelled',
    customerPhone: '+1 234-567-8902',
    orderTime: '45 mins ago'
  }
];