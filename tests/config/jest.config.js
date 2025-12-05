/** @type {import('jest').Config} */
// =============================================================================
// Jest Configuration for Unit, Component, Integration, and Contract Tests
// =============================================================================
// ARCHITECTURE EXPLANATION (for interviews):
// Jest is our primary test runner for JavaScript/TypeScript tests.
// This configuration handles multiple test types with different setups.
//
// WHY JEST:
// 1. Fast parallel test execution
// 2. Built-in mocking capabilities
// 3. Excellent TypeScript support
// 4. Rich ecosystem of matchers and reporters
// 5. Code coverage out of the box
// =============================================================================

const path = require('path');

module.exports = {
  // Root directory for tests (where test files are located)
  rootDir: path.resolve(__dirname, '../'),

  // Tell Jest where to find node_modules
  moduleDirectories: ['node_modules', '<rootDir>/node_modules'],

  // Test environment setup
  testEnvironment: 'node', // Default for API/backend tests

  // Projects configuration allows different environments for different test types
  projects: [
    {
      displayName: 'unit',
      rootDir: path.resolve(__dirname, '../'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/unit/**/*.test.ts', '<rootDir>/unit/**/*.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
    },
    {
      displayName: 'component',
      rootDir: path.resolve(__dirname, '../'),
      testEnvironment: 'jsdom', // Browser-like environment for React components
      testMatch: ['<rootDir>/component/**/*.test.tsx', '<rootDir>/component/**/*.spec.tsx'],
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              jsx: 'react',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
      },
    },
    {
      displayName: 'integration',
      rootDir: path.resolve(__dirname, '../'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/integration/**/*.test.ts', '<rootDir>/integration/**/*.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
    },
    {
      displayName: 'contract',
      rootDir: path.resolve(__dirname, '../'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/contract/**/*.pact.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
    },
  ],

  // Module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Path aliases (matching tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../app/src/$1',
    '^@services/(.*)$': '<rootDir>/../app/services/$1',
    '^@frontend/(.*)$': '<rootDir>/../app/frontend/src/$1',
    '^@fixtures/(.*)$': '<rootDir>/fixtures/$1',
  },

  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  coverageDirectory: '<rootDir>/../coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  collectCoverageFrom: [
    '../app/services/**/*.{ts,tsx}',
    '../app/frontend/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.config.{ts,js}',
    '!**/dist/**',
    '!**/build/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Test execution settings
  maxWorkers: '50%', // Use half of CPU cores for parallel execution
  testTimeout: 30000, // 30 seconds timeout (integration tests may take longer)
  verbose: true,

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/e2e/', '/cucumber/'],

  // Reporters for test results
  reporters: ['default'],

  // Global setup/teardown
  // globalSetup: '<rootDir>/config/jest.global-setup.js',
  // globalTeardown: '<rootDir>/config/jest.global-teardown.js',

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

// =============================================================================
// USAGE EXAMPLES (for your interview demo):
// =============================================================================
// Run all unit tests:
//   npm run test:unit
//
// Run component tests:
//   npm run test:component
//
// Run integration tests:
//   npm run test:integration
//
// Run with coverage:
//   npm run test:coverage
//
// Run in watch mode (for development):
//   npm run test:watch
//
// Run specific test file:
//   jest expenses.service.test.ts
//
// Run tests matching pattern:
//   jest --testNamePattern="should create expense"
//
// =============================================================================
