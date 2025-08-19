export const validatePlateNumber = (value: string): string | null => {
  const v = value.trim();
  if (v.length < 6 || v.length > 20) return '차량번호 형식이 올바르지 않습니다.';
  if (!/^\d{2,3}[가-힣]\d{3,4}$/.test(v)) {
    return '차량번호 형식이 올바르지 않습니다.';
  }
  return null;
};

export const validateImei = (value: string): string | null => {
  const v = value.trim();
  if (!/^\d{15}$/.test(v)) return 'IMEI는 15자리 숫자여야 합니다.';
  return null;
};
