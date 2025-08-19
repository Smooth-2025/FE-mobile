import { useState } from 'react';
import { Button } from '@components/common';
import vehicleCharacter from '@/assets/images/vehicle-character.png';
import * as styled from './VehicleUnlinkedView.styles';
import VehicleLinkSheet from './VehicleLinkSheet';

export default function VehicleUnlinkedView() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <styled.ViewContainer>
        <styled.Message>아직 차량이 연동되지 않았어요!</styled.Message>
        <styled.Title>내 차량을 등록하세요</styled.Title>
        <styled.Image src={vehicleCharacter} alt="차량 미연동 캐릭터" />
        <Button label="연동하기" onClick={() => setOpen(true)} />
      </styled.ViewContainer>
      <VehicleLinkSheet isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
