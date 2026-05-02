export interface LogContext {
  [key: string]: unknown;
}

const write = (level: 'info' | 'warn' | 'error', message: string, context: LogContext = {}): void => {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...context
  };
  console[level](JSON.stringify(payload));
};

export const logger = {
  info: (message: string, context?: LogContext) => write('info', message, context),
  warn: (message: string, context?: LogContext) => write('warn', message, context),
  error: (message: string, context?: LogContext) => write('error', message, context)
};

export const logWorkerJobFailure = (jobName: string, error: unknown, context: LogContext = {}): void => {
  logger.error('worker_job_failed', {
    jobName,
    error: error instanceof Error ? error.message : String(error),
    ...context
  });
};
