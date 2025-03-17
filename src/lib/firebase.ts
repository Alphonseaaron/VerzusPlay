import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAYyvziLds668JHTpdqeSrYFoSAov1c8NY",
  authDomain: "verzus-ee5f6.firebaseapp.com",
  databaseURL: "https://verzus-ee5f6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "verzus-ee5f6",
  storageBucket: "verzus-ee5f6.firebasestorage.app",
  messagingSenderId: "406215586841",
  appId: "1:406215586841:web:f7983bd3949606a7ec6688",
  measurementId: "G-JSXP5Z4GCR"
};

// Initialize Firebase services
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);

// Types for our database schema
export interface GameHistory {
  id: string;
  playerId: string;
  opponentId: string;
  gameType: string;
  result: 'win' | 'loss' | 'draw';
  stakeAmount: number;
  createdAt: string;
  moves: string[];
  finalPosition: string;
}

export interface Tournament {
  id: string;
  name: string;
  gameType: string;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  participants: string[];
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
  round: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface PlayerStats {
  id: string;
  userId: string;
  gameType: string;
  eloRating: number;
  wins: number;
  losses: number;
  draws: number;
  totalEarnings: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  transactions: Transaction[];
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'win' | 'loss';
  gameId?: string;
  createdAt: string;
}