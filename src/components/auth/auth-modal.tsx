import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { countries } from '../../lib/countries';
import { cn } from '../../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  
  const { signIn, signUp } = useAuth();

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredPhoneCodes = countries.filter(country =>
    country.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
    country.dialCode.includes(phoneSearch)
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, username, selectedCountry.code, selectedCountry.dialCode + phone);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // Implement password reset logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setError('Password reset link sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const dropdownStyles = {
    container: "absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-white/20 bg-gray-800/95 shadow-xl backdrop-blur-xl",
    searchContainer: "sticky top-0 border-b border-white/20 bg-gray-800/95 p-2",
    searchInput: "flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2",
    searchIcon: "h-4 w-4 text-white/60",
    input: "w-full bg-transparent text-sm text-white placeholder-white/50 focus:outline-none",
    listContainer: "max-h-48 overflow-y-auto",
    option: "flex w-full items-center gap-2 px-4 py-2 text-white transition-colors hover:bg-white/10",
    flag: "text-2xl",
    text: "text-white/90",
    subtext: "text-sm text-white/60",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md rounded-2xl bg-gray-800/95 p-6 shadow-2xl backdrop-blur-xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50"
                required
              />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowCountryDropdown(!showCountryDropdown);
                    setShowPhoneDropdown(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <span className="text-white/90">{selectedCountry.name}</span>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {showCountryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={dropdownStyles.container}
                    >
                      <div className={dropdownStyles.searchContainer}>
                        <div className={dropdownStyles.searchInput}>
                          <Search className={dropdownStyles.searchIcon} />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className={dropdownStyles.input}
                          />
                        </div>
                      </div>
                      <div className={dropdownStyles.listContainer}>
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryDropdown(false);
                              setCountrySearch('');
                            }}
                            className={dropdownStyles.option}
                          >
                            <span className={dropdownStyles.flag}>{country.flag}</span>
                            <span className={dropdownStyles.text}>{country.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPhoneDropdown(!showPhoneDropdown);
                      setShowCountryDropdown(false);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
                  >
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <span className="text-white/90">{selectedCountry.dialCode}</span>
                    <ChevronDown className="h-5 w-5" />
                  </button>

                  <AnimatePresence>
                    {showPhoneDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(dropdownStyles.container, "w-72")}
                      >
                        <div className={dropdownStyles.searchContainer}>
                          <div className={dropdownStyles.searchInput}>
                            <Search className={dropdownStyles.searchIcon} />
                            <input
                              type="text"
                              placeholder="Search country codes..."
                              value={phoneSearch}
                              onChange={(e) => setPhoneSearch(e.target.value)}
                              className={dropdownStyles.input}
                            />
                          </div>
                        </div>
                        <div className={dropdownStyles.listContainer}>
                          {filteredPhoneCodes.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setShowPhoneDropdown(false);
                                setPhoneSearch('');
                              }}
                              className={dropdownStyles.option}
                            >
                              <span className={dropdownStyles.flag}>{country.flag}</span>
                              <span className={dropdownStyles.text}>{country.dialCode}</span>
                              <span className={dropdownStyles.subtext}>
                                {country.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50"
                  required
                />
              </div>
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50"
            required
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'flex-1 rounded-lg px-4 py-2 font-medium transition-colors',
                'bg-purple-600 text-white hover:bg-purple-700',
                'flex items-center justify-center gap-2',
                isLoading && 'cursor-not-allowed opacity-50'
              )}
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {!isSignUp && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full text-center text-sm text-purple-400 hover:text-purple-300"
            >
              Forgot Password?
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-4 w-full text-center text-sm text-white/60 hover:text-white"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}