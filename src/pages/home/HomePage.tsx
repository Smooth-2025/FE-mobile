import VehicleLinkedView from '@/components/car/VehicleLinkedView';
import VehicleUnlinkedView from '@/components/car/VehicleUnlinkedView';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';

export default function HomePage() {
  const isLinked = false;

  return (
    <main>
      <Header type="logo" bgColor={theme.colors.bg_page} />
      {!isLinked ? <VehicleUnlinkedView /> : <VehicleLinkedView />}
    </main>
  );
}
