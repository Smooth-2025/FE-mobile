import DrivingHistory from '@/components/history/DrivingHistory';
import StampBoard from '@/components/history/StampBoard';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';

export default function ReportPage() {
  return (
    <main>
      <Header type="logo" bgColor={theme.colors.bg_page} />
      <StampBoard />
      <DrivingHistory />
    </main>
  );
}
