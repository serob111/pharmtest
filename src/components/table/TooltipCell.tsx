import type { JSX } from "react";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";


type TooltipCellProps = {
  content: string | undefined | number | null | Date;
  className?: string;
  subcontent?:string | undefined | number
};

export const TooltipCell = ({
  content,
  className,
  subcontent
}: TooltipCellProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ bottom: 0, left: 0 });
  const cellRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const displayContent = 
    content instanceof Date
      ? content.toLocaleDateString() 
      : content ?? t("common.notProvidedYet");

  const handleMouseEnter = (): void => {
    const cell = cellRef.current;
    if (!cell) return;

    const isClamped = cell.scrollHeight > cell.offsetHeight + 1;

    if (isClamped) {
      const rect = cell.getBoundingClientRect();
      setPosition({
        bottom: window.innerHeight - rect.top,
        left: rect.left + window.scrollX,
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = (): void => {
    setIsVisible(false);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <div className="relative flex flex-col gap-2">
      <p
        ref={cellRef}
        className={cn("line-clamp-2", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {displayContent}
      </p>
      <p className="text-secondary-extralight text-xs font-normal">
        {subcontent}
      </p>
      {isVisible && (
        <div
          className="fixed z-50 rounded bg-darkblue max-w-[300px] px-2 py-2 text-[14px] text-white whitespace-normal break-words"
          style={{
            bottom: `${position.bottom}px`,
            left: `${position.left}px`,
          }}
        >
          {displayContent}
        </div>
      )}
    </div>
  );
};
