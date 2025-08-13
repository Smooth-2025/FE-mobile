import VehicleLinkedView from '@/components/car/VehicleLinkedView';
import VehicleUnlinkedView from '@/components/car/VehicleUnlinkedView';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';

export default function homePage() {
  const isLinked = true;

  return (
    <main>
      <Header type="logo" bgColor={theme.colors.bg_page} />
      {!isLinked ? <VehicleUnlinkedView /> : <VehicleLinkedView />}
    </main>
  );
}
