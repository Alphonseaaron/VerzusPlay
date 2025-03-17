import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { Navbar } from './components/navbar';
import { AuthGuard } from './components/auth/auth-guard';
import { GamePage } from './pages/game';
import { GamesPage } from './pages/games';
import { HomePage } from './pages/home';
import { LeaderboardPage } from './pages/leaderboard';
import { SettingsPage } from './pages/settings';
import { TournamentsPage } from './pages/tournaments';
import { WalletPage } from './pages/wallet';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Navbar />
        
        <main className="pb-24 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/games" 
                element={
                  <AuthGuard allowGuest>
                    <GamesPage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/game/:id" 
                element={
                  <AuthGuard>
                    <GamePage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/tournaments" 
                element={
                  <AuthGuard>
                    <TournamentsPage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  <AuthGuard allowGuest>
                    <LeaderboardPage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <AuthGuard>
                    <WalletPage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <AuthGuard>
                    <SettingsPage />
                  </AuthGuard>
                } 
              />
            </Routes>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;