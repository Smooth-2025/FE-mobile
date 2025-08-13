import styled from '@emotion/styled';
import { NAV_HEIGHT } from '@/layout/BottomNav';
import { HEADER_HEIGHT } from '@/layout/Header';
import { Button } from '@components/common';
import vehicleCharacter from '@/assets/images/vehicle-character.png';

const ViewContainer = styled.div`
  width: 100%;
  height: ${`calc(100dvh - ${HEADER_HEIGHT}px - ${NAV_HEIGHT}px)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 38px;
  text-align: left;
  box-sizing: border-box;
`;

const Title = styled.h2`
  margin: 12px 0;
  font-size: ${({ theme }) => theme.fontSize[24]};
  color: ${({ theme }) => theme.colors.neutral600};
  font-weight: bold;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: ${({ theme }) => theme.fontSize[16]};
`;

const Image = styled.img`
  width: 190px;
  height: auto;
  margin: 68px auto;
`;

export default function VehicleUnlinkedView() {
  return (
    <ViewContainer>
      <Message>아직 차량이 연동되지 않았어요!</Message>
      <Title>내 차량을 등록하세요</Title>
      <Image src={vehicleCharacter} alt="차량 미연동 캐릭터" />
      <Button label="연동하기" />
    </ViewContainer>
  );
}
