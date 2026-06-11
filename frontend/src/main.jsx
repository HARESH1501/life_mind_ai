import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global error handler to prevent unhandled promises from crashing the dev server
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection caught globally:', event.reason);
  // Optional: prevent default if you don't want the error to bubble up further
  // event.preventDefault();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
