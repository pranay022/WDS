import type { Request, Response } from 'express';
import * as logsService from '../services/logs.service.js';

export const getLogs = (req: Request, res: Response) => {
    try {
        const logs = logsService.getAllLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch logs'})
    }
};

export const getLogsByEventId = (req: Request, res: Response) => {
    try {
        const eventId = Number(req.params.eventId);
        const logs = logsService.getLogsByEventId(eventId);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch logs'})
    }
};