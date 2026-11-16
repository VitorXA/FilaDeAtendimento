import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import queueRoutes from './routes/queues.js';
import ticketRoutes from './routes/tickets.js';
import { pool } from './config/db.js';
import { redis } from './config/redis.js';
import { initDb } from './config/initDb.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const allowedOrigins = (process.env.CLIENT_URL || '*')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem não autorizada pelo servidor'));
  },
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  let postgres = 'ok';
  let redisStatus = 'ok';

  try {
    await pool.query('SELECT 1');
  } catch {
    postgres = 'error';
  }

  try {
    await redis.ping();
  } catch {
    redisStatus = 'error';
  }

  const ok = postgres === 'ok' && redisStatus === 'ok';
  res.status(ok ? 200 : 503).json({ ok, postgres, redis: redisStatus });
});

app.use('/api/auth', authRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/tickets', ticketRoutes);

app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  if (err.message === 'Origem não autorizada pelo servidor') {
    return res.status(403).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Erro interno do servidor' });
});

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL: conexão OK.');

    if (!redis.isOpen) {
      await redis.connect();
    }
    await redis.ping();
    console.log('Redis: conexão OK.');

    await initDb();

    app.listen(port, host, () => {
      console.log(`API em http://${host}:${port}`);
      console.log(`Health: http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error('\nNão foi possível iniciar a API.');
    console.error('Verifique PostgreSQL (porta 5432), Redis (porta 6379) e o backend/.env.');
    console.error(error?.message || error);
    process.exitCode = 1;
  }
}

process.on('SIGINT', async () => {
  await Promise.allSettled([
    pool.end(),
    redis.isOpen ? redis.quit() : Promise.resolve(),
  ]);
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await Promise.allSettled([
    pool.end(),
    redis.isOpen ? redis.quit() : Promise.resolve(),
  ]);
  process.exit(0);
});

start();
