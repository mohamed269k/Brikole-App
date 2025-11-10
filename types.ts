import React from 'react';
import { User, Session } from '@supabase/supabase-js';

export type { User, Session };

export type Language = 'en' | 'fr' | 'ar';

export interface TranslationSet {
  [key: string]: string;
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
