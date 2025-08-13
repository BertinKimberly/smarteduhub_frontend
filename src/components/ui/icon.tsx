import { LucideIcon, LucideProps } from "lucide-react";
import * as icons from "lucide-react";

type IconComponentProps = {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  className?: string;
};

export const Icon = ({ name, color, size, className }: IconComponentProps) => {
  // Get the icon component from the icons object
  const IconComponent = icons[name] as LucideIcon;

  // Check if the icon exists
  if (!IconComponent) {
    console.error(`Icon "${name}" is not defined in the icons object.`);
    return null;
  }

  return (
    <IconComponent
      color={color}
      size={size}
      className={className}
    />
  );
};