import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'uz';

// Create the context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Create context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Sample translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'home': 'Home',
    'products': 'Products',
    'services': 'Services',
    'branches': 'Branches',
    'about_us': 'About Us',
    'contact': 'Contact',
    'search': 'Search',
    'cart': 'Cart',
    'login': 'Login',
    'profile': 'Profile',
    
    // Buttons
    'explore_our_services': 'Explore Our Services',
    'contact_us': 'Contact Us',
    'continue_shopping': 'Continue Shopping',
    'clear_cart': 'Clear Cart',
    'proceed_to_checkout': 'Proceed to Checkout',
    
    // Product-related
    'ecu_control_units': 'ECU Control Units',
    'rail_injectors': 'Rail Injectors',
    'gas_reducers': 'Gas Reducers',
    'all_products': 'All Products',
    'product_page_description': 'Explore our selection of high-quality {category} designed for optimal performance and reliability.',
    'search_products_placeholder': 'Search products...',
    'sort_by': 'Sort By',
    'price_low_to_high': 'Price: Low to High',
    'price_high_to_low': 'Price: High to Low',
    'name_a_to_z': 'Name: A to Z',
    'name_z_to_a': 'Name: Z to A',
    'filters': 'Filters',
    'price_range': 'Price Range',
    'no_products_found': 'No products found',
    'try_different_search': 'Try adjusting your search or filter criteria',
    'updating_products': 'Updating products...',
    
    // Service page
    'our_services': 'Our Services',
    'service_description': 'EuropeGAS & Rail Group Uzbekistan offers comprehensive solutions for gas equipment and rail systems, from installation to maintenance and optimization.',
    'core_services': 'Core Services',
    'core_services_description': 'We provide a comprehensive range of specialized services to meet all your gas equipment and rail system needs.',
    'equipment_installation': 'Equipment Installation',
    'equipment_installation_desc': 'Professional installation of gas equipment and rail systems with precision and care.',
    'maintenance_repair': 'Maintenance & Repair',
    'maintenance_repair_desc': 'Comprehensive maintenance and repair services to keep your systems running optimally.',
    'consultation_services': 'Consultation Services',
    'consultation_services_desc': 'Expert advice and planning for your gas and rail system needs.',
    'system_optimization': 'System Optimization',
    'system_optimization_desc': 'Enhance performance and efficiency of your existing systems.',
    'additional_services': 'Additional Services',
    'performance_testing': 'Performance Testing',
    'performance_testing_desc': 'Comprehensive testing to ensure your systems meet the highest performance standards.',
    'delivery_logistics': 'Delivery & Logistics',
    'delivery_logistics_desc': 'Reliable delivery services for all equipment and parts throughout Uzbekistan.',
    'equipment_testing': 'Equipment Testing',
    'equipment_testing_desc': 'Thorough testing services to ensure all equipment meets safety and performance standards.',
    'training_programs': 'Training Programs',
    'training_programs_desc': 'Comprehensive training for operators and maintenance personnel on proper equipment usage and care.',
    'our_service_process': 'Our Service Process',
    'consultation': 'Consultation',
    'consultation_desc': 'We discuss your needs and requirements in detail',
    'assessment': 'Assessment',
    'assessment_desc': 'Our experts evaluate your specific situation',
    'implementation': 'Implementation',
    'implementation_desc': 'We perform the required service or installation',
    'follow_up': 'Follow-up',
    'follow_up_desc': 'We ensure your complete satisfaction',
    'ready_to_get_started': 'Ready to Get Started?',
    'cta_description': 'Contact us today to discuss how we can help with your gas equipment and rail solution needs.',
    
    // Service details
    'gas_conversion_systems': 'Gas conversion systems',
    'fuel_management_systems': 'Fuel management systems',
    'rail_equipment_setup': 'Rail equipment setup',
    'preventive_maintenance': 'Preventive maintenance',
    'emergency_repairs': 'Emergency repairs',
    'system_diagnostics': 'System diagnostics',
    'system_design': 'System design',
    'efficiency_analysis': 'Efficiency analysis',
    'regulatory_compliance': 'Regulatory compliance',
    'performance_tuning': 'Performance tuning',
    'efficiency_upgrades': 'Efficiency upgrades',
    'system_integration': 'System integration',
    
    // HomePage
    'home_hero_alt': 'Automotive Gas Equipment',
    'home_hero_title': 'Premium Automotive Gas Equipment',
    'home_hero_subtitle': 'Engineered for excellence. Designed for performance.',
    'explore_products': 'Explore Products',
    'learn_more': 'Learn More',
    'innovation_section_title': 'Innovation at its finest',
    'innovation_section_description': 'With over 15 years of experience, we\'ve perfected the art of automotive gas equipment, delivering unparalleled quality and performance.',
    'feature_1_title': 'Quality Guarantee',
    'feature_1_description': 'All our products come with a warranty and quality assurance for your peace of mind.',
    'feature_2_title': 'Expert Installation',
    'feature_2_description': 'Our certified technicians ensure proper installation for optimal performance.',
    'feature_3_title': '12 Regional Branches',
    'feature_3_description': 'With branches across Uzbekistan, we\'re always close to our customers.',
    'feature_4_title': '100,000+ Customers',
    'feature_4_description': 'Join our large family of satisfied customers who trust our products and services.',
    
    // Footer
    'company': 'Company',
    'quick_links': 'Quick Links',
    'newsletter': 'Newsletter',
    'copyright': 'Copyright © 2024 EuropeGAS & Rail Group Uzbekistan. All rights reserved.',
    
    // Language
    'language': 'Language',
    'english': 'English',
    'uzbek': 'Uzbek',

    // About Page
    about_page_title: 'About Us',
    about_hero_alt: 'EuropeGAS Headquarters',
    about_hero_description: 'EuropeGAS & Rail Group Uzbekistan — Pioneering automotive gas solutions since 2005.',
    our_mission: 'Our Mission',
    mission_description: 'We provide sustainable and efficient energy solutions that meet the evolving needs of our clients while maintaining the highest standards of quality, safety, and environmental responsibility.',
    innovation: 'Innovation',
    innovation_description: 'We continuously push the boundaries of what\'s possible in automotive gas technology, developing solutions that are more efficient, reliable, and user-friendly.',
    customer_focus: 'Customer Focus',
    customer_focus_description: 'Every product we design and service we provide is centered around our customers\' needs, ensuring they receive the best possible experience and value.',
    our_journey: 'Our Journey',
    journey_description: 'From our humble beginnings to becoming a leader in automotive gas solutions in Central Asia.',
    foundation: 'Foundation',
    foundation_description: 'EuropeGAS & Rail Group was established in Tashkent, Uzbekistan, with a vision to provide high-quality automotive gas solutions.',
    expansion: 'Expansion',
    expansion_description: 'We expanded our operations to multiple regions across Uzbekistan and established partnerships with European manufacturers.',
    today: 'Today',
    today_description: 'Now with 12 branches across the country and over 100,000 satisfied customers, we continue to lead the market with innovative solutions.',
    our_values: 'Our Values',
    values_description: 'The principles that guide everything we do.',
    integrity: 'Integrity',
    integrity_description: 'We conduct our business with the highest ethical standards, ensuring transparency and trust in all our relationships.',
    teamwork: 'Teamwork',
    teamwork_description: 'We believe in the power of collaboration, working together across departments and with our partners to achieve common goals.',
    excellence: 'Excellence',
    excellence_description: 'We strive for excellence in everything we do, from product design and manufacturing to customer service and support.',
    sustainability: 'Sustainability',
    sustainability_description: 'We are committed to environmentally responsible practices, developing solutions that reduce emissions and promote cleaner energy.',
    our_team: 'Our Team',
    team_description: 'Meet the team driving our vision forward.',
    ceo_name: 'Alisher Karimov',
    ceo_title: 'Chief Executive Officer',
    ceo_description: 'With over 20 years of experience in the automotive industry, Alisher leads our company with vision and expertise.',
    cto_name: 'Dilshod Rakhimov',
    cto_title: 'Chief Technology Officer',
    cto_description: 'Dilshod oversees our technical operations, ensuring we stay at the cutting edge of automotive gas technology.',
    coo_name: 'Nodira Azimova',
    coo_title: 'Chief Operations Officer',
    coo_description: 'Nodira ensures our day-to-day operations run smoothly, coordinating our 12 branches across Uzbekistan.',
    join_our_journey: 'Join Our Journey',
    join_journey_description: 'Whether you\'re a customer, partner, or potential team member, we\'d love to connect with you.',
    view_openings: 'View Openings',

    // Branches Page
    our_branches: 'Our Branches',
    find_branches_description: 'Find EuropeGAS branches and service centers across Uzbekistan',
    search_branches_placeholder: 'Search branches by name, city or address...',
    clear: 'Clear',
    region: 'Region',
    all_regions: 'All Regions',
    locations: 'Locations',
    branch: 'Branch',
    branches_label: 'Branches',
    no_branches_found: 'No branches found matching your criteria',
    clear_filters: 'Clear filters',
    interactive_map: 'Interactive Map',
    no_branches_for_map: 'No branches to display on map',
    loading_map: 'Loading map...',
    city: 'City',
    phone: 'Phone',
    working_hours: 'Working Hours',
    weekdays: 'Weekdays',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
  uz: {
    // Header
    'home': 'Bosh sahifa',
    'products': 'Mahsulotlar',
    'services': 'Xizmatlar',
    'branches': 'Filiallar',
    'about_us': 'Biz haqimizda',
    'contact': 'Aloqa',
    'search': 'Qidirish',
    'cart': 'Savat',
    'login': 'Kirish',
    'profile': 'Profil',
    
    // Buttons
    'explore_our_services': 'Xizmatlarimiz bilan tanishing',
    'contact_us': 'Biz bilan bog\'laning',
    'continue_shopping': 'Xaridni davom ettirish',
    'clear_cart': 'Savatni tozalash',
    'proceed_to_checkout': 'Buyurtma berish',
    
    // Product-related
    'ecu_control_units': 'ECU boshqaruv bloklari',
    'rail_injectors': 'Rels injektorlari',
    'gas_reducers': 'Gaz reductorlari',
    'all_products': 'Barcha mahsulotlar',
    'product_page_description': 'Optimal ishlash va ishonchlilik uchun mo\'ljallangan yuqori sifatli {category} tanlovimizni ko\'rib chiqing.',
    'search_products_placeholder': 'Mahsulotlarni qidirish...',
    'sort_by': 'Saralash turi',
    'price_low_to_high': 'Narxi: pastdan yuqoriga',
    'price_high_to_low': 'Narxi: yuqoridan pastga',
    'name_a_to_z': 'Nomi: A dan Z gacha',
    'name_z_to_a': 'Nomi: Z dan A gacha',
    'filters': 'Filtrlar',
    'price_range': 'Narx oralig\'i',
    'no_products_found': 'Mahsulotlar topilmadi',
    'try_different_search': 'Qidiruv yoki filtr parametrlarini o\'zgartiring',
    'updating_products': 'Mahsulotlar yangilanmoqda...',
    
    // Service page
    'our_services': 'Bizning xizmatlar',
    'service_description': 'EuropeGAS & Rail Group O\'zbekiston gaz uskunalari va temir yo\'l tizimlari uchun o\'rnatishdan tortib texnik xizmat ko\'rsatish va optimallashtirishgacha bo\'lgan keng qamrovli echimlarni taqdim etadi.',
    'core_services': 'Asosiy xizmatlar',
    'core_services_description': 'Biz gaz uskunalari va temir yo\'l tizimlaringiz ehtiyojlarini qondirish uchun maxsus xizmatlarning keng doirasini taqdim etamiz.',
    'equipment_installation': 'Uskunalarni o\'rnatish',
    'equipment_installation_desc': 'Gaz uskunalari va temir yo\'l tizimlarini aniqlik va e\'tibor bilan professional o\'rnatish.',
    'maintenance_repair': 'Texnik xizmat ko\'rsatish va ta\'mirlash',
    'maintenance_repair_desc': 'Tizimlaringizni optimal ishlashi uchun keng qamrovli texnik xizmat ko\'rsatish va ta\'mirlash xizmatlari.',
    'consultation_services': 'Maslahat xizmatlari',
    'consultation_services_desc': 'Gaz va temir yo\'l tizimi ehtiyojlaringiz uchun expert maslahat va rejalashtirish.',
    'system_optimization': 'Tizimni optimallashtirish',
    'system_optimization_desc': 'Mavjud tizimlaringizning ishlashini va samaradorligini oshirish.',
    'additional_services': 'Qo\'shimcha xizmatlar',
    'performance_testing': 'Ishlash sifatini tekshirish',
    'performance_testing_desc': 'Tizimlaringiz eng yuqori ishlash standartlariga javob berishini ta\'minlash uchun keng qamrovli testlash.',
    'delivery_logistics': 'Yetkazib berish va logistika',
    'delivery_logistics_desc': 'O\'zbekiston bo\'ylab barcha uskunalar va qismlar uchun ishonchli yetkazib berish xizmatlari.',
    'equipment_testing': 'Uskunalarni sinash',
    'equipment_testing_desc': 'Barcha uskunalar xavfsizlik va ishlash standartlariga javob berishini ta\'minlash uchun to\'liq testlash xizmatlari.',
    'training_programs': 'O\'quv dasturlari',
    'training_programs_desc': 'Operatorlar va texnik xizmat ko\'rsatuvchi xodimlar uchun uskunalardan to\'g\'ri foydalanish va parvarish qilish bo\'yicha keng qamrovli treninglar.',
    'our_service_process': 'Bizning xizmat ko\'rsatish jarayonimiz',
    'consultation': 'Maslahat',
    'consultation_desc': 'Biz sizning ehtiyojlaringiz va talablaringizni batafsil muhokama qilamiz',
    'assessment': 'Baholash',
    'assessment_desc': 'Bizning mutaxassislarimiz sizning aniq vaziyatingizni baholaydilar',
    'implementation': 'Amalga oshirish',
    'implementation_desc': 'Biz kerakli xizmat yoki o\'rnatishni amalga oshiramiz',
    'follow_up': 'Kuzatib borish',
    'follow_up_desc': 'Biz sizning to\'liq qoniqishingizni ta\'minlaymiz',
    'ready_to_get_started': 'Boshlashga tayyormisiz?',
    'cta_description': 'Bugun biz bilan bog\'laning va gaz uskunalari hamda temir yo\'l yechimlari bo\'yicha qanday yordam bera olishimiz haqida gaplashamiz.',
    
    // Service details
    'gas_conversion_systems': 'Gaz konversiya tizimlari',
    'fuel_management_systems': 'Yoqilg\'i boshqaruv tizimlari',
    'rail_equipment_setup': 'Temir yo\'l uskunalarini sozlash',
    'preventive_maintenance': 'Oldini oluvchi texnik xizmat',
    'emergency_repairs': 'Favqulodda ta\'mirlash',
    'system_diagnostics': 'Tizim diagnostikasi',
    'system_design': 'Tizim dizayni',
    'efficiency_analysis': 'Samaradorlik tahlili',
    'regulatory_compliance': 'Qonuniy muvofiqlik',
    'performance_tuning': 'Ishlash sifatini sozlash',
    'efficiency_upgrades': 'Samaradorlikni oshirish',
    'system_integration': 'Tizim integratsiyasi',
    
    // HomePage
    'home_hero_alt': 'Avtomobil gaz jihozlari',
    'home_hero_title': 'Premium avtomobil gaz jihozlari',
    'home_hero_subtitle': 'Mukammallik uchun ishlab chiqilgan. Yuqori samaradorlik uchun mo\'ljallangan.',
    'explore_products': 'Mahsulotlarni ko\'rish',
    'learn_more': 'Batafsil ma\'lumot',
    'innovation_section_title': 'Eng yaxshi innovatsiyalar',
    'innovation_section_description': '15 yildan ortiq tajriba bilan, biz avtomobil gaz jihozlari sohasida mukammallikka erishdik, tengsiz sifat va samaradorlikni taqdim etamiz.',
    'feature_1_title': 'Sifat kafolati',
    'feature_1_description': 'Barcha mahsulotlarimiz xotirjamligingiz uchun kafolat va sifat kafolati bilan keladi.',
    'feature_2_title': 'Professional o\'rnatish',
    'feature_2_description': 'Bizning sertifikatlangan texniklar optimal ishlash uchun to\'g\'ri o\'rnatishni ta\'minlaydilar.',
    'feature_3_title': '12 ta mintaqaviy filiallar',
    'feature_3_description': 'O\'zbekiston bo\'ylab filiallarimiz bilan biz har doim mijozlarimizga yaqinmiz.',
    'feature_4_title': '100,000+ mijozlar',
    'feature_4_description': 'Mahsulot va xizmatlarimizga ishongan mamnun mijozlarimiz oilasiga qo\'shiling.',
    
    // Footer
    'company': 'Kompaniya',
    'quick_links': 'Tezkor havolalar',
    'newsletter': 'Yangiliklar',
    'copyright': 'Mualliflik huquqi © 2024 EuropeGAS & Rail Group O\'zbekiston. Barcha huquqlar himoyalangan.',
    
    // Language
    'language': 'Til',
    'english': 'Ingliz',
    'uzbek': 'O\'zbek',

    // About Page
    about_page_title: 'Biz haqimizda',
    about_hero_alt: 'EuropeGAS bosh ofisi',
    about_hero_description: 'EuropeGAS & Rail Group O\'zbekiston — 2005 yildan beri avtomobil gaz yechimlari bo\'yicha yetakchi.',
    our_mission: 'Bizning vazifamiz',
    mission_description: 'Biz mijozlarning o\'zgaruvchan ehtiyojlarini qondiradigan barqaror va samarali energiya yechimlarini taqdim etamiz, bunda sifat, xavfsizlik va ekologik mas\'uliyatning eng yuqori standartlarini saqlaymiz.',
    innovation: 'Innovatsiya',
    innovation_description: 'Biz avtomobil gaz texnologiyasida mumkin bo\'lgan chegaralarni doimo kengaytirib, yanada samarali, ishonchli va foydalanuvchiga qulay yechimlarni ishlab chiqamiz.',
    customer_focus: 'Mijozlarga e\'tibor',
    customer_focus_description: 'Biz ishlab chiqadigan har bir mahsulot va ko\'rsatadigan xizmatimiz mijozlarimiz ehtiyojlariga qaratilgan, bu ularga eng yaxshi tajriba va qiymatni olishlarini ta\'minlaydi.',
    our_journey: 'Bizning yo\'limiz',
    journey_description: 'Kamtarona boshlanishdan Markaziy Osiyoda avtomobil gaz yechimlari bo\'yicha yetakchiga aylanishgacha.',
    foundation: 'Asos',
    foundation_description: 'EuropeGAS & Rail Group yuqori sifatli avtomobil gaz yechimlarini taqdim etish maqsadida O\'zbekistonning Toshkent shahrida tashkil etilgan.',
    expansion: 'Kengaytirish',
    expansion_description: 'Biz O\'zbekistonning bir nechta mintaqalarida faoliyatimizni kengaytirdik va Yevropa ishlab chiqaruvchilari bilan hamkorlik o\'rnatdik.',
    today: 'Bugun',
    today_description: 'Hozirda mamlakatimizda 12 ta filial va 100 000 dan ortiq mamnun mijozlar bilan biz innovatsion yechimlar bilan bozorda yetakchilik qilishni davom ettiramiz.',
    our_values: 'Bizning qadriyatlarimiz',
    values_description: 'Barcha ishlarimizni boshqaradigan tamoyillar.',
    integrity: 'Halollik',
    integrity_description: 'Biz o\'z biznesimizni eng yuqori axloqiy standartlar bilan olib boramiz, barcha munosabatlarimizda shaffoflik va ishonchni ta\'minlaymiz.',
    teamwork: 'Jamoaviy ish',
    teamwork_description: 'Biz hamkorlikning kuchiga ishonamiz, bo\'limlar va hamkorlarimiz bilan birgalikda umumiy maqsadlarga erishish uchun ishlash.',
    excellence: 'Mukammallik',
    excellence_description: 'Biz qiladigan har bir ishda mukammallikka intilamiz, mahsulot dizaynidan tortib ishlab chiqarish, mijozlarga xizmat ko\'rsatish va qo\'llab-quvvatlashgacha.',
    sustainability: 'Barqarorlik',
    sustainability_description: 'Biz ekologik mas\'uliyatli amaliyotga sodiqmiz, chiqindilarni kamaytiradigan va toza energiyani rivojlantiradigan yechimlarni ishlab chiqamiz.',
    our_team: 'Bizning jamoa',
    team_description: 'Bizning ko\'rish qarashimizni oldinga siljitadigan jamoa bilan tanishing.',
    ceo_name: 'Alisher Karimov',
    ceo_title: 'Bosh ijrochi direktor',
    ceo_description: 'Avtomobil sanoatida 20 yildan ortiq tajribaga ega bo\'lgan Alisher kompaniyamizni ko\'rish qarash va tajriba bilan boshqaradi.',
    cto_name: 'Dilshod Rahimov',
    cto_title: 'Bosh texnologiya bo\'yicha direktor',
    cto_description: 'Dilshod texnik operatsiyalarimizni nazorat qiladi, biz avtomobil gaz texnologiyasi sohasida eng yuqori darajada qolishimizni ta\'minlaydi.',
    coo_name: 'Nodira Azimova',
    coo_title: 'Bosh operatsion direktor',
    coo_description: 'Nodira kundalik operatsiyalarimiz ravon ishlashini ta\'minlaydi, O\'zbekiston bo\'ylab 12 ta filialimizni muvofiqlashtiradi.',
    join_our_journey: 'Bizning yo\'limizga qo\'shiling',
    join_journey_description: 'Siz mijoz, hamkor yoki potensial jamoa a\'zosi bo\'lishingizdan qat\'i nazar, biz siz bilan bog\'lanishni xohlaymiz.',
    view_openings: 'Bo\'sh ish o\'rinlarini ko\'rish',

    // Branches Page
    our_branches: 'Bizning filiallarimiz',
    find_branches_description: 'O\'zbekiston bo\'ylab EuropeGAS filiallari va xizmat markazlarini toping',
    search_branches_placeholder: 'Filiallarni nomi, shahri yoki manzili bo\'yicha qidiring...',
    clear: 'Tozalash',
    region: 'Viloyat',
    all_regions: 'Barcha viloyatlar',
    locations: 'Manzillar',
    branch: 'Filial',
    branches_label: 'Filiallar',
    no_branches_found: 'Sizning mezonlaringizga mos keladigan filiallar topilmadi',
    clear_filters: 'Filtrlarni tozalash',
    interactive_map: 'Interaktiv xarita',
    no_branches_for_map: 'Xaritada ko\'rsatish uchun filiallar yo\'q',
    loading_map: 'Xarita yuklanmoqda...',
    city: 'Shahar',
    phone: 'Telefon',
    working_hours: 'Ish vaqti',
    weekdays: 'Ish kunlari',
    saturday: 'Shanba',
    sunday: 'Yakshanba',
  }
};

// Helper function to get translation and replace parameters
const getTranslation = (lang: Language, key: string, params?: Record<string, string>): string => {
  let translation = translations[lang][key] || key;
  
  // Replace parameters if provided
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{${param}}`, value);
    });
  }
  
  return translation;
};

// Create the provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get saved language preference or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    // Set html lang attribute for accessibility and SEO
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    return getTranslation(language, key, params);
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext; 