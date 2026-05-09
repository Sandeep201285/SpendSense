export const mockTransactions = [
  {
    id: '1',
    merchant: 'Swiggy',
    amount: 350.50,
    date: '2023-10-27T14:30:00Z',
    category: 'Food',
    type: 'expense'
  },
  {
    id: '2',
    merchant: 'Uber',
    amount: 220.00,
    date: '2023-10-27T09:15:00Z',
    category: 'Travel',
    type: 'expense'
  },
  {
    id: '3',
    merchant: 'Amazon',
    amount: 1499.00,
    date: '2023-10-26T18:45:00Z',
    category: 'Shopping',
    type: 'expense'
  },
  {
    id: '4',
    merchant: 'Salary',
    amount: 85000.00,
    date: '2023-10-25T10:00:00Z',
    category: 'Income',
    type: 'income'
  },
  {
    id: '5',
    merchant: 'Netflix',
    amount: 649.00,
    date: '2023-10-24T08:00:00Z',
    category: 'Entertainment',
    type: 'expense'
  },
  {
    id: '6',
    merchant: 'Zomato',
    amount: 410.00,
    date: '2023-10-23T20:30:00Z',
    category: 'Food',
    type: 'expense'
  },
  {
    id: '7',
    merchant: 'Jio Prepaid',
    amount: 299.00,
    date: '2023-10-22T11:20:00Z',
    category: 'Bills',
    type: 'expense'
  }
];

export const mockDashboardData = {
  totalSpend: 3427.50,
  spendingScore: 785, // Out of 900
};

export const mockBudgets = [
  { id: '1', category: 'Food & Dining', spent: 4500, limit: 10000 },
  { id: '2', category: 'Shopping', spent: 8200, limit: 10000 },
  { id: '3', category: 'Travel', spent: 1500, limit: 4000 },
  { id: '4', category: 'Bills & Utilities', spent: 3000, limit: 3500 },
];

export const mockInsights = [
  { id: '1', title: 'Late-night Food Trends', description: 'You have spent ₹1,200 on late-night food orders this week. Consider cooking at home to save up to ₹4,800 a month.', type: 'warning' },
  { id: '2', title: 'Travel Savings', description: 'Your travel expenses are 15% lower than last month. Keep it up!', type: 'success' },
  { id: '3', title: 'Impulse Buying', description: 'Detected 3 transactions under ₹500 today. Try waiting 24 hours before small purchases.', type: 'info' }
];
