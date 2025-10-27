import React from 'react';
import { CreditCard, Check } from './icons';

interface PricingPageProps {
  onPayClick: (plan: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onPayClick }) => {
  const plans = [
    {
      name: 'Starter Pro',
      price: '49',
      features: ['Standard Listing', 'Up to 5 Service Categories', 'Basic Profile', 'Email Support'],
      cta: 'Choose Starter',
    },
    {
      name: 'Business Pro',
      price: '149',
      features: ['Featured Listing', 'Unlimited Categories', 'Enhanced Profile with Photos', 'Priority Phone & Email Support'],
      cta: 'Choose Business',
      isFeatured: true,
    },
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
        <div className="inline-block p-3 mb-4 bg-amber-400/10 border border-amber-400/20 rounded-lg">
          <CreditCard className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Choose Your Plan</h1>
        <p className="text-lg text-gray-400 mb-2">Your profile is submitted and pending review.</p>
        <p className="text-lg text-gray-400 mb-10">Select a plan to activate your account upon approval.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map(plan => (
            <div key={plan.name} className={`relative bg-gray-800/50 border rounded-xl p-8 flex flex-col ${plan.isFeatured ? 'border-amber-400' : 'border-gray-700'}`}>
              {plan.isFeatured && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
                </div>
              )}
              <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
              <div className="my-6">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-lg text-gray-400"> MAD/month</span>
              </div>
              <ul className="space-y-3 text-left flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onPayClick(plan.name)}
                className={`w-full mt-8 font-semibold rounded-lg py-3 transition-colors ${plan.isFeatured ? 'bg-amber-400 text-gray-900 hover:bg-amber-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                Continue to Pay
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PricingPage;