import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

const forceDatabaseRefresh = false;

const app = express();
const PORT = process.env.PORT || 3001;

// Detailed CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',  
    'http://localhost:3001',  
    'https://full-stack-react-kanban-board-frontend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

app.use(express.json({
  limit: '10kb'
}));

// Logging middleware for debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static files
app.use(express.static('../client/dist'));

// Mount routes
app.use(routes);

// Error handling middleware with all parameters used
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Unexpected server error',
    error: err.message
  });
});

sequelize.sync({force: forceDatabaseRefresh}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});

export default app;