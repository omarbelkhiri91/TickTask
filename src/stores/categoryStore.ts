import { create } from 'zustand';

export interface SubCategory {
  id: string;
  nameKey: string;
  icon: string;
  color: string;
}

export interface Category {
  id: string;
  nameKey: string;
  icon: string;
  color: string;
  subCategories: SubCategory[];
}

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'subCategories'>) => void;
  addSubCategory: (categoryId: string, subCategory: Omit<SubCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
  deleteSubCategory: (categoryId: string, subCategoryId: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [
    {
      id: 'work',
      nameKey: 'work',
      icon: 'briefcase',
      color: '#2196F3',
      subCategories: [
        { id: 'meetings', nameKey: 'meetings', icon: 'people', color: '#1976D2' },
        { id: 'projects', nameKey: 'projects', icon: 'folder', color: '#1565C0' },
        { id: 'emails', nameKey: 'emails', icon: 'mail', color: '#0D47A1' },
      ]
    },
    {
      id: 'study',
      nameKey: 'study',
      icon: 'school',
      color: '#9C27B0',
      subCategories: [
        { id: 'exams', nameKey: 'exams', icon: 'document-text', color: '#7B1FA2' },
        { id: 'homework', nameKey: 'homework', icon: 'create', color: '#6A1B9A' },
        { id: 'research', nameKey: 'research', icon: 'search', color: '#4A148C' },
      ]
    },
    {
      id: 'personal',
      nameKey: 'personal',
      icon: 'person',
      color: '#4CAF50',
      subCategories: [
        { id: 'health', nameKey: 'health', icon: 'fitness', color: '#388E3C' },
        { id: 'shopping', nameKey: 'shopping', icon: 'cart', color: '#2E7D32' },
        { id: 'social', nameKey: 'social', icon: 'heart', color: '#1B5E20' },
      ]
    },
    {
      id: 'finance',
      nameKey: 'finance',
      icon: 'wallet',
      color: '#FF9800',
      subCategories: [
        { id: 'bills', nameKey: 'bills', icon: 'receipt', color: '#F57C00' },
        { id: 'savings', nameKey: 'savings', icon: 'trending-up', color: '#EF6C00' },
        { id: 'investments', nameKey: 'investments', icon: 'analytics', color: '#E65100' },
      ]
    },
    {
      id: 'home',
      nameKey: 'home',
      icon: 'home',
      color: '#E91E63',
      subCategories: [
        { id: 'cleaning', nameKey: 'cleaning', icon: 'sparkles', color: '#C2185B' },
        { id: 'maintenance', nameKey: 'maintenance', icon: 'construct', color: '#AD1457' },
        { id: 'groceries', nameKey: 'groceries', icon: 'basket', color: '#880E4F' },
      ]
    },
  ],

  addCategory: (categoryData) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryData,
      subCategories: [],
    };
    set((state) => ({ categories: [...state.categories, newCategory] }));
  },

  addSubCategory: (categoryId, subCategoryData) => {
    const newSubCategory: SubCategory = {
      id: Date.now().toString(),
      ...subCategoryData,
    };
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subCategories: [...cat.subCategories, newSubCategory] }
          : cat
      ),
    }));
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    }));
  },

  deleteSubCategory: (categoryId, subCategoryId) => {
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subCategories: cat.subCategories.filter((sub) => sub.id !== subCategoryId) }
          : cat
      ),
    }));
  },
}));
