
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, User } from './icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;
  
  const heardAboutUsOptions: { [key: string]: string } = {
    social_media: 'Social Media',
    friend_or_family: 'Friend or Family',
    google_search: 'Google Search',
    advertisement: 'Advertisement',
    other: 'Other'
  };

  const heardAboutUsText = user.user_metadata?.heard_about_us 
    ? heardAboutUsOptions[user.user_metadata.heard_about_us] || user.user_metadata.heard_about_us
    : 'Not specified';

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
        
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4 border-4 border-amber-400">
                <User className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{user.user_metadata?.full_name || 'User Profile'}</h2>
            <p className="text-gray-400 mb-6">{user.email}</p>
        </div>

        <div className="border-t border-gray-700 pt-6 space-y-4">
            <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Role:</span>
                <span className="text-gray-200 capitalize">{user.user_metadata?.role || 'Client'}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Heard about us from:</span>
                <span className="text-gray-200">{heardAboutUsText}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Member since:</span>
                <span className="text-gray-200">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
