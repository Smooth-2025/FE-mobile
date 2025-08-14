import type { ValidationResult } from '@/types/api';

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { error: '비밀번호를 입력해주세요.' };
  }
  if (password.length < 8 || password.length > 16) {
    return { error: '비밀번호 8~16자를 입력해주세요.' };
  }
  return { success: '사용가능한 비밀번호 입니다.' };
};

export const validatePasswordConfirm = (passwordConfirm: string, password: string): ValidationResult => {
  if (!passwordConfirm) {
    return { error: '비밀번호 확인을 입력해주세요.' };
  }
  if (passwordConfirm !== password) {
    return { error: '비밀번호가 일치하지 않아요' };
  }
  return { success: '비밀번호가 일치 합니다.' };
};

export const validateName = (name: string): string => {
  if (!name.trim()) {
    return '이름을 다시 확인해주세요.';
  }
  return '';
};

export const validatePhone = (phone: string): string => {
  const phoneRegex = /^010\d{8}$/;
  if (!phone) {
    return '휴대폰 번호를 입력해주세요.';
  }
  if (!phoneRegex.test(phone.replace(/-/g, ''))) {
    return '휴대폰 번호를 다시 확인해주세요.';
  }
  return '';
};

export const validateGender = (gender: string): string => {
  if (!gender) {
    return '성별을 선택해주세요.';
  }
  return '';
};

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length <= 11) {
    if (cleaned.length > 6) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length > 3) {
      return cleaned.replace(/(\d{3})(\d{4})/, '$1-$2');
    }
  }
  return cleaned;
};