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
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItemProps[] = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: LayoutGrid, label: 'Games', to: '/games' },
  { icon: Trophy, label: 'Tournaments', to: '/tournaments', requiresAuth: true },
  { icon: Award, label: 'Leaderboard', to: '/leaderboard' },
  { icon: Wallet, label: 'Wallet', to: '/wallet', requiresAuth: true },
  { icon: Settings, label: 'Settings', to: '/settings', requiresAuth: true },
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
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:left-0 lg:top-0 lg:h-screen lg:w-64',
        'bg-white/5 backdrop-blur-xl lg:border-r lg:border-white/10',
        'p-4'
      )}
    >
      <div className="hidden items-center gap-3 px-4 lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <Gamepad2 className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold text-white">VerzusPlay</h1>
        </Link>
      </div>

      <div
        className={cn(
          'flex items-center justify-around gap-1',
          'lg:mt-8 lg:flex-col lg:items-stretch lg:gap-2'
        )}
      >
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}