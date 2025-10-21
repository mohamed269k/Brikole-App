
import React from 'react';
import { Wrench } from './icons';

interface FooterProps {
  t: (key: string) => string;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
               <div className="relative w-8 h-8 flex items-center justify-center bg-amber-400 rounded-md">
                   <Wrench className="w-5 h-5 text-gray-900" />
               </div>
               <span className="text-2xl font-bold text-white">Brikole</span>
            </div>
            <p className="text-gray-400">{t('sub_heading').substring(0, 80)}...</p>
          </div>
          <div>
            {/* Can add more links here if needed */}
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="font-semibold text-white mb-2">{t('footer_contact')}</h3>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">{t('footer_about')}</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">{t('footer_terms')}</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">{t('footer_privacy')}</a>
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
