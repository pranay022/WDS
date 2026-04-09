import type { Request, Response } from 'express';
import * as endpointService from '../services/endpoint.service.js';
import type { ResolveFnOutput } from 'node:module';

export const createEndpoint = (req: Request, res:Response) => {
    try {
        const {url, secret, description } = req.body;
        
        if(!url || !secret){
            return res.status(400).json({error:'url and secret are required'});
        }

        const endpoint = endpointService.createEndpoint(url, secret, description);
        res.status(201).json(endpoint);
    } catch (error) {
        res.status(500).json({error: 'Failed to create endpoint'});
    }
};


export const getEndpoints = (req: Request, res: Response) => {
    try {
        const endpoints = endpointService.getAllEndpoints();
        res.json(endpoints);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch endpoints'})
    }
};

export const deleteEndpoint = (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        endpointService.deleteEndpoint(id);
        res.json({message: 'Endpoint deleted'});
    } catch (error) {
        res.status(500).json({error: 'Failed to delete endpoint'})
    }
};