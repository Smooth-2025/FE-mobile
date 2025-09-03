import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background-color: rgba(220, 53, 69, 0.9);
  border-radius: 8px;
  color: white;
  font-family: Arial, sans-serif;
  max-width: 400px;
  text-align: center;
  z-index: 1000;
`;

export const Icon = styled.div`
  font-size: 24px;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

export const Message = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

export const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  color: ${({ theme }) => theme.colors.danger600};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent_pink};
  }
`;
