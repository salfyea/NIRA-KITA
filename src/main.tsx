import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { StoreProvider } from './store';
import { App } from './App';
import { TourProvider } from './tour/TourContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <TourProvider>
          <App />
        </TourProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
