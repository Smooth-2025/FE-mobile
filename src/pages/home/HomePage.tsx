import VehicleLinkedView from '@/components/vehicle/VehicleLinkedView';
import VehicleUnlinkedView from '@/components/vehicle/VehicleUnlinkedView';
import Header from '@/layout/Header';
import { useGetLinkStatusQuery } from '@/store/vehicle/vehicleApi';
import { theme } from '@/styles/theme';

export default function HomePage() {
  const { data, isLoading } = useGetLinkStatusQuery();

  if (isLoading) return <>isLoading</>;
  if (!data) return null;

  const { linked, vehicle } = data;

  return (
    <main>
      <Header type="logo" bgColor={theme.colors.bg_page} />
      {linked && vehicle ? <VehicleLinkedView vehicle={vehicle} /> : <VehicleUnlinkedView />}
    </main>
  );
}
