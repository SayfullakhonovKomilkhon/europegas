export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'ECU Control Units' | 'Rail Injectors' | 'Gas Reducers' | 'Other';
  description: string;
  imageUrl: string;
  inStock: boolean;
  features?: string[];
  specifications?: {
    [key: string]: string | number;
  };
  relatedProducts?: string[];
  isFeatured?: boolean;
  discount?: number;
  rating?: number;
  reviewCount?: number;
}

export interface Car {
  brand: string;
  model: string;
  engine: string; // Changed from number to string for more flexibility (e.g., "1.6 diesel")
  horsepower: number;
  createdAt: Date; // Changed from any to Date for better type safety
  id?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
  avatarUrl?: string;
} 