import db from '../db/database.js';

export const getAllLogs = () => {
    const stmt = db.prepare(`
            SELECT 
                delivery_logs.id,
                delivery_logs.event_id,
                delivery_logs.status_code,
                delivery_logs.response_time_ms,
                delivery_logs.success,
                delivery_logs.error_message,
                delivery_logs.attempted_at,
                endpoints.url
            FROM delivery_logs
            JOIN events ON delivery_logs.event_id = events.id
            JOIN endpoints ON events.endpoint_id = endpoints.id
            ORDER BY delivery_logs.attempted_at DESC
        `);
    return stmt.all();
};

export const getLogsByEventId = (eventId: number) => {
    const stmt = db.prepare(`
            SELECT *
            FROM delivery_logs
            WHERE event_id = ?
            ORDER BY attempted_at DESC
        `);
    return stmt.all(eventId);
}