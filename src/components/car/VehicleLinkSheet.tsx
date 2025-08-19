import { useLinkVehicleMutation } from '@/store/vehicle/vehicleApi';
import BottomSheetPortal from '@/components/BottomSheetPortal';
import VehicleLinkForm from './VehicleLinkForm';
import * as styled from './VehicleLinkSheet.styles';

export default function VehicleLinkSheet(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;
  const [linkVehicle, { isLoading }] = useLinkVehicleMutation();

  return (
    <BottomSheetPortal
      isOpen={isOpen}
      onClose={onClose}
      backdropClosable
      ariaLabel="차량 연동"
      maxHeight="70dvh"
    >
      {({ requestClose }) => (
        <>
          <styled.SheetTitle>차량 등록</styled.SheetTitle>
          <styled.SheetSubTitle>
            차량 번호와 모뎀(IMEI) 정보를 입력하면 <br /> 서비스와 차량이 연동됩니다.
          </styled.SheetSubTitle>
          <VehicleLinkForm
            onSubmit={(plateNumber, imei) => {
              linkVehicle({ plateNumber, imei });
            }}
            onCancel={requestClose}
            isLoading={isLoading}
          />
        </>
      )}
    </BottomSheetPortal>
  );
}
