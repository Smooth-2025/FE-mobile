import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { getUserProfile, updateEmergencyInfo } from '@/apis/auth';
import {
  validateEmergencyContact,
  formatPhoneNumber,
} from '@/utils/validation/emergencyValidation';
import AlertToast from '@/components/common/AlertToast/AlertToast';
import { Input } from '@/components/common/Input';
import Header from '@/layout/Header';
import * as S from '@/components/myPage/EmergencyEditPage.styles';
import type {
  UpdateEmergencyInfoRequest,
  EmergencyFormData,
  EmergencyFormErrors,
} from '@/types/api';

export default function EmergencyEditPage() {
  const navigate = useNavigate();
  const { showError, toasts } = useToast();

  // 초기 데이터 로딩 상태
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState<EmergencyFormData>({
    bloodType: '',
    emergencyContact1: '',
    emergencyContact2: '',
    emergencyContact3: '',
  });

  const [formErrors, setFormErrors] = useState<EmergencyFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // showError를 useCallback으로 memoization
  const showErrorCallback = useCallback(showError, [showError]);

  // 사용자 프로필 조회 및 초기값 설정
  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        setIsInitialLoading(true);
        const response = await getUserProfile();
        if (isMounted) {
          const profile = response.data;
          setFormData({
            bloodType: profile.bloodType || '',
            emergencyContact1: profile.emergencyContact1
              ? formatPhoneNumber(profile.emergencyContact1)
              : '',
            emergencyContact2: profile.emergencyContact2
              ? formatPhoneNumber(profile.emergencyContact2)
              : '',
            emergencyContact3: profile.emergencyContact3
              ? formatPhoneNumber(profile.emergencyContact3)
              : '',
          });
        }
      } catch {
        if (isMounted) {
          showErrorCallback('사용자 정보를 불러올 수 없습니다.');
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [showErrorCallback]);

  // 뒤로가기
  const handleGoBack = () => {
    navigate('/mypage/emergency');
  };

  // 혈액형 선택
  const handleBloodTypeSelect = (bloodType: 'A' | 'B' | 'O' | 'AB') => {
    setFormData((prev) => ({ ...prev, bloodType }));
  };

  // 입력값 변경
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

  // 필드 포커스 해제 시
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

  // 폼 유효성 검사 (에러가 없으면 유효)
  const isFormValid = () => {
    return Object.keys(formErrors).length === 0;
  };

  // 응급정보 저장
  const handleSubmit = async () => {
    if (!isFormValid() || isSubmitLoading) return;

    try {
      setIsSubmitLoading(true);

      const requestData: UpdateEmergencyInfoRequest = {
        bloodType: formData.bloodType || null, // 빈 값일 때 null로 전송
        emergencyContact1: formData.emergencyContact1
          ? formData.emergencyContact1.replace(/-/g, '')
          : null,
        emergencyContact2: formData.emergencyContact2
          ? formData.emergencyContact2.replace(/-/g, '')
          : null,
        emergencyContact3: formData.emergencyContact3
          ? formData.emergencyContact3.replace(/-/g, '')
          : null,
      };

      await updateEmergencyInfo(requestData);

      navigate('/mypage/emergency', {
        state: { successMessage: '응급정보가 수정되었습니다.' },
      });
    } catch (error) {
      console.error('응급정보 수정 실패:', error);

      // API 에러 메시지 처리
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '응급정보 수정에 실패했습니다.';
      showError(errorMessage);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <S.Container>
        <Header type="back" title="응급정보 수정" onLeftClick={handleGoBack} />
        <S.LoadingContainer>
          <S.LoadingText>응급정보를 불러오는 중...</S.LoadingText>
        </S.LoadingContainer>
      </S.Container>
    );
  }

  return (
    <>
      <S.Container>
        {/* 헤더 */}
        <Header type="back" title="응급정보 수정" onLeftClick={handleGoBack} />
        <S.Title>응급 정보를 입력해주세요</S.Title>
        <S.Subtitle>등록된 연락처로 사고 발생 알림 문자가 전송됩니다.</S.Subtitle>
        {/* 폼 */}
        <S.FormSection>
          {/* 혈액형 */}
          <S.FormGroup>
            <S.Label>혈액형</S.Label>
            <S.BloodTypeGroup>
              {(['A', 'B', 'O', 'AB'] as const).map((type) => (
                <S.BloodTypeButton
                  key={type}
                  type="button"
                  selected={formData.bloodType === type}
                  onClick={() => handleBloodTypeSelect(type)}
                  disabled={isSubmitLoading}
                >
                  {type}
                </S.BloodTypeButton>
              ))}
            </S.BloodTypeGroup>
          </S.FormGroup>

          {/* 긴급연락처 1 */}
          <S.FormGroup>
            <Input
              label="긴급연락처 1"
              type="text"
              placeholder="연락처를 입력해주세요"
              value={formData.emergencyContact1}
              onChange={handleInputChange('emergencyContact1')}
              onBlur={handleFieldBlur('emergencyContact1')}
              maxLength={13}
            />
            {formErrors.emergencyContact1 && (
              <S.ErrorMessage>{formErrors.emergencyContact1}</S.ErrorMessage>
            )}
          </S.FormGroup>

          {/* 긴급연락처 2 */}
          <S.FormGroup>
            <Input
              label="긴급연락처 2"
              type="text"
              placeholder="연락처를 입력해주세요"
              value={formData.emergencyContact2}
              onChange={handleInputChange('emergencyContact2')}
              onBlur={handleFieldBlur('emergencyContact2')}
              maxLength={13}
            />
            {formErrors.emergencyContact2 && (
              <S.ErrorMessage>{formErrors.emergencyContact2}</S.ErrorMessage>
            )}
          </S.FormGroup>

          {/* 긴급연락처 3 */}
          <S.FormGroup>
            <Input
              label="긴급연락처 3"
              type="text"
              placeholder="연락처를 입력해주세요"
              value={formData.emergencyContact3}
              onChange={handleInputChange('emergencyContact3')}
              onBlur={handleFieldBlur('emergencyContact3')}
              maxLength={13}
            />
            {formErrors.emergencyContact3 && (
              <S.ErrorMessage>{formErrors.emergencyContact3}</S.ErrorMessage>
            )}
          </S.FormGroup>
        </S.FormSection>

        {/* 저장 버튼 */}
        <S.SaveButton onClick={handleSubmit} disabled={!isFormValid() || isSubmitLoading}>
          {isSubmitLoading ? '수정 중...' : '수정'}
        </S.SaveButton>
      </S.Container>

      {/* 토스트 알림 */}
      {toasts.map((toast) => (
        <AlertToast
          key={toast.id}
          type={toast.type}
          content={toast.content}
          title={toast.title}
          position={toast.position}
          duration={toast.duration}
        />
      ))}
    </>
  );
}
