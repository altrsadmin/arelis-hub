const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private level: number;

  constructor(level: LogLevel = 'INFO') {
    this.level = LOG_LEVELS[level];
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= this.level;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    // Only include data if it exists and is not empty
    let dataString = '';
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      if (Object.keys(cleanData).length > 0) {
        dataString = ` ${JSON.stringify(cleanData)}`;
      }
    }
    return `[${timestamp}] ${level}: ${message}${dataString}`;
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('DEBUG')) {
      if (message) console.debug(this.formatMessage('DEBUG', message, data));
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('INFO')) {
      if (message) console.info(this.formatMessage('INFO', message, data));
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('WARN')) {
      if (message) console.warn(this.formatMessage('WARN', message, data));
    }
  }

  error(message: string, error?: Error, data?: any) {
    if (this.shouldLog('ERROR')) {
      const errorData = {
        ...(error?.message && error.message !== '' ? { error: error.message } : {}),
        ...(data || {})
      };
      if (message && message !== '' && Object.keys(errorData).length > 0) {
        console.error(this.formatMessage('ERROR', message, errorData));
      }
    }
  }
}

export const logger = new Logger(
  import.meta.env.VITE_APP_ENV === 'production' ? 'INFO' : 'DEBUG'
);