
import React, { useState, useRef, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User as UserIcon, ChevronDown } from './icons';

interface UserMenuProps {
  user: SupabaseUser;
  onLogout: () => void;
  onProfileClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-200">{user.user_metadata?.full_name || user.email}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 w-48">
          <button
            onClick={() => {
              onProfileClick();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            Profile
          </button>
          <div className="border-t border-gray-700 my-1"></div>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
