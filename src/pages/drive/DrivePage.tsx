import DrivingInfoPanel from '@/components/drive/DrivingInfoPanel';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';

export default function DrivePage() {
  return (
    <>
      <Header type="logo" bgColor={theme.colors.bg_page} />
      <DrivingInfoPanel />
    </>
  );
}
