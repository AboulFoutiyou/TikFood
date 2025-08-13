export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sucré' | 'salé' | 'mixte' | 'jus';
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryAddress: string;
  notes?: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  isAvailable: boolean;
  openingHours: {
    start: string;
    end: string;
  };
  avatar?: string;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  weeklyOrders: number[];
  weeklyRevenue: number[];
  topProducts: {
    name: string;
    orders: number;
    revenue: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
}