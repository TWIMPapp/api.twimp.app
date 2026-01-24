import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Logger } from './utils/logger';

// Route modules
//import trailsRoutes from './routes/trails';
// import universalRoutes from './routes/universal';  // Disabled - Easter Event supersedes this
import easterRoutes from './routes/easter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(Logger.middleware.bind(Logger));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', branding: 'api.twimp.app' });
});

// Mount route modules
// app.use(trailsRoutes);      // Trails + Config (9 endpoints)
// app.use(universalRoutes);   // Disabled - Easter Event supersedes this
app.use(easterRoutes);      // Easter Event (9 endpoints)

app.listen(PORT, () => {
    Logger.info(`Twimp Backend (api.twimp.app) running on port ${PORT}`, 'SERVER');
});
