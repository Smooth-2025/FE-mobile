export interface IconStyleProps {
  size?: number;
  color?: string;
}

export type IconName =
  | 'car'
  | 'home'
  | 'report'
  | 'user'
  | 'warningTriangle'
  | 'warningCircle'
  | 'checkmarkCircle'
  | 'chevronLeft'
  | 'close'
  | 'eyeClosed'
  | 'eyeOpen';

export interface IconProps extends IconStyleProps {
  name: IconName;
}
