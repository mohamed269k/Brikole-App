
import React, { useState, useEffect, useCallback } from 'react';
import { JobPost, JobOffer, Language } from '../types';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { X, Loader } from './icons';

interface ViewOffersModalProps {
    job: JobPost;
    onClose: () => void;
    t: (key: string) => string;
    currentLang: Language;
}

const ViewOffersModal: React.FC<ViewOffersModalProps> = ({ job, onClose, t, currentLang }) => {
    const [offers, setOffers] = useState<(JobOffer & { provider_name: string, provider_phone: string, provider_email: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        const { data, error: fetchError } = await supabase.from('job_offers').select('*, provider_requests(full_name, phone, user_email)').eq('job_post_id', job.id);
        
        if (fetchError) {
            setError(fetchError.message);
        } else {
            const formattedData = data.map((o: any) => ({
                ...o,
                provider_name: o.provider_requests.full_name,
                provider_phone: o.provider_requests.phone,
                provider_email: o.provider_requests.user_email,
            }));
            setOffers(formattedData);
        }
        setLoading(false);
    }, [job.id]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleAcceptOffer = async (offerId: string, providerId: string) => {
        setSubmitting(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        try {
            // Update job post status
            const { error: jobError } = await supabase.from('job_posts')
                .update({ status: 'in_progress', awarded_to_provider_id: providerId })
                .eq('id', job.id);
            if (jobError) throw jobError;
            
            // Update accepted offer
            const { error: acceptError } = await supabase.from('job_offers')
                .update({ status: 'accepted' })
                .eq('id', offerId);
            if (acceptError) throw acceptError;

            // Reject other offers
            const { error: rejectError } = await supabase.from('job_offers')
                .update({ status: 'rejected' })
                .eq('job_post_id', job.id)
                .neq('id', offerId);
            if (rejectError) throw rejectError;

            fetchOffers(); // Refresh the view
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };
    
    const awardedProvider = offers.find(o => o.status === 'accepted');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><X /></button>
                <div className="max-h-[80vh] overflow-y-auto pr-2">
                    <h2 className="text-2xl font-bold text-white mb-2">{t('offers_received')} for "{job.title}"</h2>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader /></div>
                    ) : error ? (
                        <p className="text-red-400 p-4 text-center">{error}</p>
                    ) : awardedProvider ? (
                         <div className="mt-4 text-center text-green-300 bg-green-500/10 p-4 rounded-lg">
                            <h3 className="text-lg font-bold">{t('job_awarded')}!</h3>
                            <p>You have accepted the offer from {awardedProvider.provider_name}.</p>
                            <p className="mt-2">{t('contact_provider_at').replace('{phone}', awardedProvider.provider_phone)}</p>
                        </div>
                    ) : offers.length === 0 ? (
                        <p className="text-center text-gray-500 p-8">{t('no_offers_yet')}</p>
                    ) : (
                        <div className="space-y-4 mt-4">
                            {offers.map(offer => (
                                <div key={offer.id} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-white">{offer.provider_name}</p>
                                            <p className="text-sm text-gray-400">{offer.provider_email}</p>
                                        </div>
                                        <p className="text-lg font-bold text-amber-400">{offer.offer_amount} MAD</p>
                                    </div>
                                    {offer.message && <p className="text-sm text-gray-300 mt-2 pt-2 border-t border-gray-700/50">{offer.message}</p>}
                                    <div className="text-right mt-3">
                                        <button 
                                            onClick={() => handleAcceptOffer(offer.id, offer.provider_id)}
                                            disabled={submitting}
                                            className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-green-600 disabled:bg-gray-600"
                                        >
                                            {t('accept_offer')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewOffersModal;
