import { createPortal } from 'react-dom';

const driveRootElement = () => document.getElementById('drive-root') as HTMLElement | null;

export default function DrivePortal({ children }: { children: React.ReactNode }) {
  const el = driveRootElement();
  if (!el) return null;
  return createPortal(children, el);
}
