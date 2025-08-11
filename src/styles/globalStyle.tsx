import { Global, css } from '@emotion/react';

export const GlobalStyle = () => (
  <Global
    styles={css`
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-Thin.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-Thin.woff') format('woff');
        font-weight: 100;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-ExtraLight.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-ExtraLight.woff') format('woff');
        font-weight: 200;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-Light.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-Light.woff') format('woff');
        font-weight: 300;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-Regular.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-Regular.woff') format('woff');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-Medium.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-Medium.woff') format('woff');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-SemiBold.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-SemiBold.woff') format('woff');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-Bold.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-Bold.woff') format('woff');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-ExtraBold.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-ExtraBold.woff') format('woff');
        font-weight: 800;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Pretendard';
        src:
          url('/src/assets/fonts/Pretendard-Black.woff2') format('woff2'),
          url('/src/assets/fonts/Pretendard-Black.woff') format('woff');
        font-weight: 900;
        font-style: normal;
        font-display: swap;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        font-family: 'Pretendard', sans-serif;
        background: #f9f9f9;
        color: #222;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button {
        font-family: inherit;
        cursor: pointer;
      }
    `}
  />
);
