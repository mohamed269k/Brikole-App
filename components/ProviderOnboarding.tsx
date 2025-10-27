import React, { useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { SERVICE_CATEGORIES } from '../constants';
import { UserPlus, Loader } from './icons';

const ProviderOnboarding: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CITIES = ['Casablanca', 'Rabat', 'Salé', 'Marrakech', 'Agadir', 'Tanger', 'Other'];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || selectedServices.length === 0 || selectedCities.length === 0) {
      setError("Please fill all required fields, and select at least one service and city.");
      return;
    }
    setLoading(true);
    setError(null);

    const { client: supabase } = getSupabase();
    if (!supabase || !user) {
      setError("Authentication error. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      // 1. Insert into the public provider_requests table for admin approval
      const { error: requestError } = await supabase.from('provider_requests').insert({
        user_id: user.id,
        user_email: user.email,
        full_name: fullName,
        phone,
        company_name: companyName,
        services: selectedServices,
        cities: selectedCities,
        status: 'pending',
      });

      if (requestError) throw requestError;

      // 2. Update user's private metadata to mark onboarding as submitted
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          profile_submitted: true,
        },
      });

      if (userError) throw userError;
      
      // 3. Redirect to pricing page
      window.location.hash = '/pricing';

    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8 animate-fade-in">
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
        <div className="flex items-center gap-4 mb-6 text-center flex-col">
          <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg">
            <UserPlus className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Provider Onboarding</h1>
            <p className="text-gray-400">Tell us about your business to get started.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
            <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="input-style" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="input-style" />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">Company Name (Optional)</label>
            <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="input-style" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Services You Offer *</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-900/50 rounded-lg max-h-48 overflow-y-auto">
              {SERVICE_CATEGORIES.map(service => (
                <label key={service.id} className="checkbox-label">
                  <input type="checkbox" checked={selectedServices.includes(service.id)} onChange={() => handleServiceToggle(service.id)} className="accent-amber-400" />
                  <span>{service.name['fr']}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Cities You Operate In *</p>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-900/50 rounded-lg max-h-48 overflow-y-auto">
              {CITIES.map(city => (
                <label key={city} className="checkbox-label">
                  <input type="checkbox" checked={selectedCities.includes(city)} onChange={() => handleCityToggle(city)} className="accent-amber-400" />
                  <span>{city}</span>
                </label>
              ))}
            </div>
          </div>
          
          {error && <p className="text-center text-red-400 bg-red-400/10 p-3 rounded-lg">{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full mt-6 text-gray-900 bg-amber-400 hover:bg-amber-500 font-semibold rounded-lg text-md px-6 py-3 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-500">
            {loading ? <Loader className="w-6 h-6" /> : 'Publish & Continue'}
          </button>
        </form>
      </div>
      <style>{`
        .input-style {
          display: block;
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          color: #f7fafc;
          border: 1px solid #4a5568;
          border-radius: 0.5rem;
          background-color: #1a202c;
          transition: border-color 0.2s;
        }
        .input-style:focus {
          outline: none;
          --tw-ring-color: #fbbf24;
           box-shadow: 0 0 0 2px var(--tw-ring-color);
          border-color: #fbbf24;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          background-color: #2d3748;
          transition: background-color 0.2s;
        }
        .checkbox-label:hover {
          background-color: #4a5568;
        }
         .checkbox-label input[type="checkbox"] {
           width: 1rem;
           height: 1rem;
         }
      `}</style>
    </main>
  );
};

export default ProviderOnboarding;