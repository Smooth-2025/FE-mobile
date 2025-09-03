import styled from '@emotion/styled';

export const Character = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral500};
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  pointer-events: none;
`;

export const CharacterImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;
