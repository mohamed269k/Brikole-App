
import React from 'react';
import { X } from './icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl shadow-black/30 w-full max-w-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-center text-white mb-4">{t('payment_title')}</h2>
        <p className="text-center text-gray-400 mb-6">{t('payment_subtitle')}</p>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-400">{t('payment_holder_name_label')}</p>
            <p className="text-lg text-white">{t('payment_holder_name_value')}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">{t('payment_rib_label')}</p>
            <p className="text-lg font-mono text-amber-400 tracking-wider">857 780 0000000000585442 28</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">{t('payment_reference_label')}</p>
            <p className="text-lg text-white">{t('payment_reference_value')}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
            {t('payment_confirmation_note')}
        </p>

        <div className="mt-8 text-center">
           <button 
             onClick={onClose}
             className="bg-amber-400 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors duration-300"
           >
             {t('payment_done_button')}
           </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
