import type { JSX } from "react";
import { cn } from "../../../lib/utils";


type IconProps = {
  icon: string;
  size?: number;
  iconColor?: string;
  disabled?: boolean;
  filled?: boolean;
  className?: string;
  onClick?: () => void;
};

export const IconMaterial = ({
  icon,
  size = 24,
  disabled,
  iconColor,
  filled = false,
  className,
  onClick,
}: IconProps): JSX.Element => {
  return (
    <span
      className={cn(
        filled ? "material-icons text-secondary" : "material-icons-outlined",
        className,
      )}
      onClick={onClick}
      style={{
        fontSize: `${size}px`,
        color:
          disabled === true ? "text-secondary-light" : iconColor,
      }}
    >
      {icon}
    </span>
  );
};