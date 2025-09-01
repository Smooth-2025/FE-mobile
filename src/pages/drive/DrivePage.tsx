import styled from '@emotion/styled';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';
import TodaySummary from '@/components/summary/TodaySummary';
import WeeklySummary from '@/components/summary/WeeklySummary';
import CharacterTraits from '@/components/summary/CharacterTraits';

const Base = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

export default function DrivePage() {
  return (
    <Base>
      <Header type="logo" bgColor={theme.colors.bg_page} />
      <TodaySummary />
      <WeeklySummary />
      <CharacterTraits />
    </Base>
  );
}
