// Simplified performance metrics reporting
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Log performance metrics to console in development
    if (import.meta.env.DEV) {
      const logMetric = (name: string, value: number) => {
        console.log(`Performance Metric - ${name}: ${value}`);
        onPerfEntry({ name, value });
      };

      // Basic performance metrics using Performance API
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          logMetric(entry.name, entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['paint', 'navigation'] });
    }
  }
};