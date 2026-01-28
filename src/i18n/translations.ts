export const translations = {
  ar: {
    // Navigation
    today: 'اليوم',
    lists: 'القوائم',
    premium: 'بريميوم',
    stats: 'الإحصائيات',
    settings: 'الإعدادات',
    
    // Home
    hello: 'مرحباً',
    user: 'مستخدم',
    tasksRemaining: 'مهام متبقية',
    all: 'الكل',
    work: 'عمل',
    study: 'دراسة',
    personal: 'شخصي',
    noTasks: 'لا توجد مهام بعد',
    addFirstTask: 'اضغط + لإضافة أول مهمة',
    addNewTask: 'أضف مهمة جديدة...',
    
    // Settings
    profile: 'الملف الشخصي',
    notifications: 'الإشعارات',
    appearance: 'المظهر',
    language: 'اللغة',
    help: 'المساعدة والدعم',
    about: 'حول التطبيق',
    signOut: 'تسجيل الخروج',
    save: 'حفظ',
    name: 'الاسم',
    darkMode: 'الوضع الداكن',
    enableNotifications: 'تفعيل الإشعارات',
    primaryColor: 'اللون الرئيسي',
    version: 'الإصدار',
    allRights: 'جميع الحقوق محفوظة',
    
    // Lists
    myLists: 'قوائمي',
    createList: 'إنشاء قائمة جديدة',
    shopping: 'التسوق',
    fitness: 'اللياقة',
    tasks: 'مهام',
    
    // Stats
    statistics: 'الإحصائيات',
    completed: 'مكتملة',
    pending: 'قيد الانتظار',
    total: 'المجموع',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    completionRate: 'معدل الإنجاز',
    
    // Premium
    goPremium: 'احصل على بريميوم',
    unlockFeatures: 'افتح جميع المميزات',
    unlimitedLists: 'قوائم غير محدودة',
    cloudSync: 'مزامنة سحابية',
    noAds: 'بدون إعلانات',
    themes: 'ثيمات متعددة',
    subscribe: 'اشترك الآن',
    monthly: 'شهري',
    yearly: 'سنوي',
  },
  en: {
    // Navigation
    today: 'Today',
    lists: 'Lists',
    premium: 'Premium',
    stats: 'Stats',
    settings: 'Settings',
    
    // Home
    hello: 'Hello',
    user: 'User',
    tasksRemaining: 'tasks remaining',
    all: 'All',
    work: 'Work',
    study: 'Study',
    personal: 'Personal',
    noTasks: 'No tasks yet',
    addFirstTask: 'Press + to add your first task',
    addNewTask: 'Add new task...',
    
    // Settings
    profile: 'Profile',
    notifications: 'Notifications',
    appearance: 'Appearance',
    language: 'Language',
    help: 'Help & Support',
    about: 'About',
    signOut: 'Sign Out',
    save: 'Save',
    name: 'Name',
    darkMode: 'Dark Mode',
    enableNotifications: 'Enable Notifications',
    primaryColor: 'Primary Color',
    version: 'Version',
    allRights: 'All Rights Reserved',
    
    // Lists
    myLists: 'My Lists',
    createList: 'Create New List',
    shopping: 'Shopping',
    fitness: 'Fitness',
    tasks: 'tasks',
    
    // Stats
    statistics: 'Statistics',
    completed: 'Completed',
    pending: 'Pending',
    total: 'Total',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    completionRate: 'Completion Rate',
    
    // Premium
    goPremium: 'Go Premium',
    unlockFeatures: 'Unlock all features',
    unlimitedLists: 'Unlimited Lists',
    cloudSync: 'Cloud Sync',
    noAds: 'No Ads',
    themes: 'Multiple Themes',
    subscribe: 'Subscribe Now',
    monthly: 'Monthly',
    yearly: 'Yearly',
  },
  fr: {
    // Navigation
    today: "Aujourd'hui",
    lists: 'Listes',
    premium: 'Premium',
    stats: 'Stats',
    settings: 'Paramètres',
    
    // Home
    hello: 'Bonjour',
    user: 'Utilisateur',
    tasksRemaining: 'tâches restantes',
    all: 'Tout',
    work: 'Travail',
    study: 'Études',
    personal: 'Personnel',
    noTasks: 'Pas de tâches',
    addFirstTask: 'Appuyez + pour ajouter une tâche',
    addNewTask: 'Ajouter une tâche...',
    
    // Settings
    profile: 'Profil',
    notifications: 'Notifications',
    appearance: 'Apparence',
    language: 'Langue',
    help: 'Aide & Support',
    about: 'À propos',
    signOut: 'Déconnexion',
    save: 'Enregistrer',
    name: 'Nom',
    darkMode: 'Mode Sombre',
    enableNotifications: 'Activer les notifications',
    primaryColor: 'Couleur principale',
    version: 'Version',
    allRights: 'Tous droits réservés',
    
    // Lists
    myLists: 'Mes Listes',
    createList: 'Créer une liste',
    shopping: 'Courses',
    fitness: 'Fitness',
    tasks: 'tâches',
    
    // Stats
    statistics: 'Statistiques',
    completed: 'Terminées',
    pending: 'En attente',
    total: 'Total',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
    completionRate: "Taux d'achèvement",
    
    // Premium
    goPremium: 'Passer Premium',
    unlockFeatures: 'Débloquer toutes les fonctionnalités',
    unlimitedLists: 'Listes illimitées',
    cloudSync: 'Sync Cloud',
    noAds: 'Sans publicité',
    themes: 'Thèmes multiples',
    subscribe: "S'abonner",
    monthly: 'Mensuel',
    yearly: 'Annuel',
  },
};

export type Language = 'ar' | 'en' | 'fr';
export type TranslationKey = keyof typeof translations.ar;
