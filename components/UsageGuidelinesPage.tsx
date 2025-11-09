import React from 'react';

interface StaticPageProps {
  t: (key: string) => string;
}

const UsageGuidelinesPage: React.FC<StaticPageProps> = ({ t }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-gray-300">
      <div className="max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8 animate-fade-in">
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
          .prose-styles h1 { font-size: 2.25rem; font-weight: bold; color: #FBBF24; margin-bottom: 1.5rem; }
          .prose-styles h2 { font-size: 1.5rem; font-weight: bold; color: white; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid #4A5568; padding-bottom: 0.5rem; }
          .prose-styles p { margin-bottom: 1rem; line-height: 1.7; }
          .prose-styles ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
          .prose-styles li { margin-bottom: 0.5rem; }
        `}</style>
        <div className="prose-styles">
          <h1>{t('guidelines_title')}</h1>
          <p><strong>{t('effective_date')}</strong> {new Date().toLocaleDateString()}</p>
          
          <h2>{t('guidelines_h2_intro')}</h2>
          <p>{t('guidelines_p_intro')}</p>
          
          <h2>{t('guidelines_h2_for_clients')}</h2>
          <ul>
            <li><strong>{t('guidelines_li_client_1_title')}</strong> {t('guidelines_li_client_1_desc')}</li>
            <li><strong>{t('guidelines_li_client_2_title')}</strong> {t('guidelines_li_client_2_desc')}</li>
            <li><strong>{t('guidelines_li_client_3_title')}</strong> {t('guidelines_li_client_3_desc')}</li>
            <li><strong>{t('guidelines_li_client_4_title')}</strong> {t('guidelines_li_client_4_desc')}</li>
          </ul>

          <h2>{t('guidelines_h2_for_providers')}</h2>
          <ul>
            <li><strong>{t('guidelines_li_provider_1_title')}</strong> {t('guidelines_li_provider_1_desc')}</li>
            <li><strong>{t('guidelines_li_provider_2_title')}</strong> {t('guidelines_li_provider_2_desc')}</li>
            <li><strong>{t('guidelines_li_provider_3_title')}</strong> {t('guidelines_li_provider_3_desc')}</li>
            <li><strong>{t('guidelines_li_provider_4_title')}</strong> {t('guidelines_li_provider_4_desc')}</li>
            <li><strong>{t('guidelines_li_provider_5_title')}</strong> {t('guidelines_li_provider_5_desc')}</li>
          </ul>
          
          <h2>{t('guidelines_h2_prohibited')}</h2>
          <p>{t('guidelines_p_prohibited')}</p>
          <ul>
            <li>{t('guidelines_li_prohibited_1')}</li>
            <li>{t('guidelines_li_prohibited_2')}</li>
            <li>{t('guidelines_li_prohibited_3')}</li>
            <li>{t('guidelines_li_prohibited_4')}</li>
            <li>{t('guidelines_li_prohibited_5')}</li>
          </ul>

          <h2>{t('guidelines_h2_enforcement')}</h2>
          <p>{t('guidelines_p_enforcement')}</p>
        </div>
      </div>
    </main>
  );
};

export default UsageGuidelinesPage;