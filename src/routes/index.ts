import type { Express } from 'express';
import endpointsRoutes from './endpoints.routes.js';
import eventsRoutes from './events.routes.js';

export const registerRoutes = (app: Express) => {
    app.use('/api/endpoints', endpointsRoutes);
    app.use('/api/events', eventsRoutes);
}