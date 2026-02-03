import { useState } from 'react';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onLogin, onSignup }: LoginFormProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await onSignup(email, password);
      } else {
        await onLogin(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            MICROSENSE
          </h1>
          <p className="text-white/80 text-sm">
            {isSignup ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="••••••••"
              />
            </div>
            {isSignup && (
              <p className="mt-2 text-xs text-white/70">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-white text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-white/90 text-blue-600 font-semibold py-3 px-4 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
                <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-white/90 hover:text-white text-sm underline"
          >
            {isSignup
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/60">
          <p>Community-powered local weather monitoring for Davao City</p>
        </div>
      </div>
    </div>
  );
}