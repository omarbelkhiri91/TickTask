import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ticktask.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      list_id TEXT,
      section_id TEXT,
      title TEXT NOT NULL,
      notes TEXT,
      priority INTEGER DEFAULT 0,
      status INTEGER DEFAULT 0,
      due_date TEXT,
      due_time TEXT,
      start_date TEXT,
      scheduled_start TEXT,
      scheduled_end TEXT,
      recurrence_rule TEXT,
      estimated_minutes INTEGER,
      completed_at TEXT,
      position INTEGER,
      created_at TEXT,
      updated_at TEXT,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      color TEXT,
      icon TEXT,
      position INTEGER,
      created_at TEXT,
      updated_at TEXT,
      deleted_at TEXT
    );
  `);
};

export const getAllTasks = () => {
  return db.getAllSync('SELECT * FROM tasks WHERE deleted_at IS NULL ORDER BY position');
};

export const insertTask = (task: any) => {
  db.runSync(
    `INSERT INTO tasks (id, user_id, list_id, title, notes, priority, status, due_date, position, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [task.id, task.user_id, task.list_id, task.title, task.notes, task.priority, task.status, task.due_date, task.position, task.created_at, task.updated_at]
  );
};

export const updateTask = (id: string, updates: any) => {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), id];
  db.runSync(`UPDATE tasks SET ${fields} WHERE id = ?`, values as any);
};

export const deleteTask = (id: string) => {
  db.runSync('UPDATE tasks SET deleted_at = ? WHERE id = ?', [new Date().toISOString(), id]);
};

export default db;
