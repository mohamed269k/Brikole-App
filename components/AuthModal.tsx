import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { X, Loader } from './icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { isConfigured } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setMessage(null);
      setEmail('');
      setPassword('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = getSupabase();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
            },
          },
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl shadow-black/30 w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        {isConfigured ? (
          <>
            <div className="flex border-b border-gray-700 mb-6">
              <button 
                onClick={() => { setIsLogin(true); setError(null); setMessage(null); }}
                className={`w-1/2 py-3 font-semibold transition-colors ${isLogin ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(null); setMessage(null); }}
                className={`w-1/2 py-3 font-semibold transition-colors ${!isLogin ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-white mb-6">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
            
            <form onSubmit={handleAuthAction}>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full p-3 text-md text-gray-100 border border-gray-600 rounded-lg bg-gray-900 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400 transition-colors"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full p-3 text-md text-gray-100 border border-gray-600 rounded-lg bg-gray-900 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400 transition-colors"
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="mt-6">
                  <p className="text-gray-300 mb-3 font-medium">I am a:</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 border border-gray-600 rounded-lg cursor-pointer flex-1 hover:bg-gray-700 transition-colors has-[:checked]:border-amber-400 has-[:checked]:bg-amber-400/10">
                      <input type="radio" name="role" value="client" checked={role === 'client'} onChange={() => setRole('client')} className="accent-amber-400" />
                      <span className="text-gray-200">Client (Looking for a service)</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-600 rounded-lg cursor-pointer flex-1 hover:bg-gray-700 transition-colors has-[:checked]:border-amber-400 has-[:checked]:bg-amber-400/10">
                      <input type="radio" name="role" value="provider" checked={role === 'provider'} onChange={() => setRole('provider')} className="accent-amber-400" />
                      <span className="text-gray-200">Provider (Offering a service)</span>
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 text-gray-900 bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-semibold rounded-lg text-md px-6 py-3 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="w-6 h-6" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {error && <p className="mt-4 text-center text-red-400 bg-red-400/10 p-3 rounded-lg">{error}</p>}
            {message && <p className="mt-4 text-center text-green-400 bg-green-400/10 p-3 rounded-lg">{message}</p>}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Authentication Not Configured</h2>
            <p className="text-gray-300">
              This feature requires a connection to a database. The app developer must provide Supabase credentials in the project's secret settings to enable user sign-up and login.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
