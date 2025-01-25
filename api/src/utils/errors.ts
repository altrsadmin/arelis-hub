export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = 'api_error',
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}