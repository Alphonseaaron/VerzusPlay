import { doc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { Transaction, Wallet } from './firebase';

export class WalletManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getWallet(): Promise<Wallet | null> {
    const walletRef = doc(db, 'wallets', this.userId);
    const walletDoc = await getDoc(walletRef);
    return walletDoc.exists() ? walletDoc.data() as Wallet : null;
  }

  async createWallet(): Promise<void> {
    const walletRef = doc(db, 'wallets', this.userId);
    await updateDoc(walletRef, {
      userId: this.userId,
      balance: 0,
      transactions: [],
      lastUpdated: new Date().toISOString(),
    });
  }

  async deposit(amount: number): Promise<void> {
    const walletRef = doc(db, 'wallets', this.userId);
    const wallet = await this.getWallet();

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      userId: this.userId,
      amount,
      type: 'deposit',
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'transactions'), transaction);
    await updateDoc(walletRef, {
      balance: wallet.balance + amount,
      lastUpdated: new Date().toISOString(),
    });
  }

  async withdraw(amount: number): Promise<void> {
    const walletRef = doc(db, 'wallets', this.userId);
    const wallet = await this.getWallet();

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      userId: this.userId,
      amount: -amount,
      type: 'withdrawal',
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'transactions'), transaction);
    await updateDoc(walletRef, {
      balance: wallet.balance - amount,
      lastUpdated: new Date().toISOString(),
    });
  }

  async processGameTransaction(amount: number, gameId: string, type: 'win' | 'loss'): Promise<void> {
    const walletRef = doc(db, 'wallets', this.userId);
    const wallet = await this.getWallet();

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (type === 'loss' && wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      userId: this.userId,
      amount: type === 'win' ? amount : -amount,
      type,
      gameId,
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'transactions'), transaction);
    await updateDoc(walletRef, {
      balance: type === 'win' ? wallet.balance + amount : wallet.balance - amount,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', this.userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(transactionsQuery);
    return snapshot.docs.map(doc => doc.data() as Transaction);
  }
}