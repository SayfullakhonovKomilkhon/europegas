import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product, CartItem } from '../types/Product';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  // Aliases for backward compatibility
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Helper function to safely parse cart data
const safelyParseCart = (data: string | null): CartItem[] => {
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    
    // Validate each item has the expected structure
    return parsed.filter(item => 
      item && 
      typeof item === 'object' && 
      item.product && 
      typeof item.product === 'object' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0
    );
  } catch (error) {
    console.error('Failed to parse cart from localStorage:', error);
    return [];
  }
};

// Helper function to safely save cart data
const safelySaveCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const parsedCart = safelyParseCart(savedCart);
    setItems(parsedCart);
  }, []);

  // Update localStorage whenever cart changes, but debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      safelySaveCart(items);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [items]);

  // Calculate totals whenever items change
  useEffect(() => {
    // Calculate totals
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const priceSum = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(priceSum);
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (!product || !product.id || quantity <= 0) return;
    
    setItems(prevItems => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, { product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    if (!productId) return;
    
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    items,
    totalItems,
    totalPrice,
    // Aliases for backward compatibility
    cartItems: items,
    cartTotal: totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }), [items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 