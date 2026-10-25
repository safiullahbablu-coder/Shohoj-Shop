export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
export type Language = 'bn' | 'en';

export interface Product {
  id: string;
  sku: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  stockStatus: StockStatus;
  stockLabel: string;
  badge: string;
  badgeType: 'sale' | 'deal' | 'organic' | 'fashion' | 'sold-out';
  rating: string;
  reviews: string;
  image: string;
  imageAlt: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WhatsAppConfig {
  phoneNumber: string;
  messageTemplate: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'delivered';
  date: string;
  createdAt?: string;
  couponCode?: string;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  address?: string;
  role: 'customer' | 'admin';
}

