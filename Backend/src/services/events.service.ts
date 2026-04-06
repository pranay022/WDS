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