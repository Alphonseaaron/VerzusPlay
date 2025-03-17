import { collection, query, where, getDocs, addDoc, updateDoc, onSnapshot, doc } from 'firebase/firestore';
import { ref, onValue, set } from 'firebase/database';
import { db, rtdb } from './firebase';
import type { UserProfile } from './auth';

export interface MatchRequest {
  id: string;
  playerId: string;
  gameType: string;
  stake: number;
  eloRating: number;
  status: 'pending' | 'matched' | 'cancelled';
  createdAt: string;
}

export interface Match {
  id: string;
  gameType: string;
  stake: number;
  player1: UserProfile;
  player2: UserProfile;
  status: 'waiting' | 'in_progress' | 'completed';
  winner?: string;
  createdAt: string;
}

export class MatchmakingManager {
  private userId: string;
  private matchRequestRef: any;
  private activeMatchRef: any;

  constructor(userId: string) {
    this.userId = userId;
  }

  async findMatch(gameType: string, stake: number, eloRating: number): Promise<string> {
    // First, look for existing match requests
    const matchesQuery = query(
      collection(db, 'matchRequests'),
      where('gameType', '==', gameType),
      where('stake', '==', stake),
      where('status', '==', 'pending'),
      where('playerId', '!=', this.userId)
    );

    const snapshot = await getDocs(matchesQuery);
    
    if (!snapshot.empty) {
      // Found a match request, join it
      const matchRequest = snapshot.docs[0];
      const match: Match = {
        id: crypto.randomUUID(),
        gameType,
        stake,
        player1: { uid: matchRequest.data().playerId } as UserProfile,
        player2: { uid: this.userId } as UserProfile,
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'matches'), match);
      await updateDoc(doc(db, 'matchRequests', matchRequest.id), {
        status: 'matched',
      });

      return match.id;
    }

    // No match found, create a new request
    const matchRequest: MatchRequest = {
      id: crypto.randomUUID(),
      playerId: this.userId,
      gameType,
      stake,
      eloRating,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'matchRequests'), matchRequest);
    return matchRequest.id;
  }

  listenToMatchRequest(requestId: string, onMatch: (matchId: string) => void) {
    this.matchRequestRef = doc(db, 'matchRequests', requestId);
    
    return onSnapshot(this.matchRequestRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.status === 'matched') {
        // Find the match
        const matchesQuery = query(
          collection(db, 'matches'),
          where('player1.uid', '==', this.userId),
          where('status', '==', 'waiting')
        );

        getDocs(matchesQuery).then((matches) => {
          if (!matches.empty) {
            onMatch(matches.docs[0].id);
          }
        });
      }
    });
  }

  listenToMatch(matchId: string, onStateChange: (state: any) => void) {
    this.activeMatchRef = ref(rtdb, `matches/${matchId}`);
    
    return onValue(this.activeMatchRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onStateChange(data);
      }
    });
  }

  async updateMatchState(matchId: string, state: any) {
    await set(ref(rtdb, `matches/${matchId}`), state);
  }

  cleanup() {
    // Clean up listeners
    if (this.matchRequestRef) {
      this.matchRequestRef();
    }
    if (this.activeMatchRef) {
      this.activeMatchRef();
    }
  }
}