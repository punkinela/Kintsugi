import React, { useState, useRef, useEffect, useCallback, FC } from 'react';

type Position = 'top' | 'bottom' | 'left' | 'right';

interface TooltipPosition {
  position: Position;
  styles: React.CSSProperties;
  tooltipRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLDivElement>;
  updatePosition: () => void;
}

export const useTooltipPosition = (): TooltipPosition => {
  const [position, setPosition] = useState<Position>('top');
  const [styles, setStyles] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((): void => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current.getBoundingClientRect();
    const trigger = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate space around the trigger
    const spaceAbove = trigger.top;
    const spaceBelow = viewportHeight - trigger.bottom;
    const spaceLeft = trigger.left;
    const spaceRight = viewportWidth - trigger.right;

    // Default position is top
    let newPosition: Position = 'top';
    
    // Check if there's enough space above, if not, position below
    if (spaceAbove < tooltip.height + 10) {
      newPosition = 'bottom';
    }
    
    // If not enough space below either, try left or right
    if (spaceBelow < tooltip.height + 10 && spaceAbove < tooltip.height + 10) {
      if (spaceRight > spaceLeft) {
        newPosition = 'right';
      } else {
        newPosition = 'left';
      }
    }

    // Calculate styles based on position
    let newStyles: React.CSSProperties = {};
    const offset = 10;

    switch (newPosition) {
      case 'top':
        newStyles = {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: offset + 'px',
        };
        break;
      case 'bottom':
        newStyles = {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: offset + 'px',
        };
        break;
      case 'left':
        newStyles = {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: offset + 'px',
        };
        break;
      case 'right':
        newStyles = {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: offset + 'px',
        };
        break;
    }

    // Add arrow styles using CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--arrow-offset', '10px');
    root.style.setProperty('--arrow-size', '6px');
    
    // Ensure tooltip is above other content
    newStyles.zIndex = 9999;
    newStyles.pointerEvents = 'none';

    setPosition(newPosition);
    setStyles(newStyles);
  }, []);

  useEffect(() => {
    // Initial position update
    updatePosition();
    
    // Update on window resize
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  return { position, styles, tooltipRef, triggerRef, updatePosition };
};

// Helper function to get arrow class based on position
export function getArrowClass(position: Position): string {
  const baseStyle = 'absolute w-0 h-0 border-[6px] border-transparent';
  
  const positionStyles = {
    top: 'border-t-gray-900 border-t-[6px] -bottom-2 left-1/2 -translate-x-1/2',
    bottom: 'border-b-gray-900 border-b-[6px] -top-2 left-1/2 -translate-x-1/2',
    left: 'border-l-gray-900 border-l-[6px] -right-2 top-1/2 -translate-y-1/2',
    right: 'border-r-gray-900 border-r-[6px] -left-2 top-1/2 -translate-y-1/2',
  };

  return `${baseStyle} ${positionStyles[position]}`;
}
