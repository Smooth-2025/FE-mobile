import DriveCharacterResultCard from '@/components/drive/DriveCharacterResultCard';
import DrivingInfoPanel from '@/components/drive/DrivingInfoPanel';
import WeeklyDriveSummaryCard from '@/components/drive/WeeklyDriveSummaryCard';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';

export default function DrivePage() {
  return (
    <>
      <Header type="logo" bgColor={theme.colors.bg_page} />
      <DrivingInfoPanel />
      <WeeklyDriveSummaryCard />
      <DriveCharacterResultCard />
    </>
  );
}
