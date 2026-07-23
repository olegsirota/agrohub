import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import VideoGate from './components/VideoGate.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VideoGate>
      <HashRouter>
        <App />
      </HashRouter>
    </VideoGate>
  </StrictMode>,
);
