import express from 'express';
import db from './db/database.js';
import endpointsRoutes from './routes/endpoints.routes.js'

const app = express();
app.use(express.json());

//Health check route 
app.get('/', (req, res) => {
    res.send('Webhook Delivery Service Running');
});

app.use('/api/endpoints', endpointsRoutes);

const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});

