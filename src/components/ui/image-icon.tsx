import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const ImageIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".mountain-left",
        { x: [-1, -3, -1], y: [0, 1, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
      animate(
        ".mountain-right",
        { x: [1, 3, 1], y: [0, 1, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
      await animate(
        ".sun",
        { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] },
        { duration: 0.5, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".mountain-left, .mountain-right, .sun",
        { x: 0, y: 0, scale: 1, opacity: 1 },
        { duration: 0.3, ease: "easeOut" },
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
        {/* Frame */}
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        {/* Sun */}
        <motion.circle
          className="sun"
          cx="8.5"
          cy="8.5"
          r="1.5"
          style={{ transformOrigin: "8.5px 8.5px" }}
        />
        {/* Left mountain */}
        <motion.path
          className="mountain-left"
          d="M21 15l-5-5L11 15"
          style={{ transformOrigin: "16px 12px" }}
        />
        {/* Right mountain */}
        <motion.path
          className="mountain-right"
          d="M3 15l4-4 4 4"
          style={{ transformOrigin: "7px 13px" }}
        />
        {/* Ground line */}
        <line x1="3" y1="21" x2="21" y2="21" />
      </motion.svg>
    );
  },
);

ImageIcon.displayName = "ImageIcon";
export default ImageIcon;
