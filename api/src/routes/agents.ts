import { Router } from 'express';
import { validateSchema } from '../middleware/validation';
import { updateAgentStatusSchema } from '../schemas/agent';
import * as agentController from '../controllers/agentController';

const router = Router();

router.get('/', agentController.listAgents);
router.get('/:uuid', agentController.getAgent);
router.patch('/:uuid/status', validateSchema(updateAgentStatusSchema), agentController.updateAgentStatus);
router.get('/:uuid/metrics', agentController.getAgentMetrics);

export default router;