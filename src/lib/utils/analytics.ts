// Simple analytics wrapper
export const analytics = {
  pageView: (path: string) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      console.log(`[Analytics] Page view: ${path}`);
      // Add your analytics implementation here
    }
  },
  
  event: (category: string, action: string, label?: string) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      console.log(`[Analytics] Event: ${category} - ${action} ${label ? `(${label})` : ''}`);
      // Add your analytics implementation here
    }
  }
};