import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const Container = styled.div`
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  height: 100%;
  background-color: ${theme.colors.white};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: stretch;
`;

export const TitleSection = styled.div`
  margin-bottom: 0px;
  width: 100%;
  text-align: left;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  color: ${theme.colors.neutral700};
  line-height: 1.3;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 50px;
  color: ${theme.colors.neutral500};
  line-height: 1.5;
`;

export const IllustrationWrapper = styled.div`
  margin: 0;
  position: relative;
  text-align: center;
`;

export const GiftBox = styled.div`
  font-size: 120px;
  margin-bottom: 50px;
  position: relative;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

export const Confetti = styled.div`
  display: none;
`;

export const ConfirmButton = styled.button`
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  transition: all 0.2s ease;
  margin: 24px auto 0 auto;
  display: block;

  background-color: ${theme.colors.primary600};
  color: ${theme.colors.white};

  &:hover {
    background-color: ${theme.colors.primary600};
  }

  &:active {
    transform: translateY(1px);
  }
`;
