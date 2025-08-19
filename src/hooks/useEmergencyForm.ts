import { useState } from 'react';
import {
  validateEmergencyContact,
  formatPhoneNumber,
} from '@/utils/validation/emergencyValidation';
import type { EmergencyFormData, EmergencyFormErrors, UseEmergencyFormReturn } from '@/types/api';

export const useEmergencyForm = (): UseEmergencyFormReturn => {
  const [formData, setFormData] = useState<EmergencyFormData>({
    bloodType: '',
    emergencyContact1: '',
    emergencyContact2: '',
    emergencyContact3: '',
  });

  const [formErrors, setFormErrors] = useState<EmergencyFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // 입력 변경 처리
  const handleInputChange =
    (field: keyof EmergencyFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // 긴급연락처 포맷팅
      if (field.includes('emergencyContact')) {
        value = formatPhoneNumber(value);
      }

      setFormData((prev) => ({ ...prev, [field]: value }));

      // 터치된 필드만 실시간 검사
      if (touchedFields[field]) {
        validateField(field, value);
      }
    };

  // 혈액형 선택
  const handleBloodTypeSelect = (bloodType: 'A' | 'B' | 'O' | 'AB') => {
    setFormData((prev) => ({ ...prev, bloodType }));
  };

  // 필드 터치 처리
  const handleFieldBlur = (field: keyof EmergencyFormData) => () => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // 필드별 유효성 검사
  const validateField = (field: keyof EmergencyFormData, value: string) => {
    const newErrors = { ...formErrors };

    if (field.includes('emergencyContact')) {
      const error = validateEmergencyContact(value);
      if (error) {
        newErrors[field as keyof EmergencyFormErrors] = error;
      } else {
        delete newErrors[field as keyof EmergencyFormErrors];
      }
    }

    setFormErrors(newErrors);
  };

  return {
    formData,
    formErrors,
    handleInputChange,
    handleBloodTypeSelect,
    handleFieldBlur,
  };
};
