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

// Resolve source directories for coverage (relative to this config file)
const appServicesDir = path.resolve(__dirname, '../../app/services');
const appFrontendDir = path.resolve(__dirname, '../../app/frontend/src');

module.exports = {
  // Root directory for tests (where test files are located)
  rootDir: path.resolve(__dirname, '../../'), // Changed to repo root for coverage

  // Roots - where Jest looks for tests and coverage
  roots: ['<rootDir>/tests', '<rootDir>/app'],

  // Tell Jest where to find node_modules - include both test and frontend dependencies
  moduleDirectories: [
    'node_modules',
    '<rootDir>/tests/node_modules',
    '<rootDir>/app/frontend/node_modules',
  ],

  // Test environment setup
  testEnvironment: 'node', // Default for API/backend tests

  // Projects configuration allows different environments for different test types
  projects: [
    {
      displayName: 'unit',
      rootDir: path.resolve(__dirname, '../../'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts', '<rootDir>/tests/unit/**/*.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/config/jest.setup.js'],
      collectCoverageFrom: [
        '<rootDir>/app/services/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/*.module.ts',
        '!**/main.ts',
        '!**/dist/**',
      ],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              module: 'esnext',
              moduleResolution: 'node',
              resolveJsonModule: true,
              skipLibCheck: true,
              baseUrl: path.resolve(__dirname, '../../'),
              paths: {
                bcrypt: [path.resolve(__dirname, '../node_modules/bcrypt')],
                '*': [path.resolve(__dirname, '../node_modules/*')],
              },
            },
          },
        ],
      },
      moduleNameMapper: {
        // Ensure modules resolve from tests/node_modules
        '^zustand$': '<rootDir>/tests/node_modules/zustand',
        // bcrypt uses manual mock from __mocks__ folder (jest.mock('bcrypt') in tests)
        '^bcrypt$': '<rootDir>/tests/unit/__mocks__/bcrypt.js',
      },
      globals: {
        'import.meta': {
          env: {
            VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3002',
            VITE_USE_MOCK_API: process.env.VITE_USE_MOCK_API || 'true',
          },
        },
      },
    },
    {
      displayName: 'component',
      rootDir: path.resolve(__dirname, '../../'),
      testEnvironment: 'jsdom', // Browser-like environment for React components
      testMatch: [
        '<rootDir>/tests/component/**/*.test.tsx',
        '<rootDir>/tests/component/**/*.spec.tsx',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/config/jest.setup.js'],
      collectCoverageFrom: [
        '<rootDir>/app/frontend/src/**/*.ts',
        '<rootDir>/app/frontend/src/**/*.tsx',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/main.tsx',
        '!**/vite-env.d.ts',
      ],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              jsx: 'react-jsx',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              module: 'esnext',
              moduleResolution: 'node',
              skipLibCheck: true,
              // Use repo root as baseUrl so paths resolve correctly
              baseUrl: path.resolve(__dirname, '../../'),
              // Tell TypeScript where to find type definitions
              typeRoots: [path.resolve(__dirname, '../node_modules/@types')],
              // Map module imports to tests/node_modules for CI isolation
              paths: {
                react: [path.resolve(__dirname, '../node_modules/react')],
                'react/*': [path.resolve(__dirname, '../node_modules/react/*')],
                'react-dom': [path.resolve(__dirname, '../node_modules/react-dom')],
                'react-dom/*': [path.resolve(__dirname, '../node_modules/react-dom/*')],
                'react-i18next': [path.resolve(__dirname, '../node_modules/react-i18next')],
              },
            },
          },
        ],
      },
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
        // Ensure single React instance for context to work
        '^react$': '<rootDir>/tests/node_modules/react',
        '^react/jsx-runtime$': '<rootDir>/tests/node_modules/react/jsx-runtime',
        '^react/jsx-dev-runtime$': '<rootDir>/tests/node_modules/react/jsx-dev-runtime',
        '^react-dom$': '<rootDir>/tests/node_modules/react-dom',
        '^react-dom/client$': '<rootDir>/tests/node_modules/react-dom/client',
        '^react-i18next$': '<rootDir>/tests/node_modules/react-i18next',
      },
    },
    {
      displayName: 'integration',
      rootDir: path.resolve(__dirname, '../../'),
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/tests/integration/**/*.test.ts',
        '<rootDir>/tests/integration/**/*.spec.ts',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/config/jest.setup.js'],
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
      rootDir: path.resolve(__dirname, '../../'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/contract/**/*.pact.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/config/jest.setup.js'],
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

  // Tell Jest where to find node_modules for frontend dependencies
  modulePaths: ['<rootDir>/tests/node_modules', '<rootDir>/app/frontend/node_modules'],

  // Path aliases (matching tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/src/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1',
    '^@frontend/(.*)$': '<rootDir>/app/frontend/src/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
  },

  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  coverageDirectory: '<rootDir>/tests/reports/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  // Note: Each project defines its own collectCoverageFrom
  // Root-level is fallback only - keep minimal to avoid transform conflicts
  collectCoverageFrom: [],
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
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/e2e/', '/bdd/'],

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
