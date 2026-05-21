import { AppIcon, type AppIconName } from "@/components/icons/AppIcon";

type ContactIconProps = {
  name: Extract<
    AppIconName,
    "mail" | "support" | "shield" | "privacy" | "legal" | "clock" | "status"
  >;
  size?: number;
  className?: string;
};

export function ContactIcon({ name, size = 20, className }: ContactIconProps) {
  return <AppIcon name={name} size={size} className={className} />;
}
