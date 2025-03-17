import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Tournament, TournamentMatch } from './firebase';

export class TournamentManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async createTournament(
    name: string,
    gameType: string,
    entryFee: number,
    startDate: string,
    endDate: string
  ): Promise<string> {
    const tournament: Tournament = {
      id: crypto.randomUUID(),
      name,
      gameType,
      entryFee,
      prizePool: 0, // Will be updated as players join
      startDate,
      endDate,
      status: 'upcoming',
      participants: [this.userId],
      matches: [],
    };

    const docRef = await addDoc(collection(db, 'tournaments'), tournament);
    return docRef.id;
  }

  async joinTournament(tournamentId: string): Promise<void> {
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    const tournament = (await getDocs(query(collection(db, 'tournaments'), where('id', '==', tournamentId)))).docs[0];
    const tournamentData = tournament.data() as Tournament;

    if (tournamentData.status !== 'upcoming') {
      throw new Error('Tournament has already started');
    }

    if (tournamentData.participants.includes(this.userId)) {
      throw new Error('Already registered for this tournament');
    }

    await updateDoc(tournamentRef, {
      participants: [...tournamentData.participants, this.userId],
      prizePool: tournamentData.prizePool + tournamentData.entryFee,
    });
  }

  async getActiveTournaments(): Promise<Tournament[]> {
    const tournamentsQuery = query(
      collection(db, 'tournaments'),
      where('status', 'in', ['upcoming', 'in_progress']),
      orderBy('startDate', 'asc')
    );

    const snapshot = await getDocs(tournamentsQuery);
    return snapshot.docs.map(doc => doc.data() as Tournament);
  }

  async getTournamentMatches(tournamentId: string): Promise<TournamentMatch[]> {
    const matchesQuery = query(
      collection(db, 'tournamentMatches'),
      where('tournamentId', '==', tournamentId),
      where('status', '!=', 'completed'),
      orderBy('round', 'asc')
    );

    const snapshot = await getDocs(matchesQuery);
    return snapshot.docs.map(doc => doc.data() as TournamentMatch);
  }

  async updateMatchResult(
    matchId: string,
    winnerId: string
  ): Promise<void> {
    const matchRef = doc(db, 'tournamentMatches', matchId);
    await updateDoc(matchRef, {
      winnerId,
      status: 'completed',
    });
  }
}