import styled from '@emotion/styled';
import type { ToastPosition } from './type';

export const ToastContainer = styled.div<{
  bg: string;
  border: string;
  position: ToastPosition;
}>`
  position: fixed;
  ${(props) => (props.position === 'top' ? 'top: 60px;' : 'bottom: 100px;')}
  left: 20px;
  right: 20px;
  background-color: ${(props) => props.bg};
  border: ${(props) => (props.border !== 'transparent' ? `2px solid ${props.border}` : 'none')};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  z-index: 99999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

export const IconWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastTitle = styled.div<{ color: string }>`
  font-weight: 700;
  font-size: 15px;
  color: ${(props) => props.color};
  line-height: 1.4;
`;

export const ToastContent = styled.div<{ color: string }>`
  font-size: 14px;
  color: ${(props) => props.color};
  margin-top: 2px;
  line-height: 1.5;
`;
