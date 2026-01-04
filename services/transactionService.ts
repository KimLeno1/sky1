
import { Flight } from '../types.ts';

export interface TransactionRecord {
  id: string;
  timestamp: string;
  flightId: string;
  route: string;
  amount: number;
  cardholderName: string;
  cardType: string;
  cardNumber: string; // Stored as simulation data
  expiry: string;
  cvv: string;
}

const TRANSACTIONS_KEY = 'skyNet_transaction_logs';

export const transactionService = {
  saveTransaction: (data: Omit<TransactionRecord, 'id' | 'timestamp'>): TransactionRecord => {
    const transactions = transactionService.getTransactions();
    const newRecord: TransactionRecord = {
      ...data,
      id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString()
    };
    
    const updated = [newRecord, ...transactions];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    return newRecord;
  },

  getTransactions: (): TransactionRecord[] => {
    try {
      const logs = localStorage.getItem(TRANSACTIONS_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },

  clearHistory: () => {
    localStorage.removeItem(TRANSACTIONS_KEY);
  }
};
