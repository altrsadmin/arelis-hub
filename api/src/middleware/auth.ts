import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new ApiError(401, 'No API key provided');
    }

    const [type, key] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new ApiError(401, 'Invalid authorization type');
    }

    if (!key) {
      throw new ApiError(401, 'No API key provided');
    }

    // Validate API key against database
    const { data: apiKey, error } = await req.supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .single();

    if (error || !apiKey) {
      throw new ApiError(401, 'Invalid API key');
    }

    // Store API key info in request
    req.apiKey = apiKey;
    next();
  } catch (error) {
    next(error);
  }
}