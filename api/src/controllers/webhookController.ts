import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import * as webhookService from '../services/webhookService';

export async function listWebhooks(req: Request, res: Response, next: NextFunction) {
  try {
    const webhooks = await webhookService.listWebhooks(req.supabase);
    res.json(webhooks);
  } catch (error) {
    next(error);
  }
}

export async function createWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const webhook = await webhookService.createWebhook(req.supabase, req.body);
    res.status(201).json(webhook);
  } catch (error) {
    next(error);
  }
}

export async function deleteWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await webhookService.deleteWebhook(req.supabase, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function handleWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const signature = req.headers['x-webhook-signature'];
    
    if (!signature) {
      throw new ApiError(400, 'Missing webhook signature');
    }

    await webhookService.processWebhook(req.supabase, id, signature.toString(), req.body);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
}