// Runtime configuration helper
// Prioritizes runtime config (window.ENV) over build-time config (import.meta.env)

export const getAuthServiceUrl = (): string => {
  return (
    (window as any).ENV?.VITE_AUTH_SERVICE_URL ||
    import.meta.env.VITE_AUTH_SERVICE_URL ||
    'http://localhost:3001'
  );
};

export const getApiServiceUrl = (): string => {
  return (
    (window as any).ENV?.VITE_API_SERVICE_URL ||
    import.meta.env.VITE_API_SERVICE_URL ||
    'http://localhost:3002'
  );
};

export const getGoogleClientId = (): string => {
  return (
    (window as any).ENV?.VITE_GOOGLE_CLIENT_ID ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    ''
  );
};
