import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

export const TitleSection = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${theme.colors.neutral700};
  line-height: 1.3;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.neutral600};
  line-height: 1.5;
`;

export const IllustrationWrapper = styled.div`
  margin: 40px 0;
  position: relative;
`;

export const GiftBox = styled.div`
  font-size: 120px;
  position: relative;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
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
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 100px;
  
  &::before,
  &::after {
    content: '🎉';
    position: absolute;
    font-size: 24px;
    animation: confetti 3s ease-in-out infinite;
  }
  
  &::before {
    left: -30px;
    animation-delay: 0.5s;
  }
  
  &::after {
    right: -30px;
    animation-delay: 1s;
  }
  
  @keyframes confetti {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: translateY(-30px) rotate(180deg);
      opacity: 0.8;
    }
    100% {
      transform: translateY(0) rotate(360deg);
      opacity: 1;
    }
  }
`;

export const ConfirmButton = styled.button`
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 40px;
  
  background-color: ${theme.colors.primary500};
  color: #ffffff;
  
  &:hover {
    background-color: ${theme.colors.primary600};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;