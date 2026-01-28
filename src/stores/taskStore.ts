import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  subCategory?: string;
  created_at: string;
  due_date?: string;
  deleted_at?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  
  addTask: (taskData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      completed: false,
      category: taskData.category || 'personal',
      subCategory: taskData.subCategory,
      created_at: taskData.due_date || new Date().toISOString(),
      due_date: taskData.due_date,
      priority: taskData.priority || 'medium',
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  toggleTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, deleted_at: new Date().toISOString() } : task
      ),
    }));
  },

  updateTask: (id, data) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...data } : task
      ),
    }));
  },
}));
