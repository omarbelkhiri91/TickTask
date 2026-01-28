// ============ ENUMS ============
export enum Priority {
  NONE = 0,
  P1 = 1,
  P2 = 2,
  P3 = 3,
  P4 = 4,
}

export enum TaskStatus {
  INCOMPLETE = 'incomplete',
  COMPLETE = 'complete',
}

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export enum PomodoroType {
  WORK = 'work',
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break',
}

// ============ INTERFACES ============
export interface List {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Section {
  id: string;
  list_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Task {
  id: string;
  user_id: string;
  list_id: string | null;
  section_id: string | null;
  title: string;
  notes: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  due_time: string | null;
  start_date: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  recurrence_rule: string | null;
  estimated_minutes: number | null;
  completed_at: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  is_complete: boolean;
  position: number;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface TaskTag {
  task_id: string;
  tag_id: string;
}

export interface Reminder {
  id: string;
  task_id: string;
  remind_at: string;
  notified: boolean;
}

export interface PomodoroSession {
  id: string;
  user_id: string;
  task_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  type: PomodoroType;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  goal_count: number;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  count: number;
}

// ============ NAVIGATION TYPES ============
export type RootStackParamList = {
  Main: undefined;
  TaskDetail: { taskId: string };
  ListDetail: { listId: string };
  TagDetail: { tagId: string };
  Settings: undefined;
  Account: undefined;
  Search: undefined;
  EisenhowerMatrix: undefined;
  Stats: undefined;
  HabitDetail: { habitId: string };
};

export type BottomTabParamList = {
  Today: undefined;
  Tasks: undefined;
  Calendar: undefined;
  Focus: undefined;
  Habits: undefined;
};
