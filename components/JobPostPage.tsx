
import React, { useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { SERVICE_CATEGORIES } from '../constants';
import { Loader, UserPlus } from './icons';

interface JobPostPageProps {
    t: (key: string) => string;
}

const JobPostPage: React.FC<JobPostPageProps> = ({ t }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [city, setCity] = useState('');
    const [budget, setBudget] = useState('');
    const [budgetType, setBudgetType] = useState<'fixed' | 'negotiable'>('fixed');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const CITIES = ['Casablanca', 'Rabat', 'Salé', 'Marrakech', 'Agadir', 'Tanger'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !categoryId || !city || !budget) {
            setError("Please fill all required fields.");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { client: supabase } = getSupabase();
        if (!supabase || !user) {
            setError("Authentication error. Please sign in again.");
            setLoading(false);
            return;
        }

        try {
            // Explicitly defining the object to avoid any chance of including 'client_email'
            const jobPostData = {
                client_id: user.id,
                title,
                description,
                category_id: categoryId,
                location_city: city,
                budget: parseFloat(budget),
                budget_type: budgetType,
                status: 'open',
            };

            const { error: insertError } = await supabase.from('job_posts').insert(jobPostData);
            
            if (insertError) throw insertError;

            setSuccess(t('job_posted_successfully'));
            setTimeout(() => {
                window.location.hash = '/my-activity';
            }, 1500);

        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                        <UserPlus className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{t('create_job_request')}</h1>
                        <p className="text-gray-400">Describe your needs to find the right professional.</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="jobTitle" className="label-style">{t('job_title')} *</label>
                        <input type="text" id="jobTitle" value={title} onChange={e => setTitle(e.target.value)} required className="input-style" />
                    </div>
                    <div>
                        <label htmlFor="description" className="label-style">{t('job_description')} *</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="input-style"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="label-style">{t('category')} *</label>
                            <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="input-style">
                                <option value="" disabled>Select a category</option>
                                {SERVICE_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name['fr']}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="city" className="label-style">{t('city')} *</label>
                            <select id="city" value={city} onChange={e => setCity(e.target.value)} required className="input-style">
                                <option value="" disabled>Select a city</option>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="budget" className="label-style">{t('budget')} *</label>
                            <input type="number" id="budget" value={budget} onChange={e => setBudget(e.target.value)} required className="input-style" />
                        </div>
                        <div>
                            <label htmlFor="budgetType" className="label-style">{t('budget_type')} *</label>
                            <select id="budgetType" value={budgetType} onChange={e => setBudgetType(e.target.value as any)} required className="input-style">
                                <option value="fixed">{t('fixed_price')}</option>
                                <option value="negotiable">{t('negotiable')}</option>
                            </select>
                        </div>
                    </div>
                    
                    {error && <p className="text-center text-red-400 bg-red-400/10 p-3 rounded-lg">{error}</p>}
                    {success && <p className="text-center text-green-400 bg-green-400/10 p-3 rounded-lg">{success}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full mt-4 text-gray-900 bg-amber-400 hover:bg-amber-500 font-semibold rounded-lg text-md px-6 py-3 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-500">
                        {loading ? <Loader className="w-6 h-6" /> : t('submit_job_post')}
                    </button>
                </form>
            </div>
            <style>{`
                .input-style { display: block; width: 100%; padding: 0.75rem; color: #f7fafc; border: 1px solid #4a5568; border-radius: 0.5rem; background-color: #1a202c; }
                .input-style:focus { outline: none; border-color: #fbbf24; }
                .label-style { display: block; text-align: left; font-size: 0.875rem; font-medium; color: #d1d5db; margin-bottom: 0.25rem; }
            `}</style>
        </main>
    );
};

export default JobPostPage;
