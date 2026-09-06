import express, { Request, Response } from 'express';
import { clearanceRouter } from './routes/clearance';
import { certificatesRouter } from './routes/certificates';
import { statsRouter } from './routes/stats';

export const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'clearpass-clearance-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routers
app.use('/api/clearance', clearanceRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/stats', statsRouter);

// Fallback for unrecognized API calls
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export function startServer(port = PORT) {
  return app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${port}`);
  });
}

// Direct execution guard
if (process.env.NODE_ENV === 'standalone') {
  startServer();
}
