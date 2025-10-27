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