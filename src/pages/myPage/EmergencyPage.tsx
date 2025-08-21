import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { getUserProfile } from '@/apis/auth';
import { theme } from '@/styles/theme';
import { Icon } from '@/components/common';
import AlertToast from '@/components/common/AlertToast/AlertToast';
import * as S from '@/components/myPage/EmergencyPage.styles';
import type { UserProfileResponse } from '@/types/api';

type UserProfile = UserProfileResponse['data'];

export default function EmergencyPage() {
  const navigate = useNavigate();
  const { showError, toasts } = useToast();

  // 사용자 프로필 상태
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // showError를 useCallback으로 memoization
  const showErrorCallback = useCallback(showError, [showError]);

  // 사용자 프로필 조회
  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getUserProfile();
        if (isMounted) {
          setUserProfile(response.data);
        }
      } catch {
        if (isMounted) {
          showErrorCallback('사용자 정보를 불러올 수 없습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
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
    navigate('/mypage');
  };

  // 응급정보 수정 페이지로 이동
  const handleEditEmergency = () => {
    navigate('/mypage/emergency/edit');
  };

  // 전화번호 마스킹
  const maskPhoneNumber = (phone: string) => {
    if (!phone) return '[정보 없음]';
    
    // 하이픈 제거한 순수 번호로 처리
    const cleanPhone = phone.replace(/-/g, '');
    
    if (cleanPhone.length === 11 && cleanPhone.startsWith('010')) {
      // 010-XXXX-XXXX 형태로 마스킹
      return `010-****-${cleanPhone.slice(-4)}`;
    } else if (cleanPhone.length >= 7) {
      // 기타 경우 앞 3자리와 뒤 4자리만 표시
      const start = cleanPhone.slice(0, 3);
      const end = cleanPhone.slice(-4);
      return `${start}-****-${end}`;
    }
    
    return phone; // 너무 짧은 경우 그대로 표시
  };

  // 혈액형 표시
  const getBloodTypeText = (bloodType: string) => {
    if (!bloodType) return '[정보 없음]';
    return bloodType;
  };

  if (isLoading) {
    return (
      <S.Container>
        <S.Header>
          <S.BackButton onClick={handleGoBack}>
            <Icon name="close" size={24} color={theme.colors.neutral700} />
          </S.BackButton>
          <S.HeaderTitle>응급정보</S.HeaderTitle>
          <div />
        </S.Header>
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
        <S.Header>
          <S.BackButton onClick={handleGoBack}>
            <Icon name="close" size={24} color={theme.colors.neutral700} />
          </S.BackButton>
          <S.HeaderTitle>응급정보</S.HeaderTitle>
          <div />
        </S.Header>

        {/* 응급정보 내용 */}
        <S.ContentSection>
          <S.InfoItem>
            <S.InfoLabel>혈액형</S.InfoLabel>
            <S.InfoValue className={!userProfile?.bloodType ? 'no-data' : ''}>
              {getBloodTypeText(userProfile?.bloodType || '')}
            </S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>긴급 연락처 1</S.InfoLabel>
            <S.InfoValue className={!userProfile?.emergencyContact1 ? 'no-data' : ''}>
              {maskPhoneNumber(userProfile?.emergencyContact1 || '')}
            </S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>긴급 연락처 2</S.InfoLabel>
            <S.InfoValue className={!userProfile?.emergencyContact2 ? 'no-data' : ''}>
              {maskPhoneNumber(userProfile?.emergencyContact2 || '')}
            </S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>긴급 연락처 3</S.InfoLabel>
            <S.InfoValue className={!userProfile?.emergencyContact3 ? 'no-data' : ''}>
              {maskPhoneNumber(userProfile?.emergencyContact3 || '')}
            </S.InfoValue>
          </S.InfoItem>
        </S.ContentSection>

        {/* 수정 버튼 */}
        <S.EditButton onClick={handleEditEmergency}>
          응급정보 수정
        </S.EditButton>
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