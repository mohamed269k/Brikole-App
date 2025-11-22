
import React, { useState, useEffect, useCallback } from 'react';
import { JobPost, Language } from '../types';
import { getSupabase } from '../lib/supabaseClient';
import { Loader, List, UserPlus } from './icons';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import { SERVICE_CATEGORIES } from '../constants';

interface JobBoardPageProps {
    t: (key: string) => string;
    currentLang: Language;
}

const JobBoardPage: React.FC<JobBoardPageProps> = ({ t, currentLang }) => {
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');

    const cities = ['all', 'Casablanca', 'Rabat', 'Salé', 'Marrakech', 'Agadir', 'Tanger'];

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) {
            setError("Service unavailable.");
            setLoading(false);
            return;
        }

        try {
            let query = supabase.from('job_posts').select('*').eq('status', 'open').order('created_at', { ascending: false });
            
            if (categoryFilter !== 'all') {
                query = query.eq('category_id', categoryFilter);
            }
            if (cityFilter !== 'all') {
                query = query.eq('location_city', cityFilter);
            }

            const { data, error: fetchError } = await query;
            if (fetchError) throw fetchError;
            setJobs(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [categoryFilter, cityFilter]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);
    
    const handleJobSelect = (job: JobPost) => {
        setSelectedJob(job);
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-center md:text-left">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg hidden md:block">
                            <List className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{t('job_board')}</h1>
                            <p className="text-gray-400">{t('open_jobs_near_you')}</p>
                        </div>
                    </div>
                    <a 
                        href="#/post-job" 
                        className="flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors shadow-lg shadow-amber-500/20"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>{t('post_a_job_cta')}</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-style">
                        <option value="all">All Categories</option>
                        {SERVICE_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name[currentLang]}</option>)}
                    </select>
                    <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="input-style">
                        {cities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8" /></div>
                ) : error ? (
                    <div className="text-center text-red-400 py-12 bg-red-900/20 rounded-lg"><p>{error}</p></div>
                ) : jobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg"><p>{t('no_open_jobs')}</p></div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} onSelect={handleJobSelect} t={t} currentLang={currentLang} />
                        ))}
                    </div>
                )}
            </div>
            
            {selectedJob && (
                <JobDetailModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)}
                    t={t}
                    currentLang={currentLang}
                />
            )}

             <style>{`.input-style { display: block; width: 100%; padding: 0.75rem; color: #f7fafc; border: 1px solid #4a5568; border-radius: 0.5rem; background-color: #1a202c; }`}</style>
        </main>
    );
};

export default JobBoardPage;
