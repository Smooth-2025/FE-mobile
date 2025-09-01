import styled from '@emotion/styled';
import { NAV_HEIGHT } from '@/layout/BottomNav';
import { HEADER_HEIGHT } from '@/layout/Header';

export const ViewContainer = styled.div`
  width: 100%;
  height: ${`calc(100dvh - ${HEADER_HEIGHT}px - ${NAV_HEIGHT}px)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 38px;
  text-align: left;
  box-sizing: border-box;
`;

export const Title = styled.h2`
  margin: 12px 0;
  font-size: ${({ theme }) => theme.fontSize[24]};
  color: ${({ theme }) => theme.colors.neutral600};
  font-weight: bold;
`;

export const Message = styled.p`
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: ${({ theme }) => theme.fontSize[16]};
`;

export const Image = styled.img`
  width: 190px;
  height: auto;
  margin: 68px auto;
`;
