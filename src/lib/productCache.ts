import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from '../types/Product';

// Cache configuration
const CACHE_KEY = 'europegas_products_cache';
const FEATURED_CACHE_KEY = 'europegas_featured_cache';
const CATEGORIES_CACHE_KEY = 'europegas_categories_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Memory cache for faster access
let memoryCacheFeatured: CacheEntry<Product[]> | null = null;
let memoryCacheCategories: CacheEntry<Category[]> | null = null;
const memoryCacheProducts = new Map<string, CacheEntry<Product[]>>();

// Helper to check if cache is valid
const isCacheValid = <T>(entry: CacheEntry<T> | null | undefined): entry is CacheEntry<T> => {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL;
};

// Get from localStorage
const getFromStorage = <T>(key: string): CacheEntry<T> | null => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to read from localStorage');
  }
  return null;
};

// Save to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    console.warn('Failed to save to localStorage');
  }
};

// Map Supabase product to app Product type
const mapProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  price: p.price || 0,
  category: p.category?.name || 'Other',
  description: p.description || '',
  imageUrl: p.image_url || '/images/products/productlogo.png',
  inStock: p.in_stock ?? true,
  isFeatured: p.is_featured ?? false,
  discount: p.discount || 0,
  rating: p.rating || 0,
  reviewCount: p.review_count || 0,
  features: p.features || [],
  specifications: p.specifications || {},
});

// Fetch featured products with caching
export const getFeaturedProducts = async (): Promise<{ products: Product[]; fromCache: boolean }> => {
  // Check memory cache first
  if (isCacheValid(memoryCacheFeatured)) {
    return { products: memoryCacheFeatured.data, fromCache: true };
  }

  // Check localStorage cache
  const storedCache = getFromStorage<Product[]>(FEATURED_CACHE_KEY);
  if (isCacheValid(storedCache)) {
    memoryCacheFeatured = storedCache;
    // Fetch fresh data in background
    fetchFeaturedFromSupabase().catch(console.warn);
    return { products: storedCache.data, fromCache: true };
  }

  // Fetch from Supabase
  const products = await fetchFeaturedFromSupabase();
  return { products, fromCache: false };
};

const fetchFeaturedFromSupabase = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, description, image_url, in_stock, is_featured, discount, rating, review_count, features, specifications, category:product_categories(name)')
      .eq('is_featured', true)
      .limit(4);

    if (error) throw error;

    const products = (data || []).map(mapProduct);
    
    // Update caches
    memoryCacheFeatured = { data: products, timestamp: Date.now() };
    saveToStorage(FEATURED_CACHE_KEY, products);
    
    console.log('✅ Fetched', products.length, 'featured products from Supabase');
    return products;
  } catch (err) {
    console.warn('Failed to fetch featured products:', err);
    return [];
  }
};

// Fetch all products with caching
export const getProducts = async (categorySlug?: string): Promise<{ products: Product[]; fromCache: boolean }> => {
  const cacheKey = categorySlug ? `${CACHE_KEY}_${categorySlug}` : CACHE_KEY;
  const memoryCacheKey = categorySlug || 'all';
  
  // Check memory cache
  const memEntry = memoryCacheProducts.get(memoryCacheKey);
  if (isCacheValid(memEntry)) {
    return { products: memEntry.data, fromCache: true };
  }

  // Check localStorage cache
  const storedCache = getFromStorage<Product[]>(cacheKey);
  if (isCacheValid(storedCache)) {
    memoryCacheProducts.set(memoryCacheKey, storedCache);
    // Fetch fresh data in background
    fetchProductsFromSupabase(categorySlug).catch(console.warn);
    return { products: storedCache.data, fromCache: true };
  }

  // Fetch from Supabase
  const products = await fetchProductsFromSupabase(categorySlug);
  return { products, fromCache: false };
};

const fetchProductsFromSupabase = async (categorySlug?: string): Promise<Product[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    let query = supabase
      .from('products')
      .select('id, name, price, description, image_url, in_stock, is_featured, discount, rating, review_count, features, specifications, category_id, category:product_categories(name, slug)')
      .order('created_at', { ascending: false });

    if (categorySlug) {
      // Need to filter by category slug through the relationship
      const { data: categories } = await supabase
        .from('product_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();
      
      if (categories?.id) {
        query = query.eq('category_id', categories.id);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    const products = (data || []).map(mapProduct);
    
    // Update caches
    const cacheKey = categorySlug ? `${CACHE_KEY}_${categorySlug}` : CACHE_KEY;
    const memoryCacheKey = categorySlug || 'all';
    
    memoryCacheProducts.set(memoryCacheKey, { data: products, timestamp: Date.now() });
    saveToStorage(cacheKey, products);
    
    console.log('✅ Fetched', products.length, 'products from Supabase');
    return products;
  } catch (err) {
    console.warn('Failed to fetch products:', err);
    return [];
  }
};

// Fetch categories with caching
export const getCategories = async (): Promise<{ categories: Category[]; fromCache: boolean }> => {
  // Check memory cache
  if (isCacheValid(memoryCacheCategories)) {
    return { categories: memoryCacheCategories.data, fromCache: true };
  }

  // Check localStorage cache
  const storedCache = getFromStorage<Category[]>(CATEGORIES_CACHE_KEY);
  if (isCacheValid(storedCache)) {
    memoryCacheCategories = storedCache;
    // Fetch fresh in background
    fetchCategoriesFromSupabase().catch(console.warn);
    return { categories: storedCache.data, fromCache: true };
  }

  // Fetch from Supabase
  const categories = await fetchCategoriesFromSupabase();
  return { categories, fromCache: false };
};

const fetchCategoriesFromSupabase = async (): Promise<Category[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;

    const categories = data || [];
    
    // Update caches
    memoryCacheCategories = { data: categories, timestamp: Date.now() };
    saveToStorage(CATEGORIES_CACHE_KEY, categories);
    
    console.log('✅ Fetched', categories.length, 'categories from Supabase');
    return categories;
  } catch (err) {
    console.warn('Failed to fetch categories:', err);
    return [];
  }
};

// Clear all caches (useful after admin updates)
export const clearProductCache = (): void => {
  memoryCacheFeatured = null;
  memoryCacheCategories = null;
  memoryCacheProducts.clear();
  
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(FEATURED_CACHE_KEY);
    localStorage.removeItem(CATEGORIES_CACHE_KEY);
    // Clear category-specific caches
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ Product cache cleared');
  } catch (e) {
    console.warn('Failed to clear cache');
  }
};

// Prefetch products on app load
export const prefetchProducts = (): void => {
  if (!isSupabaseConfigured) return;
  
  console.log('🚀 Prefetching products...');
  
  // Prefetch in background
  Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getProducts()
  ]).catch(console.warn);
};
