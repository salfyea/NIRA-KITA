import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { StoreProvider } from './store';
import { App } from './App';
import { TourProvider } from './tour/TourContext';
import { LangRoot } from './i18n';
import { registerServiceWorker } from './lib/pwa';

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <TourProvider>
          <LangRoot>
            <App />
          </LangRoot>
        </TourProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
