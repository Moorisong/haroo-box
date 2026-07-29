import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error-handler';
import { registerPostcardCleanupCron } from './cron/cleanupPostcards';
import './types/express';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
  'https://box.haroo.site',
  'https://box-api.haroo.site',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

console.log('[DEBUG] Initialized allowedOrigins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.haroo.site')) {
      return callback(null, true);
    }
    console.log('Origin NOT allowed:', origin);
    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 업로드 파일 정적 서빙 (/uploads 하위 모든 이미지 정적 접근 허용)
// CWD 위치에 상관없이 100% 매핑되도록 absolute 경로 결합
const uploadsBaseDir = path.resolve(__dirname, '../uploads');
const uploadsRootDir = path.resolve(process.cwd(), 'uploads');
const uploadsServerDir = path.resolve(process.cwd(), 'apps/server/uploads');

app.use('/uploads', express.static(uploadsBaseDir));
app.use('/uploads', express.static(uploadsServerDir));
app.use('/uploads', express.static(uploadsRootDir));

// 하루엽서 만료 배치 Cron 등록 (매일 새벽 04:00, 환경변수로 오버라이드 가능)
registerPostcardCleanupCron();

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
