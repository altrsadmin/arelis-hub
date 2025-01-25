import { z } from 'zod';

export const updateAgentStatusSchema = z.object({
  status: z.enum(['active', 'paused', 'stopped'])
});