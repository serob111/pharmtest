import type { JSX } from "react";
import { cn } from "../../../../lib/utils";


type DotsSpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "icon";
};

export const DotsSpinner = ({
  className,
  size = "md",
}: DotsSpinnerProps): JSX.Element => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4",
    icon: "w-5 h-5 border-2",
  };

  return (
    <div
      className={cn(
        "animate-spin inline-block rounded-full border-dotted border-current text-tokens-icons-color",
        sizeClasses[size],
        className,
      )}
    />
  );
};
