import type { Express } from 'express';
import endpointsRoutes from './endpoints.routes.js';
import eventsRoutes from './events.routes.js';
import logsRoutes from './logs.routes.js';
import streamRoutes from './stream.route.js';

export const registerRoutes = (app: Express) => {
    app.use('/api/endpoints', endpointsRoutes);
    app.use('/api/events', eventsRoutes);
    app.use('/api/logs', logsRoutes);
    app.use('/api/stream', streamRoutes);
}