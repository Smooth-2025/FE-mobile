import { theme } from '@/styles/theme';
import type { IconName } from '@/components/common/Icons/type';

export interface MenuItemData {
  id: string;
  path: string;
  label: string;
  icon: IconName;
  iconColor: string;
}

export const MENU_ITEMS: MenuItemData[] = [
  {
    id: 'profile',
    path: '/mypage/profile',
    label: '내 정보',
    icon: 'user',
    iconColor: theme.colors.primary600,
  },
  {
    id: 'emergency',
    path: '/mypage/emergency',
    label: '응급정보',
    icon: 'warningCircle',
    iconColor: theme.colors.danger500,
  },
  {
    id: 'reports',
    path: '/mypage/reports',
    label: '신고내역',
    icon: 'report',
    iconColor: theme.colors.Warning600,
  },
] as const;