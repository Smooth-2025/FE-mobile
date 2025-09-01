import styled from '@emotion/styled';
import { NAV_HEIGHT } from '@/layout/BottomNav';
import { HEADER_HEIGHT } from '@/layout/Header';

export const ViewContainer = styled.div`
  width: 100%;
  height: ${`calc(100dvh - ${HEADER_HEIGHT}px - ${NAV_HEIGHT}px)`};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 80px 38px 0;
  text-align: left;
  box-sizing: border-box;
`;
export const Title = styled.h2`
  margin: 12px 0;
  font-size: ${({ theme }) => theme.fontSize[24]};
  color: ${({ theme }) => theme.colors.neutral600};
  font-weight: bold;
  & span {
    color: ${({ theme }) => theme.colors.primary600};
    font-weight: bold;
  }
`;
export const LinkedAt = styled.p`
  font-size: ${({ theme }) => theme.fontSize[16]};
  color: ${({ theme }) => theme.colors.neutral500};
  font-weight: 300;
  padding: 10px 0;
`;
export const Image = styled.img`
  width: 250px;
  height: auto;
  margin: 30px auto;
`;
export const UnlinkButton = styled.button`
  margin: 0 auto;
  font-size: ${({ theme }) => theme.fontSize[16]};
  color: ${({ theme }) => theme.colors.neutral500};
  text-decoration: underline;
  cursor: pointer;

  &:disabled {
    text-decoration: none;
    cursor: default;
    opacity: 0.5;
  }
`;
