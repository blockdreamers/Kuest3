export const isPreview =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("local-credentialless.webcontainer-api.io") ||
  window !== window.parent;

export const isDevelopment = 
  import.meta.env.VITE_APP_ENV === 'development' ||
  window.location.hostname.includes('dev.kuest3.com');

export const isProduction = 
  import.meta.env.VITE_APP_ENV === 'production' ||
  window.location.hostname === 'kuest3.com';