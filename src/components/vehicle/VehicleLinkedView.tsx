import { useState } from 'react';
import vehicleCar from '@/assets/images/vehicle-linked.png';
import { useUnlinkVehicleMutation } from '@/store/vehicle/vehicleApi';
import AlertToast from '../common/AlertToast/AlertToast';
import * as styled from './VehicleLinkedView.styles';
import type { BackendError, VehicleInfo } from '@/store/vehicle/type';

type VehicleLinkedViewProps = {
  vehicle: VehicleInfo;
};

export default function VehicleLinkedView({ vehicle }: VehicleLinkedViewProps) {
  const [toast, setToast] = useState<null | {
    type: 'success' | 'error';
    content: string;
  }>(null);
  const [unlinkVehicle, { isLoading: unlinking }] = useUnlinkVehicleMutation();

  const handleUnlink = async () => {
    try {
      await unlinkVehicle().unwrap();
      setToast({ type: 'success', content: '연동이 해제되었습니다.' });
    } catch (e) {
      const err = e as { status: number; data?: BackendError };
      const msg = err.data?.message ?? '알 수 없는 이유로 연동 해제에 실패했습니다.';
      setToast({ type: 'error', content: msg });
    }
  };

  return (
    <styled.ViewContainer>
      <styled.Title>
        {vehicle.userName}님의 <br />
        <span>{vehicle.plateNumber}</span> 차량이 연결되었습니다
      </styled.Title>
      <styled.LinkedAt>{vehicle.linkedAt}</styled.LinkedAt>
      <styled.Image src={vehicleCar} alt="차량 연동" />
      <styled.UnlinkButton onClick={() => handleUnlink()} disabled={unlinking}>
        {unlinking ? '연동 해제 중...' : '연동 해제'}
      </styled.UnlinkButton>
      {toast && <AlertToast type={toast.type} content={toast.content} />}
    </styled.ViewContainer>
  );
}
