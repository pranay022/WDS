import db from '../db/database.js';

export const createEvent = (endpointId: number, payload: any) => {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
            INSERT INTO events (endpoint_id, payload, status, next_retry_at, attempt_count)
            VALUES (?, ?, 'pending', ?, 0)
        `);
    const result = stmt.run(endpointId, JSON.stringify(payload), now);
    return {id: result.lastInsertRowid };
}

export const getEndpointById = ( id: number) => {
    const stmt = db.prepare(`
            SELECT * FROM endpoints WHERE id = ?
        `);
    return stmt.get(id);
}

export const getAllEvents = () => {
    const stmt = db.prepare(`SELECT * FROM events ORDER BY created_at DESC`);
    return stmt.all();
};

export const retryEvent = (id: number) => {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
        UPDATE events 
        SET status = 'pending', next_retry_at = ?, attempt_count = 0 
        WHERE id = ?
    `);
    return stmt.run(now, id);
};

export const cancelEvent = (id: number) => {
    const stmt = db.prepare(`
        UPDATE events 
        SET status = 'cancelled' 
        WHERE id = ?
    `);
    return stmt.run(id);
};