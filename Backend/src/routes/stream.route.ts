import type { Request, Response } from 'express';
import { Router } from 'express';
import { addClient, removeClient } from '../sse/stream.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    addClient(res);

    req.on('close', () => {
        removeClient(res);
    });
});


export default router;