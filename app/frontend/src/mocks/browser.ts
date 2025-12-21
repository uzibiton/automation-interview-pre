/**
 * MSW browser setup for mocking API requests in development
 *
 * This file initializes Mock Service Worker (MSW) for the browser environment.
 * It intercepts HTTP requests and returns mock responses based on defined handlers.
 */

import { setupWorker } from 'msw/browser';
import { groupHandlers } from './handlers/groupHandlers';
import { invitationHandlers } from './handlers/invitationHandlers';

/**
 * Setup MSW worker with all handlers
 */
export const worker = setupWorker(...groupHandlers, ...invitationHandlers);

/**
 * Start the worker with custom configuration
 * - onUnhandledRequest: 'bypass' - Let unhandled requests pass through to the real API
 */
export const startMockWorker = async () => {
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false, // Log intercepted requests to console
  });
  console.log('[MSW] Mock API worker started successfully');
};
