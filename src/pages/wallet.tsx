import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { WalletManager } from '../lib/wallet';
import type { Transaction, Wallet } from '../lib/firebase';
import { cn } from '../lib/utils';

export function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const walletManager = new WalletManager(user.uid);
    
    const loadWalletData = async () => {
      try {
        const walletData = await walletManager.getWallet();
        const transactionHistory = await walletManager.getTransactionHistory();
        
        setWallet(walletData);
        setTransactions(transactionHistory);
      } catch (err) {
        setError('Failed to load wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    loadWalletData();
  }, [user]);

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    if (!user || !amount) return;

    const walletManager = new WalletManager(user.uid);
    setError('');

    try {
      if (type === 'deposit') {
        await walletManager.deposit(parseFloat(amount));
      } else {
        await walletManager.withdraw(parseFloat(amount));
      }

      // Refresh wallet data
      const walletData = await walletManager.getWallet();
      const transactionHistory = await walletManager.getTransactionHistory();
      
      setWallet(walletData);
      setTransactions(transactionHistory);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="mb-4 text-4xl font-bold text-white">Wallet</h2>
        <p className="mx-auto max-w-2xl text-lg text-white/60">
          Manage your funds, make deposits, and track your gaming transactions.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl bg-white/10 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-xl font-semibold text-white">Balance</h3>
          <div className="mb-6 flex items-baseline">
            <DollarSign className="mr-2 h-8 w-8 text-purple-400" />
            <span className="text-4xl font-bold text-white">
              {wallet?.balance.toFixed(2) || '0.00'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50"
                placeholder="Enter amount..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => handleTransaction('deposit')}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
              >
                <ArrowUpCircle className="h-5 w-5" />
                Deposit
              </button>
              <button
                onClick={() => handleTransaction('withdraw')}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
              >
                <ArrowDownCircle className="h-5 w-5" />
                Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl bg-white/10 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-xl font-semibold text-white">
            Transaction History
          </h3>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-white/60">No transactions yet</p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    {transaction.type === 'deposit' ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-400" />
                    ) : transaction.type === 'withdrawal' ? (
                      <ArrowDownCircle className="h-5 w-5 text-red-400" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-purple-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">
                        {transaction.type.charAt(0).toUpperCase() + 
                         transaction.type.slice(1)}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-white/60">
                        <Clock className="h-4 w-4" />
                        {format(new Date(transaction.createdAt), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'font-mono text-lg',
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}