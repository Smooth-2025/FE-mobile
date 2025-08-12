import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@styles/theme.ts';
import AppRouter from '@routes/index';
import { store } from '@store/index.ts';
import ViewportGate from './layout/ViewportGate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ViewportGate>
          <AppRouter />
        </ViewportGate>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
