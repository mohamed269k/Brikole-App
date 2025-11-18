
import React, { useState, useEffect, useCallback } from 'react';
import { JobPost, JobOffer, Language } from '../types';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Briefcase, FileText, Trash } from './icons';
import ViewOffersModal from './ViewOffersModal';
import { SERVICE_CATEGORIES } from '../constants';

interface MyActivityPageProps {
    t: (key: string) => string;
    currentLang: Language;
}

const JobStatusBadge: React.FC<{ status: JobPost['status'] }> = ({ status }) => {
    const base = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
    const styles = {
        open: "bg-green-500/20 text-green-300",
        in_progress: "bg-blue-500/20 text-blue-300",
        completed: "bg-purple-500/20 text-purple-300",
        cancelled: "bg-gray-600/20 text-gray-400",
    };
    return <span className={`${base} ${styles[status]}`}>{status.replace('_', ' ')}</span>;
};

const OfferStatusBadge: React.FC<{ status: JobOffer['status'] }> = ({ status }) => {
    const base = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
    const styles = {
        pending: "bg-yellow-500/20 text-yellow-300",
        accepted: "bg-green-500/20 text-green-300",
        rejected: "bg-red-500/20 text-red-300",
    };
    return <span className={`${base} ${styles[status]}`}>{status}</span>;
};


const MyJobsView: React.FC<{ t: (key: string) => string, currentLang: Language }> = ({ t, currentLang }) => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchJobs = useCallback(async () => {
        if (!user) return;
        const { client: supabase } = getSupabase();
        if (!supabase) return;
        setLoading(true);
        const { data } = await supabase.from('job_posts').select('*').eq('client_id', user.id).order('created_at', { ascending: false });
        setJobs(data || []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleDeleteJob = async (jobId: string) => {
        if (!window.confirm(t('confirm_delete_job'))) return;

        setDeletingId(jobId);
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        const { error } = await supabase.from('job_posts').delete().eq('id', jobId);

        if (error) {
            alert('Error deleting job: ' + error.message);
        } else {
            fetchJobs();
        }
        setDeletingId(null);
    };

    if (loading) return <div className="flex justify-center p-8"><Loader /></div>;
    if (jobs.length === 0) return <p className="text-center text-gray-500 p-8">{t('no_open_jobs')}</p>;

    return (
        <div className="space-y-4">
            {jobs.map(job => (
                <div key={job.id} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 relative">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <p className="font-bold text-white">{job.title}</p>
                            <p className="text-sm text-gray-400">{job.location_city}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <JobStatusBadge status={job.status} />
                             <button 
                                onClick={() => handleDeleteJob(job.id)} 
                                disabled={deletingId === job.id}
                                className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-md hover:bg-red-400/10"
                                title={t('delete_job')}
                            >
                                {deletingId === job.id ? <Loader className="w-4 h-4" /> : <Trash className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                        <button onClick={() => setSelectedJob(job)} className="text-sm font-semibold text-amber-400 hover:underline">{t('view_offers')}</button>
                    </div>
                </div>
            ))}
            {selectedJob && <ViewOffersModal job={selectedJob} onClose={() => setSelectedJob(null)} t={t} currentLang={currentLang} />}
        </div>
    );
};

const MyOffersView: React.FC<{ t: (key: string) => string, currentLang: Language }> = ({ t, currentLang }) => {
    const { user } = useAuth();
    const [offers, setOffers] = useState<(JobOffer & { job_posts: JobPost | null })[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchOffers = async () => {
            if (!user) return;
            const { client: supabase } = getSupabase();
            if (!supabase) return;
            setLoading(true);

            // 1. Fetch offers
            const { data: offersData, error: offersError } = await supabase
                .from('job_offers')
                .select('*')
                .eq('provider_id', user.id)
                .order('created_at', { ascending: false });

            if (offersError) {
                console.error(offersError);
                setLoading(false);
                return;
            }

            if (!offersData || offersData.length === 0) {
                setOffers([]);
                setLoading(false);
                return;
            }

            // 2. Fetch related jobs manually
            const jobIds = offersData.map((o: any) => o.job_post_id);
            const { data: jobsData } = await supabase
                .from('job_posts')
                .select('*')
                .in('id', jobIds);

            // 3. Merge
            const mergedData = offersData.map((offer: any) => ({
                ...offer,
                job_posts: jobsData?.find((job: any) => job.id === offer.job_post_id) || null
            }));

            setOffers(mergedData);
            setLoading(false);
        };
        fetchOffers();
    }, [user]);

    if (loading) return <div className="flex justify-center p-8"><Loader /></div>;
    if (offers.length === 0) return <p className="text-center text-gray-500 p-8">{t('no_offers_yet')}</p>;

    return (
        <div className="space-y-4">
            {offers.map(offer => {
                const job = offer.job_posts;
                if (!job) return null; // Should not happen ideally
                
                return (
                    <div key={offer.id} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-start gap-4">
                           <div>
                                <p className="font-semibold text-white">Your offer for: <span className="font-bold">{job.title}</span></p>
                                <p className="text-lg font-bold text-amber-400">{offer.offer_amount} MAD</p>
                           </div>
                           <OfferStatusBadge status={offer.status} />
                        </div>
                        {offer.status === 'accepted' && (
                            <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-green-300 bg-green-500/10 p-3 rounded-lg">
                                <p className="font-bold">Offer Accepted!</p>
                                <p>{t('contact_provider_at').replace('{phone}', job.client_email || 'N/A')}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const MyActivityPage: React.FC<MyActivityPageProps> = ({ t, currentLang }) => {
    const { user } = useAuth();
    const isClient = user?.user_metadata?.role === 'client';
    
    // If role is not yet defined (e.g. legacy user), default to client view but allow switching if needed logic existed.
    // For now, strict role check.
    const [activeTab, setActiveTab] = useState(isClient ? 'jobs' : 'offers');

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{t('my_activity')}</h1>
                        <p className="text-gray-400">Track your jobs and offers.</p>
                    </div>
                </div>

                <div className="flex gap-2 border-b border-gray-700 mb-6">
                    {isClient ? (
                        <button className="tab-button active"><Briefcase className="w-5 h-5"/>{t('my_jobs')}</button>
                    ) : (
                        <button className="tab-button active"><FileText className="w-5 h-5"/>{t('my_offers')}</button>
                    )}
                </div>

                {isClient ? <MyJobsView t={t} currentLang={currentLang} /> : <MyOffersView t={t} currentLang={currentLang} />}
            </div>
            <style>{`
                .tab-button { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.5rem 0.5rem 0 0; color: #9ca3af; }
                .tab-button.active { color: #fbbf24; background-color: #1f2937; border-bottom: 2px solid #fbbf24;}
                .tab-button:hover:not(.active) { color: #d1d5db; background-color: #374151; }
            `}</style>
        </main>
    );
};

export default MyActivityPage;
