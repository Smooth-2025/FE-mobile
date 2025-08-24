import * as styled from '@components/drive/DrivingInfoPanel.styles';
import drivingCharacter from '@/assets/images/driving-charactar.png';
import DriveStatsCard from './DriveStatsCard';
import WeeklyDriveSummaryCard from './WeeklyDriveSummaryCard';

export default function DrivingInfoPanel() {
  return (
    <styled.TopSection>
      <styled.InfoBoxContainer>
        <styled.InfoBox>
          <styled.Title>오늘의 주행, 한눈에보기 👀</styled.Title>
          <styled.Subtitle>주행 거리와 주요 특징을 확인해보세요</styled.Subtitle>
        </styled.InfoBox>
        <styled.Character src={drivingCharacter} alt=" 캐릭터" />
      </styled.InfoBoxContainer>
      <DriveStatsCard />
      <WeeklyDriveSummaryCard />
    </styled.TopSection>
  );
}
