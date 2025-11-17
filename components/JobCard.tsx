
import React from 'react';
import { JobPost, Language } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import { MapPin, Briefcase } from './icons';

interface JobCardProps {
    job: JobPost;
    onSelect: (job: JobPost) => void;
    t: (key: string) => string;
    currentLang: Language;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSelect, t, currentLang }) => {
    const service = SERVICE_CATEGORIES.find(s => s.id === job.category_id);
    const categoryName = service ? service.name[currentLang] : job.category_id;

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    return (
        <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 hover:border-amber-400/50 transition-colors flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-white hover:text-amber-400 cursor-pointer" onClick={() => onSelect(job)}>
                    {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {categoryName}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location_city}</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Posted {timeAgo(job.created_at)}</p>
            </div>
            <div className="flex-shrink-0 text-right w-full sm:w-auto">
                <p className="text-xl font-bold text-amber-400">{job.budget} <span className="text-sm font-normal text-gray-400">MAD</span></p>
                <p className="text-xs text-gray-500 capitalize">{job.budget_type}</p>
                 <button onClick={() => onSelect(job)} className="mt-2 w-full sm:w-auto bg-amber-400/10 text-amber-400 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-amber-400/20 transition-colors">
                    {t('view_details_and_apply')}
                </button>
            </div>
        </div>
    );
};

export default JobCard;
