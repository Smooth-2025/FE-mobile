import styled from '@emotion/styled';

export const ButtonWrapper = styled.button<{ size: 'sm' | 'md' | 'lg' }>`
  padding: 16px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
        `;
      case 'lg':
        return `
          width: 100%;
          padding: 12px 24px;
          font-size: 16px;
        `;
      case 'md':
      default:
        return `
        `;
    }
  }}
`;

export const ButtonText = styled.span`
  font-size: 16px;
`;
