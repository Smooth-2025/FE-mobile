import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppRedux';
import { selectUser, logoutAsync, deleteAccountAsync, selectIsLogoutLoading, selectIsDeleteAccountLoading } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/useToast';
import { getUserProfile } from '@/apis/auth';
import { theme } from '@/styles/theme';
import { Icon } from '@/components/common';
import BottomSheetPortal from '@/components/BottomSheetPortal';
import AlertToast from '@/components/common/AlertToast/AlertToast';
import * as S from '@/components/myPage/ProfilePage.styles';
import type { UserProfileResponse } from '@/types/api';

type UserProfile = UserProfileResponse['data'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLogoutLoading = useAppSelector(selectIsLogoutLoading);
  const isDeleteAccountLoading = useAppSelector(selectIsDeleteAccountLoading);
  const { showSuccess, showError, toasts } = useToast();
  
  // 사용자 프로필 상태 관리
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // BottomSheet 상태 관리
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isDeleteAccountSheetOpen, setIsDeleteAccountSheetOpen] = useState(false);
  
  // showError를 useCallback으로 memoization
  const showErrorCallback = useCallback(showError, [showError]);

  // 사용자 프로필 정보 조회
  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        setIsProfileLoading(true);
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
          setIsProfileLoading(false);
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

  // 비밀번호 변경 페이지로 이동
  const handleChangePassword = () => {
    navigate('/mypage/change-password');
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      showSuccess('로그아웃이 완료되었습니다.');
      setIsLogoutSheetOpen(false);
      navigate('/login');
    } catch{
      showError('로그아웃 처리 중 오류가 발생했습니다.');
    }
  };

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccountAsync()).unwrap();
      showSuccess('회원탈퇴가 완료되었습니다.');
      setIsDeleteAccountSheetOpen(false);
      navigate('/login');
    } catch{
      showError('회원탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  // 성별 표시 함수
  const getGenderDisplay = (gender?: string) => {
    if (gender === 'MALE') return '남성';
    if (gender === 'FEMALE') return '여성';
    return '미설정';
  };

  // 전화번호 마스킹 함수
  const maskPhoneNumber = (phone?: string) => {
    if (!phone) return '미설정';
    if (phone.length >= 8) {
      return phone.slice(0, 3) + '****' + phone.slice(-4);
    }
    return phone;
  };
  if (isProfileLoading) {
    return (
      <S.Container>
        <S.Header>
          <S.BackButton onClick={handleGoBack}>
            <Icon name="chevronLeft" size={24} color={theme.colors.neutral700} />
          </S.BackButton>
          <S.HeaderTitle>내정보</S.HeaderTitle>
          <div />
        </S.Header>
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <p>사용자 정보를 불러오는 중...</p>
        </div>
      </S.Container>
    );
  }
  return (
    <>
      <S.Container>
        {/* 헤더 */}
        <S.Header>
          <S.BackButton onClick={handleGoBack}>
            <Icon name="chevronLeft" size={24} color={theme.colors.neutral700} />
          </S.BackButton>
          <S.HeaderTitle>내정보</S.HeaderTitle>
          <div /> {/* 우측 여백을 위한 빈 div */}
        </S.Header>

        {/* 사용자 정보 */}
        <S.InfoSection>
          <S.InfoItem>
            <S.InfoLabel>이름</S.InfoLabel>
            <S.InfoValue>{userProfile?.name || user?.name || '미설정'}</S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>이메일</S.InfoLabel>
            <S.InfoValue>{userProfile?.email || '미설정'}</S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>휴대전화번호</S.InfoLabel>
            <S.InfoValue>{maskPhoneNumber(userProfile?.phone)}</S.InfoValue>
          </S.InfoItem>

          <S.InfoItem>
            <S.InfoLabel>성별</S.InfoLabel>
            <S.InfoValue>{getGenderDisplay(userProfile?.gender)}</S.InfoValue>
          </S.InfoItem>
        </S.InfoSection>

        {/* 비밀번호 변경 버튼 */}
        <S.ActionButton onClick={handleChangePassword}>
          비밀번호 변경
        </S.ActionButton>

        {/* 하단 버튼들 */}
        <S.BottomActions>
          <S.TextButton onClick={() => setIsLogoutSheetOpen(true)}>
            로그아웃
          </S.TextButton>
          <S.TextButton onClick={() => setIsDeleteAccountSheetOpen(true)}>
            회원탈퇴
          </S.TextButton>
        </S.BottomActions>
      </S.Container>

      {/* 로그아웃 BottomSheet */}
      <BottomSheetPortal
        isOpen={isLogoutSheetOpen}
        onClose={() => setIsLogoutSheetOpen(false)}
        backdropClosable={!isLogoutLoading}
        ariaLabel="로그아웃 확인"
      >
        {({ requestClose }) => (
          <S.SheetContent>
            <S.SheetTitle>로그아웃 하시겠어요?</S.SheetTitle>
            <S.SheetDescription>
              현재 기기에서 로그아웃 됩니다.<br />
              다시 로그인하려면 이메일/비밀번호가 필요합니다.
            </S.SheetDescription>
            <S.SheetButtonGroup>
              <S.SheetPrimaryButton 
                onClick={handleLogout}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? '로그아웃 중...' : '로그아웃'}
              </S.SheetPrimaryButton>
              <S.SheetSecondaryButton 
                onClick={requestClose}
                disabled={isLogoutLoading}
              >
                취소
              </S.SheetSecondaryButton>
            </S.SheetButtonGroup>
          </S.SheetContent>
        )}
      </BottomSheetPortal>

      {/* 회원탈퇴 BottomSheet */}
      <BottomSheetPortal
        isOpen={isDeleteAccountSheetOpen}
        onClose={() => setIsDeleteAccountSheetOpen(false)}
        backdropClosable={!isDeleteAccountLoading}
        ariaLabel="회원탈퇴 확인"
      >
        {({ requestClose }) => (
          <S.SheetContent>
            <S.SheetTitle>정말로 계정을 탈퇴하시겠습니까?</S.SheetTitle>
            <S.SheetDescription>
              모든 개인정보가 영구적으로 삭제되며,<br />
              복구가 불가능합니다.
            </S.SheetDescription>
            <S.SheetButtonGroup>
              <S.SheetPrimaryButton 
                onClick={handleDeleteAccount}
                disabled={isDeleteAccountLoading}
              >
                {isDeleteAccountLoading ? '탈퇴 처리중...' : '회원탈퇴'}
              </S.SheetPrimaryButton>
              <S.SheetSecondaryButton 
                onClick={requestClose}
                disabled={isDeleteAccountLoading}
              >
                취소
              </S.SheetSecondaryButton>
            </S.SheetButtonGroup>
          </S.SheetContent>
        )}
      </BottomSheetPortal>

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