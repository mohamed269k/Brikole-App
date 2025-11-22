
import React, { useState, useEffect, useCallback } from 'react';
import { JobPost, JobOffer, Language } from '../types';
import { getSupabase } from '../lib/supabaseClient';
import { X, Loader, Check, User } from './icons';

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

        try {
            // 1. Fetch Offers
            const { data: offersData, error: offersError } = await supabase
                .from('job_offers')
                .select('*')
                .eq('job_post_id', job.id)
                .order('offer_amount', { ascending: true });
            
            if (offersError) throw offersError;

            if (!offersData || offersData.length === 0) {
                setOffers([]);
                setLoading(false);
                return;
            }

            // 2. Fetch Provider Details manually to avoid Foreign Key issues
            const providerIds = offersData.map((o: any) => o.provider_id);
            
            // We assume provider_requests table has user_id that matches provider_id
            const { data: providersData, error: providersError } = await supabase
                .from('provider_requests')
                .select('user_id, full_name, phone, user_email')
                .in('user_id', providerIds);

            if (providersError) {
                console.warn("Could not fetch provider details:", providersError.message);
            }

            // 3. Merge Data
            const formattedData = offersData.map((offer: any) => {
                const provider = providersData?.find((p: any) => p.user_id === offer.provider_id);
                return {
                    ...offer,
                    provider_name: provider?.full_name || 'Unknown Provider',
                    provider_phone: provider?.phone || 'N/A',
                    provider_email: provider?.user_email || 'N/A',
                };
            });

            setOffers(formattedData);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [job.id]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleAcceptOffer = async (offerId: string, providerId: string) => {
        if (!window.confirm(t('accept_offer') + '?')) return;
        
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

            // Update offer status
            const { error: offerError } = await supabase.from('job_offers')
                .update({ status: 'accepted' })
                .eq('id', offerId);

            if (offerError) throw offerError;

            // Ideally we should also reject other offers, but for simplicity we just accept one.
            
            await fetchOffers();
            // Optionally close modal after short delay or let user see the change
            setTimeout(onClose, 1000);
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl p-6 relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-1">{t('offers_received')}</h2>
                <p className="text-gray-400 text-sm mb-6">{job.title}</p>

                {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                {loading ? (
                    <div className="flex-grow flex justify-center items-center py-12">
                        <Loader className="w-8 h-8 text-amber-400" />
                    </div>
                ) : offers.length === 0 ? (
                    <div className="flex-grow flex justify-center items-center py-12 text-gray-500">
                        <p>{t('no_offers_yet')}</p>
                    </div>
                ) : (
                    <div className="space-y-4 overflow-y-auto flex-grow pr-2">
                        {offers.map(offer => (
                            <div key={offer.id} className={`p-4 rounded-lg border ${offer.status === 'accepted' ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-900/50 border-gray-700'} transition-colors`}>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-300" />
                                            </div>
                                            <span className="font-semibold text-white">{offer.provider_name}</span>
                                        </div>
                                        <p className="text-amber-400 font-bold text-xl mt-1">{offer.offer_amount} MAD</p>
                                        {offer.message && (
                                            <p className="text-gray-300 text-sm mt-2 italic">"{offer.message}"</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                        {offer.status === 'accepted' ? (
                                            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full text-sm font-medium">
                                                <Check className="w-4 h-4" />
                                                <span>{t('job_awarded')}</span>
                                            </div>
                                        ) : offer.status === 'rejected' ? (
                                            <span className="text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full text-sm font-medium">Rejected</span>
                                        ) : (
                                            job.status === 'open' && (
                                                <button 
                                                    onClick={() => handleAcceptOffer(offer.id, offer.provider_id)}
                                                    disabled={submitting}
                                                    className="flex items-center gap-2 bg-amber-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {submitting ? <Loader className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                    {t('accept_offer')}
                                                </button>
                                            )
                                        )}
                                        
                                        {offer.status === 'accepted' && (
                                            <div className="text-right mt-1">
                                                <p className="text-sm text-gray-400">Contact: {offer.provider_phone}</p>
                                                <p className="text-xs text-gray-500">{offer.provider_email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewOffersModal;
