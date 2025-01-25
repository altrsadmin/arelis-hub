import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from './middleware/auth';
import { errorHandler } from './middleware/error';
import agentRoutes from './routes/agents';
import webhookRoutes from './routes/webhooks';
import { setupWebhookProcessor } from './services/webhookProcessor';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Make supabase client available in requests
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// API key validation for all routes except webhooks
app.use('/v1/(?!webhooks/receive)', validateApiKey);

// Routes
app.use('/v1/agents', agentRoutes);
app.use('/v1/webhooks', webhookRoutes);

// Error handling
app.use(errorHandler);

// Start webhook processor
setupWebhookProcessor(supabase);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});