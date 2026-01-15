// Jest Setup File (moved up to tests/)

// Global utilities and setup
global.testUtils = global.testUtils || {};

// Mock import.meta for Vite compatibility
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3002',
        VITE_USE_MOCK_API: process.env.VITE_USE_MOCK_API || 'true',
      },
    },
  },
  writable: true,
  configurable: true,
});

console.log('Jest setup (tests/jest.setup.js) complete');
