import { useState } from 'react';
import styled from '@emotion/styled';
import { NAV_HEIGHT } from '@/layout/BottomNav';
import { HEADER_HEIGHT } from '@/layout/Header';
import { Button, Input } from '@components/common';
import { theme } from '@/styles/theme';
import GlobalBottomSheet from '@/components/GlobalBottomSheet';
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
const SheetTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize[22]};
  font-weight: bold;
`;
const SheetSubTitle = styled.p`
  color: ${({ theme }) => theme.colors.neutral500};
  font-size: ${({ theme }) => theme.fontSize[16]};
  margin: 12px 0 20px;
  line-height: 22px;
`;
const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 0px;
`;

export default function VehicleUnlinkedView() {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <ViewContainer>
        <Message>아직 차량이 연동되지 않았어요!</Message>
        <Title>내 차량을 등록하세요</Title>
        <Image src={vehicleCharacter} alt="차량 미연동 캐릭터" />
        <Button label="연동하기" onClick={handleOpen} />
      </ViewContainer>

      <GlobalBottomSheet
        isOpen={open}
        onClose={handleClose}
        backdropClosable
        ariaLabel="차량 연동 해제"
        maxHeight="70dvh"
      >
        {({ requestClose }) => (
          <>
            <SheetTitle>차량 등록</SheetTitle>
            <SheetSubTitle>
              차량 번호와 모뎀(IMEI) 정보를 입력하면 <br /> 서비스와 차량이 연동됩니다.
            </SheetSubTitle>
            <Input label="차량 번호" placeholder="차량 번호를 입력해 주세요." />
            <Input label="모뎀정보(IMEI)" placeholder="모뎀정보를 입력해 주세요." />
            <ButtonBox>
              <Button label="등록 하기" />
              <Button
                label="취소"
                bgColor="transparent"
                textColor={theme.colors.neutral600}
                onClick={requestClose}
              />
            </ButtonBox>
          </>
        )}
      </GlobalBottomSheet>
    </>
  );
}
