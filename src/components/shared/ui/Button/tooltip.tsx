import type { JSX } from "react";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../../lib/utils";


type TooltipProps = {
  children: JSX.Element;
  content: string;
  className?: string;
  disabled?: boolean;
};

export const Tooltip = ({
  children,
  content,
  className,
  disabled,
}: TooltipProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  /**
   * Updates tooltip position based on mouse coordinates and viewport boundaries
   * Ensures tooltip stays within viewport bounds with smart positioning
   */
  const updatePosition = (e: React.MouseEvent): void => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Estimate tooltip dimensions (could be refined with ref, but using constants for simplicity)
    const tooltipWidth = Math.min(400, content.length * 6); // Approximate width based on content
    const tooltipHeight = 40; // Approximate height

    // Initial position (to the right and below cursor)
    let x = e.clientX + 10;
    let y = e.clientY + 20;

    // Check if tooltip would overflow right edge of viewport
    if (x + tooltipWidth > viewportWidth - 10) {
      x = e.clientX - tooltipWidth - 10;
    }

    // Check if tooltip would overflow left edge of viewport
    if (x < 10) {
      x = 10;
    }

    // Check if tooltip would overflow bottom edge of viewport
    if (y + tooltipHeight > viewportHeight - 10) {
      y = e.clientY - tooltipHeight - 10;
    }

    // Check if tooltip would overflow top edge of viewport
    if (y < 10) {
      y = 10;
    }

    setPosition({ x, y });
  };

  /**
   * Shows tooltip and calculates initial position
   */
  const handleMouseEnter = (e: React.MouseEvent): void => {
    setIsVisible(true);
    updatePosition(e);
  };

  /**
   * Hides tooltip when mouse leaves trigger element
   */
  const handleMouseLeave = (): void => {
    setIsVisible(false);
  };

  /**
   * Updates tooltip position as mouse moves over trigger element
   */
  const handleMouseMove = (e: React.MouseEvent): void => {
    if (isVisible) {
      updatePosition(e);
    }
  };

  // Clean up tooltip visibility on component unmount
  useEffect(() => {
    return () => {
      setIsVisible(false);
    };
  }, []);

  return (
    <>
      {/* Trigger element that shows/hides tooltip */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className={cn("inline-block", className)}
      >
        {children}
      </div>

      {/* Render tooltip via portal to avoid container overflow issues */}
      {isVisible &&
        disabled !== true &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="text-white shadow-lg py-0.5 px-1 pointer-events-none fixed z-[9999] max-w-[400px] rounded-[4px] bg-tokens-background-dark text-[10px] break-words"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: "max-content",
              maxWidth: "400px",
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
