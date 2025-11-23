
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Language } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  language: Language;
  path?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title = 'Brikole - Expert Home Services in Morocco', 
  description = 'Find trusted professionals for plumbing, electrical, painting, and carpentry in Morocco. The #1 platform for home services in Casablanca, Rabat, Marrakech, and beyond.', 
  language,
  path = '' 
}) => {
  const baseUrl = 'https://brikole.ma'; // Replace with actual domain if different
  const fullUrl = `${baseUrl}${path}`;
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Structured Data for Local Business/Service Platform
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Brikole",
    "description": description,
    "url": baseUrl,
    "areaServed": {
      "@type": "Country",
      "name": "Morocco"
    },
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MA",
      "addressLocality": "Casablanca"
    },
    "sameAs": [
      "https://facebook.com/brikole",
      "https://instagram.com/brikole",
      "https://twitter.com/brikole"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} dir={dir} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={language === 'ar' ? 'ar_MA' : language === 'fr' ? 'fr_MA' : 'en_US'} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
