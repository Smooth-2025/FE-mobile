import styled from '@emotion/styled';
import vehicleCar from '@/assets/images/vehicle-linked.png';
import { NAV_HEIGHT } from '@/layout/BottomNav';
import { HEADER_HEIGHT } from '@/layout/Header';

export default function VehicleLinkedView() {
  const ViewContainer = styled.div`
    width: 100%;
    height: ${`calc(100dvh - ${HEADER_HEIGHT}px - ${NAV_HEIGHT}px)`};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 80px 38px 0;
    text-align: left;
    box-sizing: border-box;
  `;
  const Title = styled.h2`
    margin: 12px 0;
    font-size: ${({ theme }) => theme.fontSize[24]};
    color: ${({ theme }) => theme.colors.neutral600};
    font-weight: bold;
    & span {
      color: ${({ theme }) => theme.colors.primary600};
      font-weight: bold;
    }
  `;
  const LinkedAt = styled.p`
    font-size: ${({ theme }) => theme.fontSize[16]};
    color: ${({ theme }) => theme.colors.neutral500};
    font-weight: 300;
    padding: 10px 0;
  `;
  const Image = styled.img`
    width: 250px;
    height: auto;
    margin: 30px auto;
  `;
  const UnlinkButton = styled.span`
    margin: 0 auto;
    font-size: ${({ theme }) => theme.fontSize[16]};
    color: ${({ theme }) => theme.colors.neutral500};
    text-decoration: underline;
    cursor: pointer;
  `;

  return (
    <ViewContainer>
      <Title>
        최수인님의 <br />
        <span>45가6847</span> 차량이 연결되었습니다
      </Title>
      <LinkedAt>2024.12.01 12:25</LinkedAt>
      <Image src={vehicleCar} alt="차량 연동" />
      <UnlinkButton>연동 해제</UnlinkButton>
    </ViewContainer>
  );
}
