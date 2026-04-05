import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(process.cwd(), 'webhooks.db');

const db:DatabaseType = new Database(dbPath);

db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS endpoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        secret TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_id INTEGER,
        payload TEXT,
        status TEXT DEFAULT 'pending',
        next_retry_at DATETIME,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(endpoint_id) REFERENCES endpoints(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS delivery_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER,
        status_code INTEGER,
        response_body TEXT,
        response_time_ms INTEGER,
        success INTEGER,
        error_message TEXT,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
    );
`);

console.log('Database connected successfully');

export default db;


