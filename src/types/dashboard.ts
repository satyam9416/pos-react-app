export type OutletData = {
  id: string;
  name: string;
  location: string;
  zone: string;
};

export type SalesOverview = {
  totalSales: number;
  netSales: number;
  orderCount: number;
  expenses: number;
  cashCollection: number;
  onlineSales: number;
  taxes: number;
  discounts: number;
};

export type ZoneStats = {
  zone: string;
  sales: number;
  orderCount: number;
  performance: number;
};

export type PaymentStats = {
  cash: number;
  card: number;
  wallet: number;
  duePayments: number;
  upi: number;
  other: number;
};

export type TaxBreakdown = {
  cgst: number;
  sgst: number;
};

export type OrderTypeStats = {
  dineIn: {
    count: number;
    maximum: number;
    minimum: number;
    average: number;
    discounts: number;
    taxes: number;
  };
  takeaway: {
    count: number;
    sales: number;
  };
  delivery: {
    count: number;
    sales: number;
  };
};

export type OrderStatistics = {
  successful: number;
  canceled: number;
  complimentary: number;
  tableTurnover: number;
};

export type ProductAnalytics = {
  topSelling: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lowSelling: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
};

export type RevenueLoss = {
  modifiedBills: number;
  reprintedBills: number;
  waivedBills: number;
  modifiedKOTs: number;
  unusedItems: number;
};

export type Expenses = {
  total: number;
  ownerPayments: number;
  productExpenses: number;
  maintenance: Array<{
    category: string;
    amount: number;
  }>;
};