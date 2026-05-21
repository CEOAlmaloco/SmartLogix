import type { IconBaseProps } from "react-icons";
import {
  FiActivity,
  FiArrowRight,
  FiCheck,
  FiCircle,
  FiX,
  FiClock,
  FiFileText,
  FiHelpCircle,
  FiLock,
  FiMail,
  FiShield,
  FiTrash2,
} from "react-icons/fi";

const ICONS = {
  mail: FiMail,
  support: FiHelpCircle,
  shield: FiShield,
  privacy: FiLock,
  legal: FiFileText,
  clock: FiClock,
  status: FiActivity,
  check: FiCheck,
  circle: FiCircle,
  trash: FiTrash2,
  arrowRight: FiArrowRight,
  close: FiX,
} as const;

export type AppIconName = keyof typeof ICONS;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  className?: string;
  title?: string;
} & Pick<IconBaseProps, "aria-hidden" | "aria-label">;

export function AppIcon({
  name,
  size = 20,
  className,
  title,
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
}: AppIconProps) {
  const Icon = ICONS[name];
  return (
    <Icon
      size={size}
      className={className}
      title={title}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  );
}
