import { useCallback, useState } from 'react';
import { validateImei, validatePlateNumber } from '@/utils/validation/vehicle';

export function useVehicleLinkValidation() {
  const [plateNumber, setPlateNumber] = useState('');
  const [imei, setImei] = useState('');
  const [errors, setErrors] = useState<{
    plateNumberError: string | null;
    imeiError: string | null;
  }>({
    plateNumberError: null,
    imeiError: null,
  });

  const validateAll = useCallback(() => {
    const plateNumberError = validatePlateNumber(plateNumber);
    const imeiError = validateImei(imei);
    setErrors({ plateNumberError, imeiError });
    return !plateNumberError && !imeiError;
  }, [plateNumber, imei]);

  return { plateNumber, setPlateNumber, imei, setImei, errors, setErrors, validateAll };
}
