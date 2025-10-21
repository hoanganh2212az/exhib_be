import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();

app.use(helmet());
app.use(cors());

// Parse application/json và x-www-form-urlencoded
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(pinoHttp());

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// API routes
app.use('/api', routes);

// Errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
// eslint-disable-next-line no-console
console.log(`Server listening on http://localhost:${PORT}`);
});