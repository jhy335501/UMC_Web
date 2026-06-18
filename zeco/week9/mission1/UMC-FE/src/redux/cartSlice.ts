import { createSlice } from '@reduxjs/toolkit';
import cartItemsData from '../constants/cartItems';

export type CartItem = {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
};

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

function calculateInitialTotals(items: CartItem[]) {
  let amount = 0;
  let total = 0;
  items.forEach((item) => {
    amount += item.amount;
    total += item.amount * Number(item.price);
  });
  return { amount, total };
}

const { amount: initialAmount, total: initialTotal } = calculateInitialTotals(cartItemsData);

const initialState: CartState = {
  cartItems: cartItemsData,
  amount: initialAmount,
  total: initialTotal,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: { payload: string }) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    decrease: (state, action: { payload: string }) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount -= 1;
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        }
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeItem: (state, action: { payload: string }) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
