import React, { useState, useEffect, useCallback } from 'react';
import { List, Loader } from './icons';
import { getSupabase } from '../lib/supabaseClient';
import { ProviderRequest } from '../types';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { client: supabase } = getSupabase();
    if (!supabase) {
      setError("Supabase client not available.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('provider_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateRequest = async (id: string, status: 'approved' | 'rejected') => {
    const { client: supabase } = getSupabase();
    if (!supabase) return;

    const requestToProcess = requests.find(req => req.id === id);
    if (!requestToProcess) {
        setError("Could not find the request to process.");
        return;
    }
    
    // Optimistically update UI
    const originalRequests = [...requests];
    setRequests(requests.filter(req => req.id !== id));

    try {
        if (status === 'approved') {
            const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
                'Casablanca': { lat: 33.57, lng: -7.59 },
                'Rabat': { lat: 34.02, lng: -6.84 },
                'Salé': { lat: 34.03, lng: -6.83 },
                'Marrakech': { lat: 31.63, lng: -7.98 },
                'Agadir': { lat: 30.42, lng: -9.60 },
                'Tanger': { lat: 35.76, lng: -5.83 },
                'Other': { lat: 31.79, lng: -7.09 } // Default to Morocco center
            };

            const firstCity = requestToProcess.cities[0] || 'Other';
            const coords = cityCoordinates[firstCity] || cityCoordinates['Other'];

            const professionalsToInsert = requestToProcess.services.map(serviceId => ({
                name: requestToProcess.full_name,
                service_id: serviceId.toLowerCase().replace(/ /g, '_'),
                service_cities: requestToProcess.cities,
                address: requestToProcess.company_name || firstCity,
                rating: 4.5,
                phone: requestToProcess.phone,
                lat: coords.lat,
                lng: coords.lng
            }));

            const { error: insertError } = await supabase.from('professionals').insert(professionalsToInsert);

            if (insertError) {
                throw new Error(`Failed to add new professional: ${insertError.message}`);
            }
        }

        const { error: updateError } = await supabase
            .from('provider_requests')
            .update({ status })
            .eq('id', id);

        if (updateError) {
            throw new Error(`Failed to update request status: ${updateError.message}`);
        }
    } catch (err: any) {
        setError(err.message);
        setRequests(originalRequests); // Revert on any error
    }
  };


  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8 animate-fade-in">
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg">
            <List className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage service provider requests and site content.</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Pending Provider Requests ({requests.length})</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 text-amber-400" /></div>
          ) : error ? (
            <div className="text-center text-red-400 py-12 bg-red-900/20 rounded-lg"><p>{error}</p></div>
          ) : requests.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg">
              <p>No pending requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Applicant</p>
                      <p className="font-semibold text-white">{req.full_name}</p>
                      <p className="text-sm text-amber-400">{req.user_email}</p>
                    </div>
                    <div>
                       <p className="text-sm text-gray-400">Details</p>
                       <p className="text-sm text-white"><strong>Phone:</strong> {req.phone}</p>
                       <p className="text-sm text-white"><strong>Company:</strong> {req.company_name || 'N/A'}</p>
                    </div>
                     <div>
                       <p className="text-sm text-gray-400">Applied On</p>
                       <p className="text-sm text-white">{new Date(req.created_at).toLocaleString()}</p>
                    </div>
                     <div className="md:col-span-3">
                       <p className="text-sm text-gray-400 mb-1">Services</p>
                       <div className="flex flex-wrap gap-2">
                          {req.services.map(s => <span key={s} className="bg-gray-700 text-xs font-medium text-gray-200 px-2 py-1 rounded-full">{s}</span>)}
                       </div>
                    </div>
                     <div className="md:col-span-3">
                       <p className="text-sm text-gray-400 mb-1">Cities</p>
                       <div className="flex flex-wrap gap-2">
                          {req.cities.map(c => <span key={c} className="bg-gray-700 text-xs font-medium text-gray-200 px-2 py-1 rounded-full">{c}</span>)}
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4 border-t border-gray-700 pt-3">
                     <button 
                       onClick={() => handleUpdateRequest(req.id, 'rejected')}
                       className="px-4 py-2 text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
                     >
                       Reject
                     </button>
                     <button 
                       onClick={() => handleUpdateRequest(req.id, 'approved')}
                       className="px-4 py-2 text-sm font-semibold text-gray-900 bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                     >
                       Approve
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;