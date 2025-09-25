import type { JSX } from "react";
import BaseButton from "./baseBtn";
import { DotsSpinner } from "./dotsSpinner";
import { IconMaterial } from "../../iconMaterial/IconMaterial";
import { cn } from "./cn";
import { Tooltip } from "./tooltip";



type ButtonProps = {
  disabled?: boolean;
  title?: string;
  icon?: string;
  iconColor?: string;
  size?: 'xs' | "sm" | "lg" | "md"
  onClick?: () => void;
  variant?:
   
    | "outline"
    | "secondary"
    | "primary";
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  className?: string;
  disabledTooltip?: string;
  iconPosition?: "left" | "right";
  iconSize?: number;
  spinnerSize?: "sm" | "md" | "lg" | "icon";
  customIcon?: React.ReactNode;
};

export const Button = ({
  title,
  disabled = false,
  variant = "primary",
  iconColor,
  icon,
  onClick,
  type,
  isLoading = false,
  size = "md",
  className,
  disabledTooltip,
  iconPosition = "right",
  iconSize = 20,
  spinnerSize = "md",
}: ButtonProps): JSX.Element => {
  const getSpinnerSize = (): string => {
    switch (spinnerSize) {
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-6 h-6";
      case "lg":
        return "w-8 h-8";
      case "icon":
        return "w-5 h-5";
      default:
        return "w-6 h-6";
    }
  };

  const getIconSize = (): number => {
    switch (spinnerSize) {
      case "sm":
        return 16;
      case "md":
        return 24;
      case "lg":
        return 32;
      case "icon":
        return 20;
      default:
        return 24;
    }
  };

  const finalIconSize = iconSize ?? getIconSize();
  const spinnerSizeClass = getSpinnerSize();

  const isIconOnly = icon !== undefined && title === undefined;

  const button = (
    <BaseButton
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      size={size}
    >
      {iconPosition === "left" && icon !== undefined ? (
        isIconOnly ? (
          isLoading ? (
            <DotsSpinner size={spinnerSize} className="text-white" />
          ) : (
            <IconMaterial
              size={finalIconSize}
              icon={icon}
              iconColor={iconColor}
              disabled={disabled}
              className="p-0"
            />
          )
        ) : (
          <div
            className={cn("flex items-center justify-center", spinnerSizeClass)}
          >
            {isLoading ? (
              <DotsSpinner size={spinnerSize} className="text-white" />
            ) : (
              <IconMaterial
                size={finalIconSize}
                icon={icon}
                iconColor={iconColor}
                disabled={disabled}
                className="p-0"
              />
            )}
          </div>
        )
      ) : null}
      {icon === undefined && isLoading ? (
        <DotsSpinner size={spinnerSize} className="text-white" />
      ) : (
        title
      )}

      {iconPosition === "right" && icon !== undefined ? (
        isIconOnly ? (
          isLoading ? (
            <DotsSpinner size={spinnerSize} className="text-white" />
          ) : (
            <IconMaterial
              size={finalIconSize}
              icon={icon}
              iconColor={iconColor}
              disabled={disabled}
            />
          )
        ) : (
          <div
            className={cn("flex items-center justify-center", spinnerSizeClass)}
          >
            {isLoading ? (
              <DotsSpinner
                size={spinnerSize}
                className={variant === "primary" ? "text-white" : ""}
              />
            ) : (
              <IconMaterial
                size={finalIconSize}
                icon={icon}
                iconColor={iconColor}
                disabled={disabled}
              />
            )}
          </div>
        )
      ) : null}
    </BaseButton>
  );

  if (disabled && disabledTooltip !== undefined) {
    return <Tooltip content={disabledTooltip}>{button}</Tooltip>;
  }

  return button;
};
