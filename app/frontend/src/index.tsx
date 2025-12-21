import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Initialize the application with optional Mock Service Worker (MSW)
 */
async function initializeApp() {
  // Check if mock API is enabled via environment variable
  const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

  if (useMockApi) {
    console.log('[App] Initializing with Mock API...');
    const { startMockWorker } = await import('./mocks/browser');
    await startMockWorker();
  } else {
    console.log('[App] Using real API backend');
  }

  // Render the React app
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// Start the application
initializeApp().catch((error) => {
  console.error('[App] Failed to initialize:', error);
});
