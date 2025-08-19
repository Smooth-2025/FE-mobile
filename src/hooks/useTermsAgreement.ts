import { useState } from 'react';
import type { AgreementState, UseTermsAgreementReturn } from '@/types/api';

export const useTermsAgreement = (): UseTermsAgreementReturn => {
  // 약관 동의 상태
  const [agreements, setAgreements] = useState<AgreementState>({
    allAgreed: false,
    termsOfService: false,
    privacyPolicy: false,
  });

  // 전체 동의 처리
  const handleAllAgreementChange = (checked: boolean) => {
    setAgreements({
      allAgreed: checked,
      termsOfService: checked,
      privacyPolicy: checked,
    });
  };

  // 개별 약관 동의 처리
  const handleIndividualAgreementChange =
    (key: keyof Omit<AgreementState, 'allAgreed'>) => (checked: boolean) => {
      const newAgreements = {
        ...agreements,
        [key]: checked,
      };

      // 전체 동의 상태 업데이트 (모든 필수 약관이 체크되었는지 확인)
      const allRequired = newAgreements.termsOfService && newAgreements.privacyPolicy;
      newAgreements.allAgreed = allRequired;

      setAgreements(newAgreements);
    };

  // 모든 필수 약관 동의 여부 확인
  const isAllRequiredAgreed = agreements.termsOfService && agreements.privacyPolicy;
  return {
    agreements,
    handleAllAgreementChange,
    handleIndividualAgreementChange,
    isAllRequiredAgreed,
  };
};
