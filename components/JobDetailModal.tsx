
import React, { useState } from 'react';
import { JobPost, Language } from '../types';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { X, Loader, Send } from './icons';
import { SERVICE_CATEGORIES } from '../constants';

interface JobDetailModalProps {
    job: JobPost;
    onClose: () => void;
    t: (key: string) => string;
    currentLang: Language;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, t, currentLang }) => {
    const { user } = useAuth();
    const [offerAmount, setOfferAmount] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const service = SERVICE_CATEGORIES.find(s => s.id === job.category_id);
    const categoryName = service ? service.name[currentLang] : job.category_id;

    const handleSubmitOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!offerAmount || !user) {
            setError("Offer amount is required.");
            return;
        }
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        try {
            const { error: insertError } = await supabase.from('job_offers').insert({
                job_post_id: job.id,
                provider_id: user.id,
                offer_amount: parseFloat(offerAmount),
                message,
                status: 'pending'
            });

            if (insertError) throw insertError;
            setSuccess(t('offer_submitted'));
            setTimeout(onClose, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><X /></button>
                <div className="max-h-[80vh] overflow-y-auto pr-2">
                    <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span>{categoryName}</span>
                        <span>&bull;</span>
                        <span>{job.location_city}</span>
                    </div>
                    
                    <p className="text-gray-300 whitespace-pre-wrap bg-gray-900/50 p-3 rounded-lg">{job.description}</p>
                    
                    <div className="mt-4">
                        <span className="font-semibold text-gray-400">{t('budget')}: </span>
                        <span className="font-bold text-amber-400 text-lg">{job.budget} MAD ({t(job.budget_type === 'fixed' ? 'fixed_price' : 'negotiable')})</span>
                    </div>

                    <div className="border-t border-gray-700 my-6"></div>

                    <h3 className="text-xl font-bold mb-4">{t('make_an_offer')}</h3>
                    {success ? (
                         <p className="text-center text-green-400 bg-green-400/10 p-3 rounded-lg">{success}</p>
                    ) : (
                        <form onSubmit={handleSubmitOffer} className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="offerAmount" className="block text-sm font-medium text-gray-300 mb-1">{t('your_offer')} *</label>
                                    <input type="number" id="offerAmount" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} required className="input-style" placeholder="e.g., 500" />
                                </div>
                             </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">{t('optional_message')}</label>
                                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={3} className="input-style" placeholder="Introduce yourself, ask questions..."></textarea>
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <button type="submit" disabled={submitting} className="w-full bg-amber-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors disabled:bg-gray-600 flex items-center justify-center">
                                {submitting ? <Loader className="w-5 h-5" /> : <><Send className="w-5 h-5 mr-2" /> {t('submit_offer')}</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>{`.input-style { display: block; width: 100%; padding: 0.75rem; color: #f7fafc; border: 1px solid #4a5568; border-radius: 0.5rem; background-color: #1a202c; }`}</style>
        </div>
    );
};

export default JobDetailModal;
