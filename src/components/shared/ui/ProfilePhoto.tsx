import type { JSX } from "react";

import { useState } from "react";
import { cn } from "../../../lib/utils";


type ProfileFotoProps = {
  photo: string | null | undefined;
  name: string | null;
  lastName: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const ProfileFoto = ({
  photo,
  name,
  lastName,
  size = "sm",
  className
}: ProfileFotoProps): JSX.Element => {
  const [photoUser, setPhotoUser] = useState<string | null | undefined>(photo);
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeClass = {
    sm: "w-[36px] h-[36px] ",
    md: "w-[48px] h-[48px] ",
    lg: "w-[52px] h-[52px] ",
  };

  const roundedClass = {
    sm: "rounded-[8px]",
    md: "rounded-[10px]",
    lg: "rounded-[16px]",
  };

  const photoSize = {
    sm: 36,
    md: 48,
    lg: 52,
  };

  const handleError = (): void => {
    setPhotoUser(null);
    setIsLoaded(false);
  };

  const handleLoad = (): void => {
    setIsLoaded(true);
  };

  if (
    photoUser !== null &&
    photoUser !== undefined &&
    photoUser !== "" &&
    isLoaded
  ) {
    return (
      <img
        src={photoUser}
        width={photoSize[size]}
        height={photoSize[size]}
        alt="user"
        className={cn("flex-shrink-0 rounded-full", roundedClass[size])}
        onError={handleError}
        onLoad={handleLoad}
      />
    );
  }

  return (
    <div
      className={cn(
        `flex flex-shrink-0 cursor-default items-center justify-center group-hover:bg-tokens-background-light-blue-2 ${className}`,
        roundedClass[size],
        sizeClass[size],
      )}
    >
      <p className={cn("typo-body-small-medium-14")}>
        {name?.charAt(0).toUpperCase()}
        {lastName?.charAt(0).toUpperCase()}
      </p>
    </div>
  );
};