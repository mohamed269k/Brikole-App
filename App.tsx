
import React, { useState, useEffect, useMemo } from 'react';
import { Language, Professional } from './types';
import { TRANSLATIONS, SERVICE_CATEGORIES, PROFESSIONALS } from './constants';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ServiceGrid from './components/ServiceGrid';
import Footer from './components/Footer';
import FeaturedPros from './components/FeaturedPros';
import CityFilter from './components/CityFilter';
import MapSection from './components/MapSection';
import AuthPage from './components/AuthPage';
import ProfileModal from './components/ProfileModal';
import OnboardingModal from './components/OnboardingModal';
import AdminDashboard from './components/AdminDashboard';
import ProviderOnboarding from './components/ProviderOnboarding';
import PricingPage from './components/PricingPage';
import PaymentModal from './components/PaymentModal';
import { getSupabase } from './lib/supabaseClient';
import ProProfileModal from './components/ProProfileModal';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import UsageGuidelinesPage from './components/UsageGuidelinesPage';
import SupportPage from './components/SupportPage';
import ContactPage from './components/ContactPage';
import JobPostPage from './components/JobPostPage';
import JobBoardPage from './components/JobBoardPage';
import MyActivityPage from './components/MyActivityPage';
import { UserPlus } from './components/icons';

const MainContent: React.FC<{
  language: Language;
  t: (key: string) => string;
  onViewProfile: (pro: Professional) => void;
}> = ({ language, t, onViewProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [professionals, setProfessionals] = useState<Professional[]>(PROFESSIONALS);
  
  useEffect(() => {
    const fetchProfessionals = async () => {
        const { client: supabase } = getSupabase();
        if (!supabase) return;

        const { data, error } = await supabase.from('professionals').select('*');

        if (error) {
            console.error("Error fetching professionals from DB:", error.message);
        } else if (data) {
            const fetchedPros: Professional[] = data.map(item => ({
                id: item.id,
                name: item.name,
                serviceId: item.service_id,
                serviceCities: item.service_cities,
                address: item.address,
                rating: item.rating,
                phone: item.phone,
                lat: item.lat,
                lng: item.lng,
            }));
            
            // Per user request, filter out a specific professional that may be in the database.
            const filteredFetchedPros = fetchedPros.filter(pro => 
                !(pro.name.toLowerCase() === 'mohamed amine' && pro.phone === '0685953242' && pro.serviceId === 'assembly')
            );

            // Use a Set to ensure unique professionals based on ID
            const combined = [...PROFESSIONALS, ...filteredFetchedPros];
            const uniquePros = Array.from(new Map(combined.map(p => [p.id, p])).values());
            setProfessionals(uniquePros);
        }
    };

    fetchProfessionals();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);

      const lowercasedQuery = searchQuery.toLowerCase().trim();
      if (lowercasedQuery.length > 2) {
        const matchedCategory = SERVICE_CATEGORIES.find(cat =>
          Object.values(cat.name).some((name: string) => name.toLowerCase().includes(lowercasedQuery))
        );

        if (matchedCategory) {
          setSelectedCategory(matchedCategory.id);
        }
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const cities = ['All', 'Casablanca', 'Rabat', 'Salé', 'Marrakech', 'Agadir', 'Tanger'];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const professionalsForMap = useMemo(() => {
    if (!selectedCategory) return [];
    return professionals.filter(pro => pro.serviceId === selectedCategory);
  }, [selectedCategory, professionals]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-amber-400" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {t('main_heading')}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          {t('sub_heading')}
        </p>
        <SearchBar t={t} query={searchQuery} onSearchChange={setSearchQuery} />
      </div>
      
      <div className="mt-8 flex justify-center">
        <CityFilter cities={cities} selectedCity={selectedCity} onCityChange={setSelectedCity} t={t} />
      </div>

      <div className="mt-10 mb-8 text-center">
        <div className="inline-block bg-gray-800/80 border border-gray-700 rounded-xl p-6 max-w-2xl w-full backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-2">{t('cant_find_pro')}</h3>
            <p className="text-gray-400 mb-4">{t('post_job_subtext')}</p>
            <a 
                href="#/post-job" 
                className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-amber-500 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20"
            >
                <UserPlus className="w-5 h-5" />
                <span>{t('post_a_job_cta')}</span>
            </a>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('our_services')}</h2>
        <ServiceGrid currentLang={language} onSelectCategory={handleCategorySelect} selectedCategory={selectedCategory} />
      </div>

      <MapSection t={t} currentLang={language} professionals={professionalsForMap} selectedCategory={selectedCategory} />

      <FeaturedPros 
        t={t} 
        currentLang={language} 
        professionals={professionals} 
        selectedCategory={selectedCategory} 
        selectedCity={selectedCity} 
        searchQuery={debouncedSearchQuery}
        onViewProfile={onViewProfile} 
      />
    </main>
  );
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [route, setRoute] = useState(window.location.hash || '#/');

  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useEffect(() => {
    if (user && (route === '#/login' || route === '#/signup')) {
      window.location.hash = '/';
      return;
    }

    if (!user) {
        if (route === '#/post-job') {
           window.location.hash = '/login';
           return;
        }
        if (['#/admin', '#/provider-onboarding', '#/pricing', '#/support', '#/jobs', '#/my-activity'].includes(route)) {
            window.location.hash = '/';
        }
        return;
    }

    const isAdmin = user.email === 'dropshop2345instant@gmail.com';
    const isProvider = user.user_metadata?.role === 'provider';
    const isClient = user.user_metadata?.role === 'client';
    const profileSubmitted = user.user_metadata?.profile_submitted;

    if (isAdmin) {
        if (route !== '#/admin') window.location.hash = '/admin';
    } else if (isProvider) {
        if (!profileSubmitted && route !== '#/provider-onboarding') {
            window.location.hash = '/provider-onboarding';
        } else if (profileSubmitted && route === '#/provider-onboarding') {
            window.location.hash = '/pricing';
        }
        if (route === '#/post-job') window.location.hash = '/';
    } else if (isClient) {
        const hasOnboarded = !!user.user_metadata?.full_name;
        if (!hasOnboarded) {
          const timer = setTimeout(() => setShowOnboardingModal(true), 500);
          return () => clearTimeout(timer);
        }
        if (['#/provider-onboarding', '#/pricing', '#/admin', '#/jobs'].includes(route)) {
            window.location.hash = '/';
        }
    }
    
    if (!isAdmin && route === '#/admin') {
        window.location.hash = '/';
    }
  }, [user, route]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  const t = (key: string) => TRANSLATIONS[language][key] || key;
  
  const handleViewProfile = (pro: Professional) => setSelectedPro(pro);
  const handleCloseProProfile = () => setSelectedPro(null);

  const renderContent = () => {
    const isAdminUser = user?.email === 'dropshop2345instant@gmail.com';
    const isProvider = user?.user_metadata?.role === 'provider';
    const isClient = user?.user_metadata?.role === 'client';

    if (route === '#/login') return <AuthPage t={t} initialMode="login" />;
    if (route === '#/signup') return <AuthPage t={t} initialMode="signup" />;
    if (route === '#/admin' && isAdminUser) return <AdminDashboard t={t} />;
    if (route === '#/support' && user) return <SupportPage t={t} />;
    if (route === '#/provider-onboarding' && isProvider) return <ProviderOnboarding />;
    if (route === '#/pricing' && isProvider) return <PricingPage onPayClick={() => setShowPaymentModal(true)} t={t} />;
    if (route === '#/privacy') return <PrivacyPolicyPage t={t} />;
    if (route === '#/guidelines') return <UsageGuidelinesPage t={t} />;
    if (route === '#/contact') return <ContactPage t={t} />;
    if (route === '#/post-job' && isClient) return <JobPostPage t={t} />;
    if (route === '#/jobs' && isProvider) return <JobBoardPage t={t} currentLang={language} />;
    if (route === '#/my-activity' && user) return <MyActivityPage t={t} currentLang={language} />;
    
    return <MainContent language={language} t={t} onViewProfile={handleViewProfile} />;
  };

  return (
    <>
      <div className="bg-[#1a1a1a] text-gray-100 min-h-screen flex flex-col">
        <Header 
          currentLang={language} 
          setLang={setLanguage} 
          t={t} 
          onProfileClick={() => setShowProfileModal(true)}
        />
        
        {renderContent()}
        
        <Footer t={t} />
      </div>
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <OnboardingModal 
        isOpen={showOnboardingModal} 
        onClose={() => setShowOnboardingModal(false)}
        onSuccess={() => setShowOnboardingModal(false)}
      />
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} t={t} />
      <ProProfileModal
        isOpen={!!selectedPro}
        onClose={handleCloseProProfile}
        professional={selectedPro}
      />
    </>
  );
};

export default App;