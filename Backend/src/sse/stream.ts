import type { Response } from 'express';

let clients: Response[] = [];

export const addClient = (res: Response) => {
    clients.push(res);
};

export const removeClient = (res: Response) => {
    clients = clients.filter(client => client !== res );
};

export const sendEventToClients = (data: any) => {
    const message = `data: ${JSON.stringify(data)}\n\n`;

    clients.forEach(client => {
        client.write(message);
    });
};