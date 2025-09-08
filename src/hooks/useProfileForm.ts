import { useState, useEffect } from 'react';
import {
  validatePassword,
  validatePasswordConfirm,
  validateName,
  validatePhone,
  validateGender,
  formatPhoneNumber,
} from '@/utils/validation/profileValidation';
import type { ProfileFormData, ProfileFormErrors, ProfileFormSuccess } from '@/types/api';

export const useProfileForm = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    gender: '',
  });

  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});
  const [formSuccess, setFormSuccess] = useState<ProfileFormSuccess>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // 실시간 유효성 검사
  const handleInputChange =
    (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // 휴대폰 번호 포맷팅
      if (field === 'phone') {
        value = formatPhoneNumber(value);
      }

      setFormData((prev) => ({ ...prev, [field]: value }));

      // 터치된 필드만 실시간 검사
      if (touchedFields[field]) {
        validateField(field, value);
      }
    };

  // 필드별 유효성 검사
  const validateField = (field: keyof ProfileFormData, value: string) => {
    const newErrors = { ...formErrors };
    const newSuccess = { ...formSuccess };

    switch (field) {
      case 'password': {
        const passwordResult = validatePassword(value);
        if (passwordResult.error) {
          newErrors.password = passwordResult.error;
          delete newSuccess.password;
        } else {
          delete newErrors.password;
          newSuccess.password = passwordResult.success;
        }

        // 비밀번호 확인도 재검사
        if (formData.passwordConfirm && touchedFields.passwordConfirm) {
          const confirmResult = validatePasswordConfirm(formData.passwordConfirm, value);
          if (confirmResult.error) {
            newErrors.passwordConfirm = confirmResult.error;
            delete newSuccess.passwordConfirm;
          } else {
            delete newErrors.passwordConfirm;
            newSuccess.passwordConfirm = confirmResult.success;
          }
        }
        break;
      }

      case 'passwordConfirm': {
        const confirmResult = validatePasswordConfirm(value, formData.password);
        if (confirmResult.error) {
          newErrors.passwordConfirm = confirmResult.error;
          delete newSuccess.passwordConfirm;
        } else {
          delete newErrors.passwordConfirm;
          newSuccess.passwordConfirm = confirmResult.success;
        }
        break;
      }

      case 'name': {
        const nameError = validateName(value);
        if (nameError) {
          newErrors.name = nameError;
        } else {
          delete newErrors.name;
        }
        break;
      }

      case 'phone': {
        const phoneError = validatePhone(value);
        if (phoneError) {
          newErrors.phone = phoneError;
        } else {
          delete newErrors.phone;
        }
        break;
      }
    }

    setFormErrors(newErrors);
    setFormSuccess(newSuccess);
  };

  // 필드 터치 처리
  const handleFieldBlur = (field: keyof ProfileFormData) => () => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // 성별 선택
  const handleGenderSelect = (gender: 'MALE' | 'FEMALE') => {
    setFormData((prev) => ({ ...prev, gender }));
    setTouchedFields((prev) => ({ ...prev, gender: true }));

    // 성별 에러 제거
    const newErrors = { ...formErrors };
    delete newErrors.gender;
    setFormErrors(newErrors);
  };

  // 성별 에러 처리 (즉시 표시)
  useEffect(() => {
    if (touchedFields.gender) {
      const genderError = validateGender(formData.gender);
      if (genderError) {
        setFormErrors((prev) => ({ ...prev, gender: genderError }));
      }
    }
  }, [formData.gender, touchedFields.gender]);

  // 전체 유효성 검사
  const isFormValid = () => {
    const passwordValid = validatePassword(formData.password);
    const passwordConfirmValid = validatePasswordConfirm(
      formData.passwordConfirm,
      formData.password,
    );
    const nameValid = !validateName(formData.name);
    const phoneValid = !validatePhone(formData.phone);
    const genderValid = !validateGender(formData.gender);

    return (
      !passwordValid.error && !passwordConfirmValid.error && nameValid && phoneValid && genderValid
    );
  };

  return {
    formData,
    formErrors,
    formSuccess,
    touchedFields,
    handleInputChange,
    handleFieldBlur,
    handleGenderSelect,
    isFormValid,
  };
};
