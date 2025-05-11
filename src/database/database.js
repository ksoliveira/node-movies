import Database from 'better-sqlite3';

const isDevelopment = process.env.NODE_ENV === 'development';
const db = new Database(':memory:', { verbose: isDevelopment ? console.log : null });

console.log('Database created in memory');
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    studios TEXT NOT NULL,
    producers TEXT NOT NULL,
    winner TEXT NOT NULL
  )
`);

export default db;