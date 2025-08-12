import styled from '@emotion/styled';
import { Icon } from '@/components/common';
import { flexBetween, flexCenter, horizontalPadding } from '@/styles/mixins';
import { theme } from '@/styles/theme';

export const HEADER_HEIGHT = 60;

const HeaderContainer = styled.header<{ $bgColor?: string }>`
  ${flexBetween}
  ${horizontalPadding.layout_Base}

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  z-index: 1000;

  background-color: ${({ theme, $bgColor }) => $bgColor || theme.colors.white};
  border-bottom: ${({ theme, $bgColor }) =>
    $bgColor === 'transparent' ? 'none' : `1px solid ${theme.colors.neutral100}`};
`;

const HeaderOffset = styled.div`
  height: ${HEADER_HEIGHT}px;
`;

const LeftArea = styled.div`
  ${flexCenter}
  cursor: pointer;
  min-width: 40px;
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize[18]};
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral700};
`;

const Logo = styled.h1`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize[22]};
  font-weight: 800;
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral700};
`;

const RightArea = styled.div`
  min-width: 40px;
`;

type HeaderProps = {
  type: 'logo' | 'back' | 'close';
  title?: string;
  onLeftClick?: () => void;
  IconColor?: string;
  bgColor?: string;
  withOffset?: boolean;
};

export default function Header({
  type,
  title,
  onLeftClick,
  IconColor = theme.colors.neutral700,
  bgColor,
  withOffset = true,
}: HeaderProps) {
  return (
    <>
      <HeaderContainer $bgColor={bgColor}>
        <LeftArea onClick={onLeftClick}>
          {type === 'back' && <Icon name="chevronLeft" color={IconColor} />}
          {type === 'close' && <Icon name="close" color={IconColor} />}
          {type === 'logo' && <Logo>smooth</Logo>}
        </LeftArea>

        <Title>{title}</Title>

        <RightArea />
      </HeaderContainer>

      {withOffset && <HeaderOffset aria-hidden="true" />}
    </>
  );
}
