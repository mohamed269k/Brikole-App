import React from 'react';

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
    location: string;
    rating: number;
    image: string;
}