import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error-handler';
import './types/express';

const app = express();

app.use(helmet());

// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
  'https://box.harooo.co.kr',
  'https://test-box.harooo.co.kr',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

const HAROOO_SUBDOMAIN_PATTERN = /^https:\/\/([a-zA-Z0-9-]+\.)*harooo\.co\.kr$/;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || HAROOO_SUBDOMAIN_PATTERN.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Haroo Box API', version: '1.0.0' });
});

// API Routes
app.use('/api', routes);

// Error Handler (must be last)
app.use(errorHandler);

export default app;
