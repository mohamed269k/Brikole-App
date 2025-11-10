
import React, { useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { Mail, Loader } from './icons';

interface ContactPageProps {
    t: (key: string) => string;
}

const ContactPage: React.FC<ContactPageProps> = ({ t }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        const { client: supabase } = getSupabase();
        if (!supabase) {
            setError("Service is currently unavailable.");
            setLoading(false);
            return;
        }

        try {
            const { error: insertError } = await supabase.from('contact_messages').insert({
                name,
                email,
                subject,
                message,
                status: 'new'
            });
            if (insertError) throw insertError;

            setSuccess(t('message_sent_success'));
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8 animate-fade-in">
                <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                `}</style>
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                        <Mail className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{t('contact_us_title')}</h1>
                        <p className="text-gray-400 mt-1">{t('contact_us_subtitle')}</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">{t('your_name')} *</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="input-style" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">{t('email_address')} *</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-style" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">{t('subject')}</label>
                        <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="input-style" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">{t('message')} *</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} className="input-style"></textarea>
                    </div>
                    
                    {error && <p className="text-center text-red-400 bg-red-400/10 p-3 rounded-lg">{error}</p>}
                    {success && <p className="text-center text-green-400 bg-green-400/10 p-3 rounded-lg">{success}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full mt-4 text-gray-900 bg-amber-400 hover:bg-amber-500 font-semibold rounded-lg text-md px-6 py-3 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-500">
                        {loading ? <Loader className="w-6 h-6" /> : t('send_message')}
                    </button>
                </form>
            </div>
            <style>{`
                .input-style {
                    display: block; width: 100%; padding: 0.75rem; font-size: 1rem; color: #f7fafc;
                    border: 1px solid #4a5568; border-radius: 0.5rem; background-color: #1a202c;
                    transition: border-color 0.2s;
                }
                .input-style:focus {
                    outline: none; --tw-ring-color: #fbbf24; box-shadow: 0 0 0 2px var(--tw-ring-color);
                    border-color: #fbbf24;
                }
            `}</style>
        </main>
    );
};

export default ContactPage;
