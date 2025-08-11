import type { Theme as AppTheme } from '@styles/them';
import '@emotion/react';

declare module '@emotion/react' {
  export type Theme = AppTheme;
}
