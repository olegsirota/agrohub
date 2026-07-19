import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function MouseTrail() {
  const [cells, setCells] = useState<number[]>([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [hoverTimers, setHoverTimers] = useState<{ [key: number]: any }>({});

  const COLS = 12;
  const ROWS = 6;
  const TOTAL_CELLS = COLS * ROWS;

  useEffect(() => {
    // Generate cell indices
    const indices = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
    setCells(indices);

    return () => {
      // Clean up timers
      Object.values(hoverTimers).forEach(clearTimeout);
    };
  }, []);

  const handleCellEnter = (index: number) => {
    setHoveredCell(index);

    // Cancel existing timer for this cell
    if (hoverTimers[index]) {
      clearTimeout(hoverTimers[index]);
    }

    // Set new timer to turn off the light
    const timer = setTimeout(() => {
      setHoveredCell((prev) => (prev === index ? null : prev));
    }, 400);

    setHoverTimers((prev) => ({ ...prev, [index]: timer }));
  };

  // Helper to calculate gradient colors based on cell position (horizontal / diagonal)
  const getCellColor = (index: number) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    
    // Diagonal progress 0..1
    const progress = (col / COLS + row / ROWS) / 2;

    if (progress < 0.3) {
      return "bg-[#D4DE72]"; // Light yellow-green
    } else if (progress < 0.7) {
      return "bg-[#889E39]"; // Sage green
    } else {
      return "bg-[#344E41]"; // Forest green
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10 opacity-30 select-none">
      <div className="grid grid-cols-12 grid-rows-6 w-full h-full pointer-events-auto">
        {cells.map((index) => {
          const isHovered = hoveredCell === index;
          return (
            <div
              key={index}
              onMouseEnter={() => handleCellEnter(index)}
              className="relative border-[0.5px] border-[#E8E6D9]/5 aspect-square transition-all duration-300 flex items-center justify-center cursor-crosshair"
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: isHovered ? 0.8 : 0,
                  scale: isHovered ? 0.98 : 0.8,
                }}
                transition={{
                  duration: isHovered ? 0.05 : 0.8,
                  ease: "easeOut",
                }}
                className={`absolute inset-1 rounded-sm ${getCellColor(index)} blur-[4px]`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
