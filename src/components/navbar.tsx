import { motion } from 'framer-motion';
import {
  Award,
  Gamepad2,
  Home,
  LayoutGrid,
  Settings,
  Trophy,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { AuthModal } from './auth/auth-modal';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

const NAV_ITEMS: NavItemProps[] = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: LayoutGrid, label: 'Games', to: '/games' },
  { icon: Trophy, label: 'Tournaments', to: '/tournaments' },
  { icon: Award, label: 'Leaderboard', to: '/leaderboard' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

function NavItem({ icon: Icon, label, to }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3',
          'transition-colors duration-200',
          'lg:w-full',
          isActive
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:bg-white/10 hover:text-white'
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="hidden text-sm font-medium lg:block">{label}</span>
      </motion.button>
    </Link>
  );
}

export function Navbar() {
  const { user, profile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 lg:left-0 lg:top-0 lg:h-screen lg:w-64',
          'bg-white/5 backdrop-blur-xl lg:border-r lg:border-white/10',
          'flex flex-col p-4'
        )}
      >
        <div className="flex items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-3">
            <Gamepad2 className="h-8 w-8 text-white" />
            <h1 className="hidden text-xl font-bold text-white lg:block">VerzusPlay</h1>
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="mt-auto px-4 pt-8 lg:pt-16">
          {user ? (
            <Link to="/wallet" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <Wallet className="h-5 w-5" />
                <span className="hidden lg:block">${profile?.balance || '0.00'}</span>
              </motion.button>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAuthModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700"
            >
              <Wallet className="h-5 w-5" />
              <span className="hidden lg:block">Sign In</span>
            </motion.button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}