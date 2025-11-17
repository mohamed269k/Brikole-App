import React from 'react';
import { User, Session } from '@supabase/supabase-js';

export type { User, Session };

export type Language = 'en' | 'fr' | 'ar';

export interface TranslationSet {
  [key:string]: string;
}

export interface ServiceCategory {
  id: string;
  icon: React.ElementType;
  name: Record<Language, string>;
}

export interface Professional {
    id: number;
    name: string;
    serviceId: string;
    serviceCities: string[];
    address: string;
    rating: number;
    phone: string;
    lat: number;
    lng: number;
}

export interface ProviderRequest {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  company_name?: string;
  cities: string[];
  services: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_email: string;
}

export interface SupportTicket {
  id: string;
  created_at: string;
  user_id: string;
  user_email: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
}

export interface TicketReply {
  id: string;
  created_at: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin_reply: boolean;
  user_email?: string; 
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'archived';
}

export interface JobPost {
  id: string;
  created_at: string;
  client_id: string;
  title: string;
  description: string;
  category_id: string;
  budget: number;
  budget_type: 'fixed' | 'negotiable';
  location_city: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  awarded_to_provider_id?: string | null;
  client_email?: string;
}

export interface JobOffer {
    id: string;
    created_at: string;
    job_post_id: string;
    provider_id: string;
    offer_amount: number;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    provider_name?: string;
    provider_email?: string;
    provider_phone?: string;
}
