
import React, { useState, useEffect, useMemo } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Language, Professional } from './types';
import { TRANSLATIONS, SERVICE_CATEGORIES, PROFESSIONALS, CITIES } from './constants';
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
import SEOHead from './components/SEOHead';
import { UserPlus } from './components/icons';

const MainContent: React.FC<{
  language: Language;
  t: (key: string) => string;
  onViewProfile: (pro: Professional) => void;
  routeCategory?: string;
  routeCity?: string;
}> = ({ language, t, onViewProfile, routeCategory, routeCity }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(routeCategory || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>(routeCity || 'All');
  const [professionals, setProfessionals] = useState<Professional[]>(PROFESSIONALS);

  // Sync state with props when route changes
  useEffect(() => {
    setSelectedCategory(routeCategory || null);
    setSelectedCity(routeCity || 'All');
  }, [routeCategory, routeCity]);
  
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
          // Note: We aren't pushing to URL here to avoid jumping around while typing,
          // but we could if we wanted strictly URL-driven state.
          setSelectedCategory(matchedCategory.id);
        }
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);


  const updateRoute = (category: string | null, city: string) => {
     const catPath = category || 'all';
     if (catPath === 'all' && city === 'All') {
         window.location.hash = '/';
     } else {
         window.location.hash = `/services/${catPath}/${city}`;
     }
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    updateRoute(newCategory, selectedCity);
  };

  const handleCityChange = (newCity: string) => {
    updateRoute(selectedCategory, newCity);
  }

  const professionalsForMap = useMemo(() => {
    if (!selectedCategory) return [];
    return professionals.filter(pro => pro.serviceId === selectedCategory);
  }, [selectedCategory, professionals]);

  // Dynamic SEO Title Generator
  const getPageTitle = () => {
    if (selectedCategory && selectedCity && selectedCity !== 'All') {
      const categoryName = SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name[language];
      const format = t('seo_title_format'); // e.g., "{service} in {city} | Brikole"
      return format.replace('{service}', categoryName || '').replace('{city}', selectedCity);
    } 
    if (selectedCategory) {
      return `${SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name[language]} | Brikole`;
    }
    return `Brikole - ${t('main_heading')}`;
  };
  
  const getPageDescription = () => {
      if (selectedCategory && selectedCity && selectedCity !== 'All') {
          const categoryName = SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name[language];
          const format = t('seo_desc_format'); 
          return format.replace('{service}', categoryName || '').replace('{city}', selectedCity);
      }
      return t('sub_heading');
  };

  const pageTitle = getPageTitle();
  const pageDesc = getPageDescription();

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
      <SEOHead 
        title={pageTitle}
        description={pageDesc}
        language={language}
        path={window.location.hash.replace('#', '')}
      />
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
        <CityFilter cities={CITIES} selectedCity={selectedCity} onCityChange={handleCityChange} t={t} />
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

      {/* Popular Searches / Internal Linking for SEO */}
      <section className="mt-20 border-t border-gray-800 pt-10">
          <h3 className="text-xl font-bold text-gray-300 mb-6 text-center">{t('popular_searches')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              {SERVICE_CATEGORIES.map(cat => (
                  CITIES.filter(c => c !== 'All').map(city => (
                      <a 
                        key={`${cat.id}-${city}`} 
                        href={`#/services/${cat.id}/${city}`}
                        className="text-gray-500 hover:text-amber-400 transition-colors"
                      >
                          {cat.name[language]} {t('in')} {city}
                      </a>
                  ))
              ))}
          </div>
      </section>
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
    const profileSubmitted = user.user_metadata?.profile_submitted;

    if (isAdmin) {
        if (route !== '#/admin' && route !== '#/post-job' && route !== '#/my-activity' && route !== '#/support') {
             if (route === '#/') window.location.hash = '/admin';
        }
    } else if (isProvider) {
        if (!profileSubmitted && route !== '#/provider-onboarding') {
            window.location.hash = '/provider-onboarding';
        } else if (profileSubmitted && route === '#/provider-onboarding') {
            window.location.hash = '/pricing';
        }
    } else {
        const hasOnboarded = !!user.user_metadata?.full_name;
        if (!hasOnboarded) {
          const timer = setTimeout(() => setShowOnboardingModal(true), 500);
          return () => clearTimeout(timer);
        }
        if (['#/provider-onboarding', '#/pricing', '#/admin', '#/jobs'].includes(route)) {
            window.location.hash = '/';
        }
    }
  }, [user, route]);

  const t = (key: string) => TRANSLATIONS[language][key] || key;
  
  const handleViewProfile = (pro: Professional) => setSelectedPro(pro);
  const handleCloseProProfile = () => setSelectedPro(null);

  const renderContent = () => {
    const isAdminUser = user?.email === 'dropshop2345instant@gmail.com';
    const isProvider = user?.user_metadata?.role === 'provider';

    // Route Matching Logic
    
    // 1. Services/SEO Route: #/services/:category/:city
    const servicesMatch = route.match(/^#\/services\/([^/]+)\/([^/]+)$/);
    if (servicesMatch) {
        const categoryId = servicesMatch[1] === 'all' ? undefined : servicesMatch[1];
        const city = servicesMatch[2];
        return <MainContent language={language} t={t} onViewProfile={handleViewProfile} routeCategory={categoryId} routeCity={city} />;
    }

    if (route === '#/login') return (
      <>
        <SEOHead title={`Login | Brikole`} language={language} path="/login" />
        <AuthPage t={t} initialMode="login" />
      </>
    );
    if (route === '#/signup') return (
      <>
        <SEOHead title={`Sign Up | Brikole`} language={language} path="/signup" />
        <AuthPage t={t} initialMode="signup" />
      </>
    );
    if (route === '#/admin' && isAdminUser) return (
      <>
        <SEOHead title="Admin Dashboard | Brikole" language={language} path="/admin" />
        <AdminDashboard t={t} />
      </>
    );
    if (route === '#/support' && user) return (
      <>
        <SEOHead title={`${t('support')} | Brikole`} language={language} path="/support" />
        <SupportPage t={t} />
      </>
    );
    if (route === '#/provider-onboarding' && isProvider) return (
      <>
        <SEOHead title="Provider Onboarding | Brikole" language={language} path="/provider-onboarding" />
        <ProviderOnboarding />
      </>
    );
    if (route === '#/pricing' && isProvider) return (
      <>
        <SEOHead title="Pricing | Brikole" language={language} path="/pricing" />
        <PricingPage onPayClick={() => setShowPaymentModal(true)} t={t} />
      </>
    );
    if (route === '#/privacy') return (
      <>
        <SEOHead title={`${t('privacy_policy_title')} | Brikole`} language={language} path="/privacy" />
        <PrivacyPolicyPage t={t} />
      </>
    );
    if (route === '#/guidelines') return (
      <>
        <SEOHead title={`${t('guidelines_title')} | Brikole`} language={language} path="/guidelines" />
        <UsageGuidelinesPage t={t} />
      </>
    );
    if (route === '#/contact') return (
      <>
        <SEOHead title={`${t('contact_us_title')} | Brikole`} language={language} path="/contact" />
        <ContactPage t={t} />
      </>
    );
    if (route === '#/post-job' && user) return (
      <>
        <SEOHead title={`${t('post_a_job')} | Brikole`} language={language} path="/post-job" />
        <JobPostPage t={t} />
      </>
    );
    if (route === '#/jobs' && isProvider) return (
      <>
        <SEOHead title={`${t('job_board')} | Brikole`} language={language} path="/jobs" />
        <JobBoardPage t={t} currentLang={language} />
      </>
    );
    if (route === '#/my-activity' && user) return (
      <>
        <SEOHead title={`${t('my_activity')} | Brikole`} language={language} path="/my-activity" />
        <MyActivityPage t={t} currentLang={language} />
      </>
    );
    
    // Default Home
    return <MainContent language={language} t={t} onViewProfile={handleViewProfile} />;
  };

  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
};

export default App;
