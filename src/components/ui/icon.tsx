import { icons } from "lucide-react";

export const Icon = ({
   name,
   color,
   size,
   className,
}: {
   name: keyof typeof icons;
   color: string;
   size: number;
   className?: string;
}) => {
   const LucideIcon = icons[name as keyof typeof icons];

   // Check if the icon exists
   if (!LucideIcon) {
      console.error(`Icon "${name}" is not defined in the icons object.`);
      return null; // or return a fallback component
   }

   return (
      <LucideIcon
         color={color}
         size={size}
         className={className}
      />
   );
};
