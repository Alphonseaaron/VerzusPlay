import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { GamePage } from './pages/game';
import { GamesPage } from './pages/games';
import { HomePage } from './pages/home';
import { LeaderboardPage } from './pages/leaderboard';
import { SettingsPage } from './pages/settings';
import { TournamentsPage } from './pages/tournaments';
import { WalletPage } from './pages/wallet';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Navbar />
      
      <main className="pb-24 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/game/:id" element={<GamePage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;