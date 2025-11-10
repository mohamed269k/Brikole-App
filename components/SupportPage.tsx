import React, { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { SupportTicket, TicketReply } from '../types';
import { Loader, Send, ChevronLeft, Ticket } from './icons';

const StatusBadge: React.FC<{ status: SupportTicket['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const statusMap = {
        open: { text: "Open", classes: "bg-green-500/20 text-green-300" },
        in_progress: { text: "In Progress", classes: "bg-yellow-500/20 text-yellow-300" },
        closed: { text: "Closed", classes: "bg-gray-600/20 text-gray-400" },
    };
    const { text, classes } = statusMap[status] || statusMap.closed;
    return <span className={`${baseClasses} ${classes}`}>{text}</span>;
};

const PriorityBadge: React.FC<{ priority: SupportTicket['priority'] }> = ({ priority }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const priorityMap = {
        low: { text: "Low", classes: "bg-blue-500/20 text-blue-300" },
        medium: { text: "Medium", classes: "bg-orange-500/20 text-orange-300" },
        high: { text: "High", classes: "bg-red-500/20 text-red-300" },
    };
    const { text, classes } = priorityMap[priority] || priorityMap.low;
    return <span className={`${baseClasses} ${classes}`}>{text}</span>;
};

const CreateTicketForm: React.FC<{ onTicketCreated: () => void; onCancel: () => void; t: (key: string) => string; }> = ({ onTicketCreated, onCancel, t }) => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim() || !user) {
            setError("Subject and message are required.");
            return;
        }
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) {
            setError("Service unavailable.");
            setLoading(false);
            return;
        }

        try {
            const { error: insertError } = await supabase.from('support_tickets').insert({
                user_id: user.id,
                user_email: user.email,
                subject,
                description,
                priority,
                status: 'open',
            });
            if (insertError) throw insertError;
            onTicketCreated();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onCancel} className="flex items-center gap-2 text-sm text-amber-400 hover:underline mb-4">
                <ChevronLeft className="w-4 h-4" /> {t('back_to_tickets')}
            </button>
            <h2 className="text-2xl font-bold mb-4">{t('create_new_ticket')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">{t('subject')}</label>
                    <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="input-style" />
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">{t('priority')}</label>
                    <select id="priority" value={priority} onChange={e => setPriority(e.target.value as any)} className="input-style">
                        <option value="low">{t('low')}</option>
                        <option value="medium">{t('medium')}</option>
                        <option value="high">{t('high')}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">{t('message')}</label>
                    <textarea id="message" value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="input-style"></textarea>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-amber-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors disabled:bg-gray-600 flex items-center justify-center">
                    {loading ? <Loader className="w-5 h-5" /> : t('submit_ticket')}
                </button>
            </form>
        </div>
    );
};

const TicketDetailView: React.FC<{ ticket: SupportTicket; onBack: () => void; t: (key: string) => string; }> = ({ ticket, onBack, t }) => {
    const { user } = useAuth();
    const [replies, setReplies] = useState<TicketReply[]>([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReplies = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        try {
            const { data, error: fetchError } = await supabase
                .from('ticket_replies')
                .select('*')
                .eq('ticket_id', ticket.id)
                .order('created_at', { ascending: true });
            if (fetchError) throw fetchError;
            setReplies(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [ticket.id]);

    useEffect(() => {
        fetchReplies();
    }, [fetchReplies]);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply.trim() || !user) return;
        setSubmitting(true);
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        try {
            const { error: insertError } = await supabase.from('ticket_replies').insert({
                ticket_id: ticket.id,
                user_id: user.id,
                message: newReply,
                is_admin_reply: false,
            });
            if (insertError) throw insertError;
            setNewReply('');
            fetchReplies(); // Refresh replies
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-amber-400 hover:underline mb-4">
                <ChevronLeft className="w-4 h-4" /> {t('back_to_tickets')}
            </button>
            <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold mb-2">{ticket.subject}</h2>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>
                <p className="text-gray-400 text-sm">Opened on {new Date(ticket.created_at).toLocaleString()}</p>
                <p className="mt-4 text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{t('replies')}</h3>
            {loading ? <div className="flex justify-center py-4"><Loader /></div> : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {replies.map(reply => (
                        <div key={reply.id} className={`p-3 rounded-lg ${reply.is_admin_reply ? 'bg-gray-700' : 'bg-blue-900/30'}`}>
                            <p className="font-semibold text-sm mb-1">{reply.is_admin_reply ? 'Admin Support' : 'You'}</p>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{reply.message}</p>
                            <p className="text-right text-xs text-gray-500 mt-2">{new Date(reply.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleReplySubmit} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                    placeholder={t('add_reply')}
                    className="input-style flex-grow"
                    disabled={submitting || ticket.status === 'closed'}
                />
                <button type="submit" disabled={submitting || !newReply.trim() || ticket.status === 'closed'} className="bg-amber-400 text-gray-900 p-3 rounded-lg hover:bg-amber-500 disabled:bg-gray-600">
                    {submitting ? <Loader className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

const SupportPage: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const { user } = useAuth();
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        try {
            const { data, error: fetchError } = await supabase
                .from('support_tickets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setTickets(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (view === 'list') {
            fetchTickets();
        }
    }, [view, fetchTickets]);

    const handleViewTicket = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setView('detail');
    };

    const renderContent = () => {
        if (loading) return <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 text-amber-400" /></div>;
        if (error) return <div className="text-center text-red-400 py-12 bg-red-900/20 rounded-lg"><p>{error}</p></div>;

        switch (view) {
            case 'create':
                return <CreateTicketForm onCancel={() => setView('list')} onTicketCreated={() => setView('list')} t={t} />;
            case 'detail':
                return selectedTicket && <TicketDetailView ticket={selectedTicket} onBack={() => setView('list')} t={t} />;
            case 'list':
            default:
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{t('my_tickets')}</h2>
                            <button onClick={() => setView('create')} className="bg-amber-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors">
                                {t('create_new_ticket')}
                            </button>
                        </div>
                        {tickets.length === 0 ? (
                            <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg">
                                <p>{t('no_tickets_found')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map(ticket => (
                                    <div key={ticket.id} onClick={() => handleViewTicket(ticket)} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-amber-400 transition-colors">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="font-semibold text-white">{ticket.subject}</p>
                                                <p className="text-sm text-gray-400">#{ticket.id.slice(0, 8)}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 text-right">
                                                <StatusBadge status={ticket.status} />
                                                <PriorityBadge priority={ticket.priority} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-4xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8 animate-fade-in">
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
                        <Ticket className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{t('support')}</h1>
                        <p className="text-gray-400">Manage your support requests and get help.</p>
                    </div>
                </div>
                 <div className="border-t border-gray-700 pt-6">
                    {renderContent()}
                </div>
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

export default SupportPage;