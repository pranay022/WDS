import express from 'express';
import cors from 'cors';
import db from './db/database.js';
import endpointsRoutes from './routes/endpoints.routes.js'
import { registerRoutes } from './routes/index.js';
import { startDeliveryWorker } from './worker/delivery.worker.js';

const app = express();
app.use(cors());
app.use(express.json());

//Health check route 
app.get('/', (req, res) => {
    res.send('Webhook Delivery Service Running');
});

//Register all routes
registerRoutes(app);
startDeliveryWorker();

const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});


