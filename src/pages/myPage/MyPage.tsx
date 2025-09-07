import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppRedux';
import { selectUser } from '@/store/slices/authSlice';
import { theme } from '@/styles/theme';
import Header from '@/layout/Header';
import { Icon } from '@/components/common';
import { MENU_ITEMS } from '@/components/myPage/MyPage.contants';
import * as S from '@/components/myPage/MyPage.styles';

export default function MyPage() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <main>
        <Header type="logo" bgColor={theme.colors.bg_page} />
      </main>
      <S.Container>
        {/* 상단 인사말 */}
        <S.GreetingSection>
          <S.ProfileIcon>
            <Icon name="user" size={28} color={theme.colors.primary600} />
          </S.ProfileIcon>
          <S.GreetingText>
            <h1><S.UserName>{user?.name || '사용자'}</S.UserName>님, 안녕하세요</h1>
            <S.ProfileLink onClick={() => navigate('/mypage/profile')}>
              <p>내정보</p>
              <Icon name="chevronRight" size={16} color={theme.colors.neutral400} />
            </S.ProfileLink>
          </S.GreetingText>
        </S.GreetingSection>

        {/* 설정 메뉴 */}
        <S.SettingsSection>
          <S.MenuList>
            <h2>설정</h2>
            {MENU_ITEMS.map((menuItem) => (
              <S.MenuItem key={menuItem.id} onClick={() => handleMenuClick(menuItem.path)}>
                <S.MenuItemLeft>
                  <S.MenuItemText>{menuItem.label}</S.MenuItemText>
                </S.MenuItemLeft>
                <S.ChevronWrapper>
                  <Icon name="chevronLeft" size={20} color={theme.colors.neutral400} />
                </S.ChevronWrapper>
              </S.MenuItem>
            ))}
          </S.MenuList>
        </S.SettingsSection>
      </S.Container>
    </>
  );
}