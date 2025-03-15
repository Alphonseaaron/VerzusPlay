import { motion } from 'framer-motion';

export function WalletPage() {
  return (
    <div className="text-center text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        Wallet
      </motion.h2>
    </div>
  );
}