import type { Theme as AppTheme } from '@/styles/theme';
import '@emotion/react';

declare module '@emotion/react' {
  export type Theme = AppTheme;
}
