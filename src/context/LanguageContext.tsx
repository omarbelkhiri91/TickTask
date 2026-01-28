import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en' | 'fr';

const translations = {
  ar: {
    // عام
    today: 'اليوم', lists: 'القوائم', premium: 'بريميوم', stats: 'الإحصائيات',
    settings: 'الإعدادات', calendar: 'الرزنامة', hello: 'مرحباً', user: 'مستخدم',
    tasksRemaining: 'مهام متبقية', all: 'الكل', noTasks: 'لا توجد مهام بعد',
    noTasksForDate: 'لا توجد مهام لهذا اليوم', addFirstTask: 'اضغط + لإضافة أول مهمة',
    addNewTask: 'أضف مهمة جديدة...', save: 'حفظ', name: 'الاسم', delete: 'حذف',
    cancel: 'إلغاء', taskOptions: 'خيارات المهمة', tasks: 'مهام', pending: 'قيد الانتظار',
    completed: 'مكتملة', total: 'المجموع', edit: 'تعديل', error: 'خطأ',
    
    // التصنيفات
    work: 'عمل', study: 'دراسة', personal: 'شخصي', finance: 'مالية', home: 'منزل',
    meetings: 'اجتماعات', projects: 'مشاريع', emails: 'بريد', exams: 'امتحانات',
    homework: 'واجبات', research: 'أبحاث', health: 'صحة', shopping: 'تسوق',
    social: 'اجتماعي', bills: 'فواتير', savings: 'ادخار', investments: 'استثمارات',
    cleaning: 'تنظيف', maintenance: 'صيانة', groceries: 'مشتريات',
    
    // إدارة التصنيفات
    myLists: 'قوائمي', addCategory: 'إضافة تصنيف', addSubCategory: 'إضافة تصنيف فرعي',
    categoryName: 'اسم التصنيف', subCategoryName: 'اسم التصنيف الفرعي', icon: 'الأيقونة',
    color: 'اللون', noSubCategories: 'لا توجد تصنيفات فرعية', selectCategory: 'اختر التصنيف',
    selectSubCategory: 'اختر التصنيف الفرعي',
    
    // الإعدادات
    profile: 'الملف الشخصي', notifications: 'الإشعارات', appearance: 'المظهر',
    language: 'اللغة', help: 'المساعدة والدعم', about: 'حول التطبيق', signOut: 'تسجيل الخروج',
    darkMode: 'الوضع الداكن', enableNotifications: 'تفعيل الإشعارات', primaryColor: 'اللون الرئيسي',
    version: 'الإصدار', allRights: 'جميع الحقوق محفوظة',
    
    // البروفايل
    personalInfo: 'المعلومات الشخصية', workInfo: 'معلومات العمل', socialLinks: 'حسابات التواصل',
    fullName: 'الاسم الكامل', firstName: 'الاسم الأول', lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني', phone: 'رقم الهاتف', bio: 'نبذة عني', bioPlaceholder: 'اكتب نبذة قصيرة عن نفسك...',
    location: 'الموقع', website: 'الموقع الإلكتروني', occupation: 'المهنة', company: 'الشركة',
    yourName: 'اسمك', notSet: 'غير محدد', addAccount: 'إضافة حساب', at: 'في',
    changePhoto: 'تغيير الصورة', selectOption: 'اختر خياراً', camera: 'الكاميرا',
    gallery: 'المعرض', removePhoto: 'إزالة الصورة', permissionRequired: 'يرجى السماح بالوصول',
    streak: 'أيام متتالية', rate: 'معدل الإنجاز', memberSince: 'عضو منذ',
    
    // البريميوم
    goPremium: 'احصل على بريميوم', unlockFeatures: 'افتح جميع المميزات',
    unlimitedLists: 'قوائم غير محدودة', cloudSync: 'مزامنة سحابية', noAds: 'بدون إعلانات',
    themes: 'ثيمات متعددة', subscribe: 'اشترك الآن', monthly: 'شهري', yearly: 'سنوي',
    
    // الإحصائيات
    statistics: 'الإحصائيات', thisWeek: 'هذا الأسبوع', thisMonth: 'هذا الشهر',
    completionRate: 'معدل الإنجاز',
  },
  en: {
    today: 'Today', lists: 'Lists', premium: 'Premium', stats: 'Stats',
    settings: 'Settings', calendar: 'Calendar', hello: 'Hello', user: 'User',
    tasksRemaining: 'tasks remaining', all: 'All', noTasks: 'No tasks yet',
    noTasksForDate: 'No tasks for this day', addFirstTask: 'Press + to add your first task',
    addNewTask: 'Add new task...', save: 'Save', name: 'Name', delete: 'Delete',
    cancel: 'Cancel', taskOptions: 'Task Options', tasks: 'tasks', pending: 'Pending',
    completed: 'Completed', total: 'Total', edit: 'Edit', error: 'Error',
    
    work: 'Work', study: 'Study', personal: 'Personal', finance: 'Finance', home: 'Home',
    meetings: 'Meetings', projects: 'Projects', emails: 'Emails', exams: 'Exams',
    homework: 'Homework', research: 'Research', health: 'Health', shopping: 'Shopping',
    social: 'Social', bills: 'Bills', savings: 'Savings', investments: 'Investments',
    cleaning: 'Cleaning', maintenance: 'Maintenance', groceries: 'Groceries',
    
    myLists: 'My Lists', addCategory: 'Add Category', addSubCategory: 'Add Subcategory',
    categoryName: 'Category name', subCategoryName: 'Subcategory name', icon: 'Icon',
    color: 'Color', noSubCategories: 'No subcategories', selectCategory: 'Select category',
    selectSubCategory: 'Select subcategory',
    
    profile: 'Profile', notifications: 'Notifications', appearance: 'Appearance',
    language: 'Language', help: 'Help & Support', about: 'About', signOut: 'Sign Out',
    darkMode: 'Dark Mode', enableNotifications: 'Enable Notifications', primaryColor: 'Primary Color',
    version: 'Version', allRights: 'All Rights Reserved',
    
    personalInfo: 'Personal Information', workInfo: 'Work Information', socialLinks: 'Social Links',
    fullName: 'Full Name', firstName: 'First Name', lastName: 'Last Name',
    email: 'Email', phone: 'Phone', bio: 'Bio', bioPlaceholder: 'Write a short bio about yourself...',
    location: 'Location', website: 'Website', occupation: 'Occupation', company: 'Company',
    yourName: 'Your Name', notSet: 'Not set', addAccount: 'Add account', at: 'at',
    changePhoto: 'Change Photo', selectOption: 'Select an option', camera: 'Camera',
    gallery: 'Gallery', removePhoto: 'Remove Photo', permissionRequired: 'Permission required',
    streak: 'Day Streak', rate: 'Success Rate', memberSince: 'Member since',
    
    goPremium: 'Go Premium', unlockFeatures: 'Unlock all features',
    unlimitedLists: 'Unlimited Lists', cloudSync: 'Cloud Sync', noAds: 'No Ads',
    themes: 'Multiple Themes', subscribe: 'Subscribe Now', monthly: 'Monthly', yearly: 'Yearly',
    
    statistics: 'Statistics', thisWeek: 'This Week', thisMonth: 'This Month',
    completionRate: 'Completion Rate',
  },
  fr: {
    today: "Aujourd'hui", lists: 'Listes', premium: 'Premium', stats: 'Stats',
    settings: 'Paramètres', calendar: 'Calendrier', hello: 'Bonjour', user: 'Utilisateur',
    tasksRemaining: 'tâches restantes', all: 'Tout', noTasks: 'Pas de tâches',
    noTasksForDate: 'Pas de tâches pour ce jour', addFirstTask: 'Appuyez + pour ajouter une tâche',
    addNewTask: 'Ajouter une tâche...', save: 'Enregistrer', name: 'Nom', delete: 'Supprimer',
    cancel: 'Annuler', taskOptions: 'Options de tâche', tasks: 'tâches', pending: 'En attente',
    completed: 'Terminées', total: 'Total', edit: 'Modifier', error: 'Erreur',
    
    work: 'Travail', study: 'Études', personal: 'Personnel', finance: 'Finance', home: 'Maison',
    meetings: 'Réunions', projects: 'Projets', emails: 'Emails', exams: 'Examens',
    homework: 'Devoirs', research: 'Recherches', health: 'Santé', shopping: 'Shopping',
    social: 'Social', bills: 'Factures', savings: 'Épargne', investments: 'Investissements',
    cleaning: 'Nettoyage', maintenance: 'Entretien', groceries: 'Courses',
    
    myLists: 'Mes Listes', addCategory: 'Ajouter une catégorie', addSubCategory: 'Ajouter une sous-catégorie',
    categoryName: 'Nom de la catégorie', subCategoryName: 'Nom de la sous-catégorie', icon: 'Icône',
    color: 'Couleur', noSubCategories: 'Pas de sous-catégories', selectCategory: 'Sélectionner une catégorie',
    selectSubCategory: 'Sélectionner une sous-catégorie',
    
    profile: 'Profil', notifications: 'Notifications', appearance: 'Apparence',
    language: 'Langue', help: 'Aide & Support', about: 'À propos', signOut: 'Déconnexion',
    darkMode: 'Mode Sombre', enableNotifications: 'Activer les notifications', primaryColor: 'Couleur principale',
    version: 'Version', allRights: 'Tous droits réservés',
    
    personalInfo: 'Informations personnelles', workInfo: 'Informations professionnelles', socialLinks: 'Réseaux sociaux',
    fullName: 'Nom complet', firstName: 'Prénom', lastName: 'Nom de famille',
    email: 'Email', phone: 'Téléphone', bio: 'Bio', bioPlaceholder: 'Écrivez une courte bio...',
    location: 'Localisation', website: 'Site web', occupation: 'Profession', company: 'Entreprise',
    yourName: 'Votre nom', notSet: 'Non défini', addAccount: 'Ajouter un compte', at: 'chez',
    changePhoto: 'Changer la photo', selectOption: 'Sélectionnez une option', camera: 'Caméra',
    gallery: 'Galerie', removePhoto: 'Supprimer la photo', permissionRequired: 'Permission requise',
    streak: 'Jours consécutifs', rate: 'Taux de réussite', memberSince: 'Membre depuis',
    
    goPremium: 'Passer Premium', unlockFeatures: 'Débloquer toutes les fonctionnalités',
    unlimitedLists: 'Listes illimitées', cloudSync: 'Sync Cloud', noAds: 'Sans publicité',
    themes: 'Thèmes multiples', subscribe: "S'abonner", monthly: 'Mensuel', yearly: 'Annuel',
    
    statistics: 'Statistiques', thisWeek: 'Cette semaine', thisMonth: 'Ce mois',
    completionRate: "Taux d'achèvement",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ar;
  rtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: translations.ar,
  rtl: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  
  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: translations[language],
      rtl: language === 'ar',
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export type { Language };
