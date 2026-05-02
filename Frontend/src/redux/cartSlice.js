import { createSlice } from '@reduxjs/toolkit';

// Helper to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return {
        items: [],
        totalQuantity: 0,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      items: [],
      totalQuantity: 0,
    };
  }
};

// Helper to save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState = loadState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const quantityToAdd = newItem.quantity || 1;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      if (!existingItem) {
        state.totalQuantity += quantityToAdd;
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: quantityToAdd,
          totalPrice: newItem.price * quantityToAdd,
          image: newItem.image,
        });
      } else {
        if (newItem.replace) {
          // If replace is true, set the quantity exactly to the new value
          state.totalQuantity = state.totalQuantity - existingItem.quantity + quantityToAdd;
          existingItem.quantity = quantityToAdd;
          existingItem.totalPrice = (newItem.price || existingItem.price) * quantityToAdd;
        } else {
          // Standard additive behavior
          state.totalQuantity += quantityToAdd;
          existingItem.quantity += quantityToAdd;
          existingItem.totalPrice += ((newItem.price || existingItem.price) * quantityToAdd);
        }
      }
      saveState(state);
    },
    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.totalQuantity--;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
      }
      saveState(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      saveState(state);
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
