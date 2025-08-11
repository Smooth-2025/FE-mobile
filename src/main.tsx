import { ThemeProvider } from '@emotion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import AppRouter from '@routes/index';
import { store } from '@store/index.ts';
import { theme } from '@styles/theme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
