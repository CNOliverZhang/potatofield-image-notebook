import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import 'react-photo-view/dist/react-photo-view.css';

import { ThemeProvider } from './contexts/theme';
import rootRoute from './routes';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  <ThemeProvider>
    <HashRouter>
      <Routes>
        {rootRoute.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </HashRouter>
  </ThemeProvider>,
);
