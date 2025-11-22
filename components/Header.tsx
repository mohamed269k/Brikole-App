
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';
import { Globe, Menu, X, Wrench, List, UserPlus } from './icons';

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  onProfileClick: () => void;
}

const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute w-full h-full text-amber-400 fill-current">
        <path d="M62.6,0H23.1C10.3,0,0,10.3,0,23.1v53.7C0,89.7,10.3,100,23.1,100h39.5c12.8,0,23.1-10.3,23.1-23.1V62.6C85.7,62.6,62.6,0,62.6,0z M62.6,76.9c0,2.6-2.1,4.7-4.7,4.7H23.1c-2.6,0-4.7-2.1,4.7-4.7V23.1c0-2.6,2.1-4.7,4.7-4.7h34.8V62.6C57.9,70.5,62.6,76.9,62.6,76.9z" />
      </svg>
      <div className="relative text-gray-900 w-6 h-6">
         <Wrench className="w-full h-full transform -rotate-45" />
      </div>
    </div>
    <span className="text-3xl font-bold text-white tracking-tighter">Brikole</span>
  </div>
);

const Header: React.FC<HeaderProps> = ({ currentLang, setLang, t, onProfileClick }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { session, user, signOut, isSupabaseConfigured } = useAuth();
  
  const isProvider = user?.user_metadata?.role === 'provider';
  // Allow any logged-in user who is NOT a provider to post jobs. 
  // This covers 'client', 'admin', and users with no specific role set.
  const canPostJob = user && !isProvider;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLangChange = (lang: Language) => {
    setLang(lang);
    setIsLangOpen(false);
  };

  const navLinks = (
    <>
      {isSupabaseConfigured && (
        session && user ? (
          <>
            {canPostJob && (
              <a href="#/post-job" className="flex items-center gap-2 text-gray-200 hover:text-amber-400 transition-colors font-medium">
                <UserPlus className="w-5 h-5" />
                <span>{t('post_a_job')}</span>
              </a>
            )}
            {isProvider && (
              <a href="#/jobs" className="flex items-center gap-2 text-gray-200 hover:text-amber-400 transition-colors font-medium">
                <List className="w-5 h-5" />
                <span>{t('job_board')}</span>
              </a>
            )}
            <UserMenu user={user} onLogout={signOut} onProfileClick={onProfileClick} t={t} />
          </>
        ) : (
          <a 
            href="#/login"
            className="bg-amber-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-300"
          >
            {t('login_signup')}
          </a>
        )
      )}
      <div className="relative" ref={langRef}>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Change language"
        >
          <Globe className="w-6 h-6 text-white" />
        </button>
        {isLangOpen && (
          <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 w-36">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentLang === lang.code
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a href="#/" aria-label="Go to homepage">
            <Logo />
          </a>
          <div className="hidden md:flex items-center gap-4">
            {navLinks}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
         <div className="md:hidden bg-gray-900 pb-4 px-4">
            <div className="flex flex-col items-center gap-4">
               {navLinks}
            </div>
         </div>
      )}
    </header>
  );
};

export default Header;
