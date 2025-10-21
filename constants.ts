import { ServiceCategory, Language, TranslationSet, Professional } from './types';
import { Wrench, PlugZap, PaintRoller, Droplets, Hammer, Sofa } from './components/icons';

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'plumbing',
    icon: Droplets,
    name: {
      en: 'Plumbing',
      fr: 'Plomberie',
      ar: 'السباكة',
    },
  },
  {
    id: 'electrical',
    icon: PlugZap,
    name: {
      en: 'Electrical',
      fr: 'Électricité',
      ar: 'الكهرباء',
    },
  },
  {
    id: 'painting',
    icon: PaintRoller,
    name: {
      en: 'Painting',
      fr: 'Peinture',
      ar: 'الدهان',
    },
  },
  {
    id: 'carpentry',
    icon: Hammer,
    name: {
      en: 'Carpentry',
      fr: 'Menuiserie',
      ar: 'النجارة',
    },
  },
   {
    id: 'general_repair',
    icon: Wrench,
    name: {
      en: 'General Repair',
      fr: 'Réparation Générale',
      ar: 'إصلاحات عامة',
    },
  },
  {
    id: 'assembly',
    icon: Sofa,
    name: {
      en: 'Furniture Assembly',
      fr: 'Montage de Meubles',
      ar: 'تركيب الأثاث',
    },
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 1,
    name: 'Youssef El-Amrani',
    serviceId: 'plumbing',
    location: 'Casablanca',
    rating: 4.8,
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    name: 'Fatima Zahra',
    serviceId: 'electrical',
    location: 'Rabat',
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?img=34',
  },
  {
    id: 3,
    name: 'Ahmed Bouzid',
    serviceId: 'painting',
    location: 'Marrakech',
    rating: 4.7,
    image: 'https://i.pravatar.cc/150?img=68',
  },
  {
    id: 4,
    name: 'Khadija Mansouri',
    serviceId: 'carpentry',
    location: 'Fes',
    rating: 4.6,
    image: 'https://i.pravatar.cc/150?img=40',
  },
  {
    id: 5,
    name: 'Mehdi Bennani',
    serviceId: 'general_repair',
    location: 'Tangier',
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?img=56',
  },
  {
    id: 6,
    name: 'Salma Alami',
    serviceId: 'assembly',
    location: 'Agadir',
    rating: 4.7,
    image: 'https://i.pravatar.cc/150?img=49',
  },
  {
    id: 7,
    name: 'Omar Chraibi',
    serviceId: 'plumbing',
    location: 'Rabat',
    rating: 4.5,
    image: 'https://i.pravatar.cc/150?img=60',
  },
  {
    id: 8,
    name: 'Leila Fassi',
    serviceId: 'electrical',
    location: 'Casablanca',
    rating: 4.8,
    image: 'https://i.pravatar.cc/150?img=25',
  },
];

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    main_heading: 'Find reliable help, instantly.',
    sub_heading: 'Your trusted partner for all home services in Morocco. Fast, professional, and at your service.',
    search_placeholder: 'What service do you need?',
    search_button: 'Search',
    our_services: 'Our Services',
    login_signup: 'Login / Sign Up',
    footer_about: 'About Us',
    footer_contact: 'Contact',
    footer_terms: 'Terms of Service',
    footer_privacy: 'Privacy Policy',
    all_rights_reserved: 'All rights reserved.',
    find_a_pro: 'Meet Our Top Professionals',
    view_profile: 'View Profile',
    no_pros_found: 'No professionals found for this category yet.',
  },
  fr: {
    main_heading: 'Trouvez une aide fiable, instantanément.',
    sub_heading: 'Votre partenaire de confiance pour tous les services à domicile au Maroc. Rapide, professionnel et à votre service.',
    search_placeholder: 'De quel service avez-vous besoin ?',
    search_button: 'Rechercher',
    our_services: 'Nos Services',
    login_signup: 'Connexion / Inscription',
    footer_about: 'À propos de nous',
    footer_contact: 'Contact',
    footer_terms: 'Conditions d\'utilisation',
    footer_privacy: 'Politique de confidentialité',
    all_rights_reserved: 'Tous droits réservés.',
    find_a_pro: 'Découvrez Nos Meilleurs Professionnels',
    view_profile: 'Voir le Profil',
    no_pros_found: 'Aucun professionnel trouvé pour cette catégorie pour le moment.',
  },
  ar: {
    main_heading: 'اعثر على مساعدة موثوقة، على الفور.',
    sub_heading: 'شريكك الموثوق لجميع الخدمات المنزلية في المغرب. سريع، محترف، وفي خدمتك.',
    search_placeholder: 'ما هي الخدمة التي تحتاجها؟',
    search_button: 'بحث',
    our_services: 'خدماتنا',
    login_signup: 'تسجيل الدخول / اشتراك',
    footer_about: 'من نحن',
    footer_contact: 'اتصل بنا',
    footer_terms: 'شروط الخدمة',
    footer_privacy: 'سياسة الخصوصية',
    all_rights_reserved: 'كل الحقوق محفوظة.',
    find_a_pro: 'تعرف على أفضل المتخصصين لدينا',
    view_profile: 'عرض الملف الشخصي',
    no_pros_found: 'لم يتم العثور على متخصصين لهذه الفئة بعد.',
  },
};