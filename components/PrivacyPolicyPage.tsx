import React from 'react';

interface StaticPageProps {
  t: (key: string) => string;
}

const PrivacyPolicyPage: React.FC<StaticPageProps> = ({ t }) => {
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
          <h1>{t('privacy_policy_title')}</h1>
          <p><strong>{t('last_updated')}</strong> {new Date().toLocaleDateString()}</p>

          <h2>{t('privacy_h2_intro')}</h2>
          <p>{t('privacy_p_intro')}</p>

          <h2>{t('privacy_h2_info_collect')}</h2>
          <p>{t('privacy_p_info_collect')}</p>
          <ul>
            <li><strong>{t('privacy_li_personal_data_title')}</strong> {t('privacy_li_personal_data_desc')}</li>
            <li><strong>{t('privacy_li_usage_data_title')}</strong> {t('privacy_li_usage_data_desc')}</li>
            <li><strong>{t('privacy_li_geolocation_title')}</strong> {t('privacy_li_geolocation_desc')}</li>
          </ul>

          <h2>{t('privacy_h2_how_we_use')}</h2>
          <p>{t('privacy_p_how_we_use')}</p>
          <ul>
            <li>{t('privacy_li_use_1')}</li>
            <li>{t('privacy_li_use_2')}</li>
            <li>{t('privacy_li_use_3')}</li>
            <li>{t('privacy_li_use_4')}</li>
            <li>{t('privacy_li_use_5')}</li>
            <li>{t('privacy_li_use_6')}</li>
            <li>{t('privacy_li_use_7')}</li>
          </ul>

          <h2>{t('privacy_h2_disclosure')}</h2>
          <p>{t('privacy_p_disclosure')}</p>
          <ul>
            <li><strong>{t('privacy_li_disclosure_1_title')}</strong> {t('privacy_li_disclosure_1_desc')}</li>
            <li><strong>{t('privacy_li_disclosure_2_title')}</strong> {t('privacy_li_disclosure_2_desc')}</li>
          </ul>
          
          <h2>{t('privacy_h2_security')}</h2>
          <p>{t('privacy_p_security')}</p>

          <h2>{t('privacy_h2_changes')}</h2>
          <p>{t('privacy_p_changes')}</p>

          <h2>{t('privacy_h2_contact')}</h2>
          <p>{t('privacy_p_contact')}</p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;