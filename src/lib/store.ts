// src/lib/store.ts
// Zustand store for product selection and UI state
import { create } from 'zustand';
import type { Product } from './products';

interface CartItem {
  product: Product;
  quantity: number;
}

interface UIState {
  // Cart state
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // UI state
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  // Checkout state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<UIState>((set, get) => ({
  // Initial state
  cart: [],
  selectedProduct: null,
  isLoading: false,

  // Cart actions
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.slug === product.slug);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.slug === product.slug
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        cart: [...state.cart, { product, quantity }],
      };
    });
  },

  removeFromCart: (slug) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.slug !== slug),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  getCartTotal: () => {
    const state = get();
    return state.cart.reduce((total, item) => {
      return total + item.product.unitAmount * item.quantity;
    }, 0);
  },

  // Product selection
  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
  },

  // Loading state
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

