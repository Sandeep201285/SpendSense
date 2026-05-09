import { create } from 'zustand';

const API_URL = 'https://spendsense-yshv.onrender.com';

export const useStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  budgetLimits: {
    'Food & Dining': 10000,
    'Shopping': 10000,
    'Travel': 4000,
    'Bills & Utilities': 3500,
    'Misc': 5000,
  },

  updateBudgetLimit: (category, limit) => set((state) => ({
    budgetLimits: {
      ...state.budgetLimits,
      [category]: limit
    }
  })),

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      set({ transactions: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
    }
  },

  addTransaction: async (transactionData) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) throw new Error('Failed to add transaction');
      
      
      const newTransaction = await response.json();
      
      // Update local state instantly
      set((state) => ({
        transactions: [newTransaction, ...state.transactions]
      }));
      
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  parseMessage: async (text) => {
    try {
      const response = await fetch(`${API_URL}/parse-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) throw new Error('Failed to parse message');
      
      const newTransaction = await response.json();
      
      set((state) => ({
        transactions: [newTransaction, ...state.transactions]
      }));
      
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}));
