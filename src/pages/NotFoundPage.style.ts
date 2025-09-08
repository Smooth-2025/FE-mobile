import styled from '@emotion/styled';

export const Main = styled.main`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
`;

export const Description = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.neutral500};
  margin: 0;
`;

export const BackButton = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary500};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary600};
  }
`;
