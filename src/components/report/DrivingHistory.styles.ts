import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding: 0 18px 30px;
`;

export const TabWrapper = styled.nav`
  margin: 24px 0 30px;
  overflow: hidden;
`;

export const TabList = styled.ul`
  display: flex;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary600 : theme.colors.neutral200};
  padding: 8px 16px;
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.neutral500)};
  cursor: pointer;
  border-radius: 10px;
`;

export const TabIndicator = styled.span<{ $index: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: calc(100% / 3);
  background: ${({ theme }) => theme.colors.primary600};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 200ms ease;
`;

export const DateTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 10px;
  font-weight: 500;
`;
