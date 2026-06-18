import { create } from 'zustand';
import cartItemsData from '../constants/cartItems';

export type CartItem = {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
};

interface PlaylistState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  isModalOpen: boolean;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  let amount = 0;
  let total = 0;
  items.forEach((item) => {
    amount += item.amount;
    total += item.amount * Number(item.price);
  });
  return { amount, total };
};

const initialTotals = calculateTotals(cartItemsData);

export const usePlaylistStore = create<PlaylistState>((set) => ({
  cartItems: cartItemsData,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isModalOpen: false,

  increase: (id: string) =>
    set((state) => {
      const newItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      const totals = calculateTotals(newItems);
      return {
        cartItems: newItems,
        amount: totals.amount,
        total: totals.total,
      };
    }),

  decrease: (id: string) =>
    set((state) => {
      let newItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount - 1 } : item
      );
      newItems = newItems.filter((item) => item.amount > 0);
      const totals = calculateTotals(newItems);
      return {
        cartItems: newItems,
        amount: totals.amount,
        total: totals.total,
      };
    }),

  removeItem: (id: string) =>
    set((state) => {
      const newItems = state.cartItems.filter((item) => item.id !== id);
      const totals = calculateTotals(newItems);
      return {
        cartItems: newItems,
        amount: totals.amount,
        total: totals.total,
      };
    }),

  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  openModal: () =>
    set({
      isModalOpen: true,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
    }),
}));
