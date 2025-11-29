import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');

// Log configuration status
if (isSupabaseConfigured) {
    console.log('✅ Supabase configured:', supabaseUrl);
} else {
    console.warn('⚠️ Supabase not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env.local');
}

// Create client
let supabaseClient: SupabaseClient;

if (isSupabaseConfigured) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage,
        },
    });
} else {
    // Create a placeholder client that won't crash the app
    supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key', {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
    },
});
}

export const supabase = supabaseClient;

// ===============================================
// Database Types (matching new schema)
// ===============================================

export type UserRole = 'customer' | 'admin' | 'superadmin';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface UserProfile {
                    id: string;
                    email: string;
                    full_name: string | null;
                    phone: string | null;
    role: UserRole;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
}

export interface ProductCategory {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
}

export interface Product {
                    id: string;
                    name: string;
                    slug: string;
                    category_id: string | null;
                    price: number;
                    description: string | null;
                    image_url: string | null;
                    in_stock: boolean;
                    is_featured: boolean;
                    discount: number;
                    rating: number;
                    review_count: number;
                    features: string[] | null;
                    specifications: Record<string, any> | null;
                    related_product_ids: string[] | null;
                    created_at: string;
                    updated_at: string;
    // Joined data
    category?: ProductCategory;
}

export interface Branch {
                    id: string;
                    name: string;
                    address: string;
                    city: string;
                    phone: string;
                    email: string;
                    latitude: number;
                    longitude: number;
                    working_hours_weekdays: string;
                    working_hours_saturday: string;
                    working_hours_sunday: string;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
}

export interface Testimonial {
                    id: string;
                    user_id: string | null;
                    customer_name: string;
                    rating: number;
                    comment: string;
                    avatar_url: string | null;
                    is_approved: boolean;
                    is_featured: boolean;
                    created_at: string;
                    updated_at: string;
}

export interface Order {
                    id: string;
                    user_id: string;
                    order_number: string;
                    total_amount: number;
    status: OrderStatus;
                    payment_method: string;
    payment_status: PaymentStatus;
                    shipping_address: Record<string, any>;
                    tracking_number: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
    // Joined data
    items?: OrderItem[];
}

export interface OrderItem {
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    product_name: string;
                    product_price: number;
                    quantity: number;
                    subtotal: number;
                    created_at: string;
}

export interface Car {
                    id: string;
                    user_id: string;
                    brand: string;
                    model: string;
                    year: number | null;
                    engine: string;
                    horsepower: number | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
}

export interface ContactMessage {
                    id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    subject: string;
                    message: string;
    status: MessageStatus;
                    admin_notes: string | null;
                    created_at: string;
                    updated_at: string;
}

export interface AuditLog {
    id: string;
    user_id: string | null;
    action: string | null;
    operation: string | null;  // Alias for action - both are synced
    table_name: string;
    record_id: string | null;
    old_data: Record<string, any> | null;
    new_data: Record<string, any> | null;
    ip_address: string | null;
    created_at: string;
}

// ===============================================
// Database interface for type safety
// ===============================================

export interface Database {
    public: {
        Tables: {
            user_profiles: {
                Row: UserProfile;
                Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
            };
            product_categories: {
                Row: ProductCategory;
                Insert: Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>>;
            };
            products: {
                Row: Product;
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
            };
            branches: {
                Row: Branch;
                Insert: Omit<Branch, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Branch, 'id' | 'created_at' | 'updated_at'>>;
            };
            testimonials: {
                Row: Testimonial;
                Insert: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>;
            };
            orders: {
                Row: Order;
                Insert: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>>;
            };
            order_items: {
                Row: OrderItem;
                Insert: Omit<OrderItem, 'id' | 'created_at'>;
                Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>;
            };
            cars: {
                Row: Car;
                Insert: Omit<Car, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>;
            };
            contact_messages: {
                Row: ContactMessage;
                Insert: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>>;
            };
            audit_logs: {
                Row: AuditLog;
                Insert: Omit<AuditLog, 'id' | 'created_at'>;
                Update: never;
            };
        };
    };
}
