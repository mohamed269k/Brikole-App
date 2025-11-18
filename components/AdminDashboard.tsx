
import React, { useState, useEffect, useCallback } from 'react';
import { List, Loader, UserPlus, Ticket, ChevronLeft, Send, X, Mail, ArchiveBox, Briefcase, Trash } from './icons';
import { getSupabase } from '../lib/supabaseClient';
import { ProviderRequest, SupportTicket, TicketReply, ContactMessage, JobPost } from '../types';
import { useAuth } from '../contexts/AuthContext';

const StatusBadge: React.FC<{ status: SupportTicket['status'] | JobPost['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
    const statusMap: Record<string, string> = {
        open: "bg-green-500/20 text-green-300",
        in_progress: "bg-yellow-500/20 text-yellow-300",
        closed: "bg-gray-600/20 text-gray-400",
        completed: "bg-purple-500/20 text-purple-300",
        cancelled: "bg-gray-600/20 text-gray-400",
    };
    const classes = statusMap[status] || "bg-gray-600/20 text-gray-400";
    return <span className={`${baseClasses} ${classes}`}>{status.replace('_', ' ')}</span>;
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


const TicketDetailModal: React.FC<{ ticket: SupportTicket; onClose: () => void; onUpdate: () => void; t: (key: string) => string; }> = ({ ticket, onClose, onUpdate, t }) => {
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
            const { data, error: fetchError } = await supabase.from('ticket_replies').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
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
            const { error: insertError } = await supabase.from('ticket_replies').insert({ ticket_id: ticket.id, user_id: user.id, message: newReply, is_admin_reply: true });
            if (insertError) throw insertError;
            setNewReply('');
            fetchReplies();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleStatusChange = async (newStatus: SupportTicket['status']) => {
        const { client: supabase } = getSupabase();
        if (!supabase) return;
        try {
            const { error: updateError } = await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticket.id);
            if (updateError) throw updateError;
            onUpdate();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"><X /></button>
                <h2 className="text-xl font-bold mb-1">{ticket.subject}</h2>
                <p className="text-sm text-gray-400 mb-2">From: {ticket.user_email}</p>
                <div className="flex gap-2 mb-4">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg text-gray-300 mb-4 whitespace-pre-wrap">{ticket.description}</div>
                
                <h3 className="font-semibold mb-2">Replies</h3>
                {loading ? <div className="flex justify-center py-4"><Loader /></div> : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4">
                        {replies.map(reply => (
                            <div key={reply.id} className={`p-2 rounded-lg text-sm ${reply.is_admin_reply ? 'bg-gray-700' : 'bg-blue-900/30'}`}>
                                <p className="font-semibold text-xs mb-1">{reply.is_admin_reply ? 'Admin' : 'User'}</p>
                                <p className="text-gray-300 whitespace-pre-wrap">{reply.message}</p>
                            </div>
                        ))}
                    </div>
                )}
                
                <form onSubmit={handleReplySubmit} className="flex gap-2">
                    <input type="text" value={newReply} onChange={e => setNewReply(e.target.value)} placeholder="Type your reply..." className="input-style flex-grow" disabled={submitting || ticket.status === 'closed'} />
                    <button type="submit" disabled={submitting || !newReply.trim() || ticket.status === 'closed'} className="bg-amber-400 text-gray-900 p-3 rounded-lg hover:bg-amber-500 disabled:bg-gray-600">
                        {submitting ? <Loader className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
                
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end gap-2">
                    <select onChange={(e) => handleStatusChange(e.target.value as any)} value={ticket.status} className="input-style !w-auto !py-1">
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const ProviderRequestsView: React.FC = () => {
    const [requests, setRequests] = useState<ProviderRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) { setError("Supabase client not available."); setLoading(false); return; }

        try {
            const { data, error } = await supabase.from('provider_requests').select('*').eq('status', 'pending').order('created_at', { ascending: true });
            if (error) throw error;
            setRequests(data || []);
        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const handleUpdateRequest = async (id: string, status: 'approved' | 'rejected') => {
        const { client: supabase } = getSupabase();
        if (!supabase) return;
        try {
            const { error } = await supabase.from('provider_requests').update({ status }).eq('id', id);
            if (error) throw error;
            fetchRequests();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 text-amber-400" /></div>;
    if (error) return <div className="text-center text-red-400 py-12 bg-red-900/20 rounded-lg"><p>{error}</p></div>;
    if (requests.length === 0) return <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg"><p>No pending requests.</p></div>;

    return (
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
                        <button onClick={() => handleUpdateRequest(req.id, 'rejected')} className="px-4 py-2 text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors">Reject</button>
                        <button onClick={() => handleUpdateRequest(req.id, 'approved')} className="px-4 py-2 text-sm font-semibold text-gray-900 bg-green-500 hover:bg-green-600 rounded-md transition-colors">Approve</button>
                    </div>
                </div>
            ))}
        </div>
    );
};


const SupportTicketsView: React.FC<{ t: (key: string) => string; }> = ({ t }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | SupportTicket['status']>('all');

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) { setError("Supabase client not available."); setLoading(false); return; }

        try {
            let query = supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }
            const { data, error } = await query;
            if (error) throw error;
            setTickets(data || []);
        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    }, [statusFilter]);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);

    if (loading) return <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 text-amber-400" /></div>;
    if (error) return <div className="text-center text-red-400 py-12 bg-red-900/20 rounded-lg"><p>{error}</p></div>;
    
    return (
        <div>
            <div className="mb-4">
                <select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="input-style !w-auto">
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            {tickets.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg"><p>No support tickets found with the selected filter.</p></div>
            ) : (
                <div className="space-y-3">
                    {tickets.map(ticket => (
                        <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-amber-400">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <p className="font-semibold text-white">{ticket.subject}</p>
                                    <p className="text-sm text-amber-400">{ticket.user_email}</p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={ticket.status} />
                                    <p className="text-xs text-gray-500 mt-1">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedTicket && <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onUpdate={() => { setSelectedTicket(null); fetchTickets(); }} t={t} />}
        </div>
    );
};

const ContactMessagesView: React.FC<{ t: (key: string) => string; }> = ({ t }) => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'new' | 'archived'>('new');

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) { setError("Supabase client not available."); setLoading(false); return; }

        try {
            const { data, error } = await supabase.from('contact_messages').select('*').eq('status', filter).order('created_at', { ascending: false });
            if (error) throw error;
            setMessages(data || []);
        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    }, [filter]);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleArchive = async (id: string) => {
        const { client: supabase } = getSupabase();
        if (!supabase) return;
        try {
            const { error } = await supabase.from('contact_messages').update({ status: 'archived' }).eq('id', id);
            if (error) throw error;
            fetchMessages(); // Refresh the list
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 text-amber-400" /></div>;
    if (error) return <div className="text-center text-red-400 py-12 bg-red-900/20 rounded-lg"><p>{error}</p></div>;

    const noMessagesText = filter === 'new' ? t('no_new_messages') : t('no_archived_messages');

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <button onClick={() => setFilter('new')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'new' ? 'bg-amber-400/10 text-amber-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>{t('show_new')}</button>
                <button onClick={() => setFilter('archived')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'archived' ? 'bg-amber-400/10 text-amber-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>{t('show_archived')}</button>
            </div>
            {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg"><p>{noMessagesText}</p></div>
            ) : (
                <div className="space-y-3">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <p className="font-semibold text-white">{msg.name} <span className="font-normal text-amber-400 text-sm">&lt;{msg.email}&gt;</span></p>
                                    <p className="text-lg text-gray-200 mt-1">{msg.subject}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 mt-3 whitespace-pre-wrap border-t border-gray-700 pt-3">{msg.message}</p>
                            {filter === 'new' && (
                                <div className="text-right mt-3">
                                    <button onClick={() => handleArchive(msg.id)} className="flex items-center gap-2 ml-auto px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-600 rounded-md transition-colors">
                                        <ArchiveBox className="w-4 h-4" /> {t('archive')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const JobPostsView: React.FC = () => {
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { client: supabase } = getSupabase();
        if (!supabase) { setError("Supabase client not available."); setLoading(false); return; }

        try {
            const { data, error } = await supabase.from('job_posts').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setJobs(data || []);
        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const handleDeleteJob = async (jobId: string) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

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

    if (loading) return <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 text-amber-400" /></div>;
    if (error) return <div className="text-center text-red-400 py-12 bg-red-900/20 rounded-lg"><p>{error}</p></div>;
    if (jobs.length === 0) return <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg"><p>No job posts found.</p></div>;

    return (
        <div className="space-y-3">
            {jobs.map(job => (
                <div key={job.id} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <p className="font-bold text-white">{job.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <span>{job.location_city}</span>
                                <span>&bull;</span>
                                <span>{job.budget} MAD</span>
                                <span>&bull;</span>
                                <span>Client ID: {job.client_id.slice(0, 8)}...</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={job.status} />
                             <button 
                                onClick={() => handleDeleteJob(job.id)} 
                                disabled={deletingId === job.id}
                                className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
                            >
                                {deletingId === job.id ? <Loader className="w-3 h-3" /> : <Trash className="w-3 h-3" />} Delete
                            </button>
                        </div>
                    </div>
                     <p className="text-xs text-gray-500 mt-2">Posted: {new Date(job.created_at).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};


const AdminDashboard: React.FC<{ t: (key: string) => string; }> = ({ t }) => {
    const [activeView, setActiveView] = useState<'requests' | 'tickets' | 'messages' | 'jobs'>('requests');
    
    type ViewType = 'requests' | 'tickets' | 'messages' | 'jobs';

    const TabButton: React.FC<{ view: ViewType, icon: React.ElementType, label: string }> = ({ view, icon: Icon, label }) => (
        <button onClick={() => setActiveView(view)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeView === view ? 'bg-amber-400/10 text-amber-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>
            <Icon className="w-5 h-5" /> {label}
        </button>
    );

    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-6xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-6 md:p-8 animate-fade-in">
                <style>{`
                    .input-style { display: block; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #f7fafc; border: 1px solid #4a5568; border-radius: 0.5rem; background-color: #1a202c; }
                    .input-style:focus { outline: none; border-color: #fbbf24; }
                `}</style>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg self-start">
                        <List className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage provider requests, support tickets, and jobs.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 border-b border-gray-700 mb-6 overflow-x-auto pb-2">
                    <TabButton view="requests" icon={UserPlus} label="Provider Requests" />
                    <TabButton view="jobs" icon={Briefcase} label={t('manage_jobs')} />
                    <TabButton view="tickets" icon={Ticket} label="Support Tickets" />
                    <TabButton view="messages" icon={Mail} label={t('contact_messages')} />
                </div>
                
                {activeView === 'requests' && <ProviderRequestsView />}
                {activeView === 'jobs' && <JobPostsView />}
                {activeView === 'tickets' && <SupportTicketsView t={t} />}
                {activeView === 'messages' && <ContactMessagesView t={t} />}

            </div>
        </main>
    );
};

export default AdminDashboard;
