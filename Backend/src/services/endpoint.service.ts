import db from '../db/database.js';

export const  createEndpoint = (url: string, secret: string, description?: string) =>{
    const stmt = db.prepare(`
            INSERT INTO endpoints (url, secret, description)
            VALUES (?, ?, ?)
        `)
    const result = stmt.run(url, secret, description);
    return { id: result.lastInsertRowid };
};

export const getAllEndpoints = () => {
    const stmt = db.prepare(`SELECT * FROM endpoints ORDER BY created_at DESC`)
    return stmt.all();
};

export const deleteEndpoint = (id: number) => {
    const stmt = db.prepare(`
            DELETE FROM endpoints WHERE id = ?
        `);
    return stmt.run(id);
}