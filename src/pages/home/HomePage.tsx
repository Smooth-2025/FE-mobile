import Header from '@/layout/Header';
import { theme } from '@/styles/theme';

export default function homePage() {
  return (
    <main>
      <Header type="logo" bgColor={theme.colors.bg_page} />
    </main>
  );
}