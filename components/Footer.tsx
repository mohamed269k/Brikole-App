
import React from 'react';
import { Wrench } from './icons';

interface FooterProps {
  t: (key: string) => string;
}

const FooterLogo: React.FC = () => (
    <div className="flex items-center justify-center md:justify-start gap-2">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute w-full h-full text-amber-400 fill-current">
          <path d="M62.6,0H23.1C10.3,0,0,10.3,0,23.1v53.7C0,89.7,10.3,100,23.1,100h39.5c12.8,0,23.1-10.3,23.1-23.1V62.6C85.7,62.6,62.6,0,62.6,0z M62.6,76.9c0,2.6-2.1,4.7-4.7,4.7H23.1c-2.6,0-4.7-2.1,4.7-4.7V23.1c0-2.6,2.1-4.7,4.7-4.7h34.8V62.6C57.9,70.5,62.6,76.9,62.6,76.9z" />
        </svg>
        <div className="relative text-gray-900 w-5 h-5">
           <Wrench className="w-full h-full transform -rotate-45" />
        </div>
      </div>
      <span className="text-2xl font-bold text-white tracking-tighter">Brikole</span>
    </div>
  );

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="md:col-span-2">
            <div className="mb-4">
               <FooterLogo />
            </div>
            <p className="text-gray-400 max-w-md mx-auto md:mx-0">{t('sub_heading')}</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="font-semibold text-white mb-2">{t('footer_company')}</h3>
            <a href="#/contact" className="text-gray-400 hover:text-amber-400 transition-colors">{t('footer_contact')}</a>
            <a href="#/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">{t('footer_privacy_policy')}</a>
            <a href="#/guidelines" className="text-gray-400 hover:text-amber-400 transition-colors">{t('footer_usage_guidelines')}</a>
            <a href="#/sitemap" className="text-gray-400 hover:text-amber-400 transition-colors">Sitemap</a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Brikole. {t('all_rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;