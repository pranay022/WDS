import type { Request, Response } from 'express';
import * as eventSerice from '../services/events.service.js';

export const createEvent = (req: Request, res: Response) =>{
    try {
        const { endpoint_id, payload } = req.body;

        if(!endpoint_id || !payload){
            return res.status(400).json({error: 'endpoint id and payload are required'});
        }

        const endpoint = eventSerice.getEndpointById(endpoint_id);
        if(!endpoint){
            return res.status(404).json({error: 'Endpoint not found'});
        }

        const event = eventSerice.createEvent(endpoint_id, payload);

        res.status(201).json({
            message: 'Event created',
            event_id: event.id
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create event'});
    }
}


