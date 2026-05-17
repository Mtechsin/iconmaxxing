import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const SlidersIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".slider-1",
        { x: [0, 4, 0] },
        { duration: 0.45, ease: "easeInOut" },
      );
      await animate(
        ".slider-2",
        { x: [0, -4, 0] },
        { duration: 0.45, ease: "easeInOut", delay: 0.05 },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".slider-1, .slider-2",
        { x: 0 },
        { duration: 0.2 },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onHoverStart={start}
        onHoverEnd={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
        style={{ overflow: "visible" }}
      >
        {/* Track lines */}
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        {/* Slider 1 handle */}
        <motion.circle
          className="slider-1"
          cx="8"
          cy="6"
          r="2"
          fill="none"
          style={{ transformOrigin: "8px 6px" }}
        />
        {/* Slider 2 handle */}
        <motion.circle
          className="slider-2"
          cx="16"
          cy="12"
          r="2"
          fill="none"
          style={{ transformOrigin: "16px 12px" }}
        />
        {/* Slider 3 handle (static) */}
        <circle cx="10" cy="18" r="2" />
      </motion.svg>
    );
  },
);

SlidersIcon.displayName = "SlidersIcon";
export default SlidersIcon;
