import { theme } from '@/styles/theme';
import { useVehicleLinkValidation } from '@/hooks/useVehicleLinkValidation';
import * as styled from './VehicleLinkForm.styles';
import { Button, Input } from '../common';

type VehicleLinkFormProps = {
  onSubmit: (plateNumber: string, imei: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function VehicleLinkForm({ onSubmit, onCancel, isLoading }: VehicleLinkFormProps) {
  const { plateNumber, setPlateNumber, imei, setImei, errors, setErrors, validateAll } =
    useVehicleLinkValidation();

  const handleSubmit = () => {
    const isValid = validateAll();
    if (!isValid) return;
    onSubmit(plateNumber.trim(), imei.trim());
  };

  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlateNumber(e.target.value.replace(/\s+/g, ''));
    if (errors.plateNumberError) {
      setErrors((prev) => ({ ...prev, plateNumberError: null }));
    }
  };

  const handleImeiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/[^\d]/g, '');
    setImei(onlyDigits);
    if (errors.imeiError) {
      setErrors((prev) => ({ ...prev, imeiError: null }));
    }
  };

  return (
    <>
      <Input
        label="차량 번호"
        placeholder="차량 번호를 입력해 주세요."
        value={plateNumber}
        onChange={handlePlateNumberChange}
      />
      {errors.plateNumberError && <styled.ErrorText>{errors.plateNumberError}</styled.ErrorText>}
      <Input
        label="모뎀정보(IMEI)"
        placeholder="모뎀정보를 입력해 주세요."
        value={imei}
        onChange={handleImeiChange}
        inputMode="numeric"
        maxLength={15}
      />
      {errors.imeiError && <styled.ErrorText>{errors.imeiError}</styled.ErrorText>}
      <styled.ButtonBox>
        <Button label="등록 하기" onClick={handleSubmit} disabled={isLoading} />
        <Button
          label="취소"
          bgColor="transparent"
          textColor={theme.colors.neutral600}
          onClick={onCancel}
        />
      </styled.ButtonBox>
    </>
  );
}
