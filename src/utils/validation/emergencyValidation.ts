export const validateEmergencyContact = (contact: string): string => {
  if (!contact) {
    return ''; // 선택사항이므로 빈 값은 에러 없음
  }
  
  const phoneRegex = /^010\d{8}$/;
  if (!phoneRegex.test(contact.replace(/-/g, ''))) {
    return '010 포함 11자리 숫자를 입력해주세요.';
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