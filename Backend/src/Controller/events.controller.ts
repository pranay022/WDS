import type { Request, Response } from 'express';
import * as eventService from '../services/events.service.js';
import { sendEventToClients } from '../sse/stream.js';

export const createEvent = (req: Request, res: Response) =>{
    try {
        const { endpoint_id, payload } = req.body;

        if(!endpoint_id || !payload){
            return res.status(400).json({error: 'endpoint id and payload are required'});
        }

        const endpoint = eventService.getEndpointById(endpoint_id);
        if(!endpoint){
            return res.status(404).json({error: 'Endpoint not found'});
        }

        const event = eventService.createEvent(endpoint_id, payload);

        res.status(201).json({
            message: 'Event created',
            event_id: event.id
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create event'});
    }
}

export const getEvents = (req: Request, res: Response) => {
    try {
        const events = eventService.getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

export const retryEvent = (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        eventService.retryEvent(id);
        
        sendEventToClients({
            event_id: id,
            status: 'pending',
            timestamp: new Date().toISOString()
        });

        res.json({ message: 'Event marked for retry' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retry event' });
    }
};

export const cancelEvent = (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        eventService.cancelEvent(id);

        sendEventToClients({
            event_id: id,
            status: 'cancelled',
            timestamp: new Date().toISOString()
        });

        res.json({ message: 'Event cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel event' });
    }
};


