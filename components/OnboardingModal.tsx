import React, { useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { X, Loader } from './icons';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [heardAboutUs, setHeardAboutUs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() === '' || heardAboutUs === '') {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError(null);

    const { client: supabase } = getSupabase();
    if (!supabase) {
      setError("Service is currently unavailable.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          heard_about_us: heardAboutUs,
        }
      });
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
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
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Complete Your Profile</h2>
        <p className="text-center text-gray-400 mb-6">Just a couple more details to get you started.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full p-3 text-md text-gray-100 border border-gray-600 rounded-lg bg-gray-900 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400 transition-colors"
              required
            />
            <select
              id="heard-about-us-onboarding"
              value={heardAboutUs}
              onChange={(e) => setHeardAboutUs(e.target.value)}
              className="block w-full p-3 text-md text-gray-100 border border-gray-600 rounded-lg bg-gray-900 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400 transition-colors"
              required
            >
              <option value="" disabled>How did you hear about us?</option>
              <option value="social_media">Social Media</option>
              <option value="friend_or_family">Friend or Family</option>
              <option value="google_search">Google Search</option>
              <option value="advertisement">Advertisement</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 text-gray-900 bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-semibold rounded-lg text-md px-6 py-3 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="w-6 h-6" /> : 'Save and Continue'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-400 bg-red-400/10 p-3 rounded-lg">{error}</p>}
      </div>
    </div>
  );
};

export default OnboardingModal;
