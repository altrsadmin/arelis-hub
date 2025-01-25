import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import * as agentService from '../services/agentService';

export async function listAgents(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, customer_id, page = 1, per_page = 20 } = req.query;
    
    const agents = await agentService.listAgents(req.supabase, {
      status: status as string,
      customerId: customer_id as string,
      page: Number(page),
      perPage: Number(per_page)
    });

    res.json(agents);
  } catch (error) {
    next(error);
  }
}

export async function getAgent(req: Request, res: Response, next: NextFunction) {
  try {
    const { uuid } = req.params;
    
    const agent = await agentService.getAgent(req.supabase, uuid);
    
    if (!agent) {
      throw new ApiError(404, 'Agent not found');
    }

    res.json(agent);
  } catch (error) {
    next(error);
  }
}

export async function updateAgentStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { uuid } = req.params;
    const { status } = req.body;
    
    const agent = await agentService.updateAgentStatus(req.supabase, uuid, status);
    
    res.json(agent);
  } catch (error) {
    next(error);
  }
}

export async function getAgentMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    const { uuid } = req.params;
    
    const metrics = await agentService.getAgentMetrics(req.supabase, uuid);
    
    res.json(metrics);
  } catch (error) {
    next(error);
  }
}