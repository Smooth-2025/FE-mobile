import styled from '@emotion/styled';

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  z-index: 9999;
  display: flex;
  flex-direction: column;
`;

export default function DriveOverlayPage() {
  return (
    <OverlayContainer>
      <h1>Drive Overlay</h1>
    </OverlayContainer>
  );
}
