import { Router } from 'express';
import { validateSchema } from '../middleware/validation';
import { createWebhookSchema } from '../schemas/webhook';
import * as webhookController from '../controllers/webhookController';

const router = Router();

router.get('/', webhookController.listWebhooks);
router.post('/', validateSchema(createWebhookSchema), webhookController.createWebhook);
router.delete('/:id', webhookController.deleteWebhook);
router.post('/receive/:id', webhookController.handleWebhook);

export default router;