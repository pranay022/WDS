import cron from 'node-cron';
import axios from 'axios';
import db from '../db/database.js';
import { generateSignature } from '../services/signature.service.js';
import { getNextRetryTime } from '../services/retry.service.js';
import type { Event, Endpoint } from '../types/db.types.js';
import { sendEventToClients } from '../sse/stream.js';

export const startDeliveryWorker = () => {
    cron.schedule('*/5 * * * * *', async() => {
        const now = new Date().toISOString();
        const events = db.prepare(`
                SELECT * FROM events
                WHERE status = 'pending'
                AND (next_retry_at <= ? OR next_retry_at IS NULL)
            `).all(now) as Event[];

        if (events.length > 0) {
            console.log(`[Worker] Found ${events.length} pending events at ${now}`);
        }

        for (const event of events){
            try {
                const endpoint = db.prepare(`
                        SELECT * FROM endpoints WHERE id = ?
                    `).get(event.endpoint_id) as Endpoint | undefined;

                if(!endpoint) {
                    console.error(`[Worker] Endpoint ${event.endpoint_id} not found for event ${event.id}`);
                    continue;
                }
                    
                console.log(`[Worker] Delivering event ${event.id} to ${endpoint.url}`);
                
                const timestamp = Date.now().toString();
                const signature = generateSignature(
                    endpoint.secret,
                    timestamp,
                    event.payload
                );

                const startTime = Date.now();

                const response = await axios.post(endpoint.url, event.payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Webhook-Signature': signature,
                        'X-Webhook-Timestamp': timestamp,
                        'X-Webhook-ID': event.id.toString()
                    },
                    timeout: 5000
                });

                const responseTime = Date.now() - startTime;

                db.prepare(`
                        INSERT INTO delivery_logs
                        (event_id, status_code, response_body, response_time_ms, success)
                        VALUES (?, ?, ?, ?, 1)
                    `).run(
                        event.id,
                        response.status,
                        JSON.stringify(response.data),
                        responseTime
                    );

                db.prepare(`
                        UPDATE events SET status = 'success' WHERE id = ?
                    `).run(event.id);

                console.log(`[Worker] Event ${event.id} delivered successfully (HTTP ${response.status})`);

                sendEventToClients({
                    event_id: event.id,
                    status: 'success',
                    status_code: response.status,
                    response_time_ms: responseTime,
                    endpoint_url: endpoint.url,
                    timestamp: new Date().toISOString()
                });
            } catch (error:any) {
                const attempt = event.attempt_count + 1;
                const nextRetry = getNextRetryTime(attempt);
                
                console.error(`[Worker] Event ${event.id} failed (Attempt ${attempt}): ${error.message}`);

                db.prepare(`
                        INSERT INTO delivery_logs
                        (event_id, status_code, response_body, response_time_ms, success, error_message)
                        VALUES (?, ?, ?, ?, 0, ?)
                    `).run(
                        event.id,
                        error.response?.status || 0,
                        JSON.stringify(error.response?.data || ''),
                        0,
                        error.message
                    );
                
                sendEventToClients({
                    event_id: event.id,
                    status: 'failed',
                    status_code: error.response?.status,
                    error: error.message,
                    attempt: attempt,
                    timestamp: new Date().toISOString()
                });
                
                if(!nextRetry){
                    db.prepare(`
                        UPDATE events 
                        SET status = 'failed', attempt_count = ?
                        WHERE id = ?
                        `).run(attempt, event.id);
                } else {
                    db.prepare(`
                            UPDATE events
                            SET attempt_count = ?, next_retry_at = ?
                            WHERE id = ?
                        `).run(attempt, nextRetry, event.id);
                }
            }
        }
    });
};