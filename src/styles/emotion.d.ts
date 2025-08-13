import type { Theme as AppTheme } from '@styles/theme';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends AppTheme {
    readonly __themeBrand?: unique symbol;
  }
}
