
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enregistrer le service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ KIKADI Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
