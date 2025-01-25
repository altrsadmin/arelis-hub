export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const API_URL = import.meta.env.VITE_API_URL;

export const ENABLE_ANALYTICS = false;
export const ENABLE_ERROR_REPORTING = false;

export const IS_PRODUCTION = false;

export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  AGENTS: '/agents',
  WORKFLOWS: '/workflows',
  CUSTOMERS: '/customers',
  CONNECTORS: '/connectors',
  SETTINGS: '/settings',
} as const;