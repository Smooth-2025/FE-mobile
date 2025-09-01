import styled from '@emotion/styled';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;

  display: flex;
  align-items: flex-end; /* 하단 정렬 */
  justify-content: center;

  transition: background 240ms ease;
  &[data-state='closing'] {
    background: rgba(0, 0, 0, 0);
  }
`;

export const Sheet = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 36px 20px 16px;
  transform: translateY(100%);
  transition: transform 240ms ease;

  &[data-mounted='true'] {
    transform: translateY(0);
  }
  &[data-state='closing'] {
    transform: translateY(100%);
  }
`;

export const SheetBody = styled.div`
  max-height: inherit;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: anywhere;
`;
