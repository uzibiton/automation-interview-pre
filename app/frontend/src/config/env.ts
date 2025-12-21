/**
 * Environment configuration
 * Provides a unified interface for environment variables
 * Works in both Vite (browser) and Jest (Node) environments
 */

interface EnvironmentConfig {
  API_BASE_URL: string;
  USE_MOCK_API: boolean;
}

function getEnvironmentConfig(): EnvironmentConfig {
  // In Jest/Node environment (check for process first)
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return {
      API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3002',
      USE_MOCK_API: process.env.VITE_USE_MOCK_API === 'true',
    };
  }

  // In Vite/Browser environment
  return {
    // @ts-expect-error - import.meta.env is available in Vite
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
    // @ts-expect-error - import.meta.env is available in Vite
    USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  };
}

export const env = getEnvironmentConfig();
