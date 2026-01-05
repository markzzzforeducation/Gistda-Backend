import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { router as authRouter } from './routes/auth';
import { router as boardsRouter } from './routes/boards';
import { router as notificationsRouter } from './routes/notifications';
import { router as usersRouter } from './routes/users';
import { router as coursesRouter } from './routes/courses';
import { router as submissionsRouter } from './routes/submissions';
import { router as evaluationsRouter } from './routes/evaluations';

const app = express();

// Debug: Log environment variables status on startup
console.log('[Backend] Google OAuth Config:', {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '✗ Missing',
  JWT_SECRET: process.env.JWT_SECRET ? '✓ Set' : '✗ Missing',
});

if (process.env.GOOGLE_REDIRECT_URI) {
  console.log('[Backend] GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);
}

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));
app.use(json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/evaluations', evaluationsRouter);

const PORT = Number(process.env.PORT || 5174);
app.listen(PORT, () => {
  console.log(`[Backend] API listening on http://localhost:${PORT}`);
});


