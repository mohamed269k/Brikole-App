import React from 'react';
import { X } from './icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
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
        
        <h2 className="text-2xl font-bold text-center text-white mb-4">Payment Information</h2>
        <p className="text-center text-gray-400 mb-6">Please complete the payment via bank transfer using the details below. Your account will be activated once payment is confirmed.</p>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-400">Bank Name</p>
            <p className="text-lg text-white">Attijariwafa Bank</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">Account Holder Name</p>
            <p className="text-lg text-white">BRIKOLE SERVICES SARL</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">RIB (Bank Account Number)</p>
            <p className="text-lg font-mono text-amber-400 tracking-wider">007 780 0001234500000678 90</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">Reference / Reason for Transfer</p>
            <p className="text-lg text-white">Your Signup Email Address</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
            Note: This is example information. Please ensure you use the correct details provided in a real-world scenario.
            Account approval may take up to 24 hours after payment is received.
        </p>

        <div className="mt-8 text-center">
           <button 
             onClick={onClose}
             className="bg-amber-400 text-gray-900 font-semibold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors duration-300"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;