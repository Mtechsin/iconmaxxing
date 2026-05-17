import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const AndroidIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      // Antennae wiggle
      animate(
        ".ant-left",
        { rotate: [-10, 10, -6, 6, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
      animate(
        ".ant-right",
        { rotate: [10, -10, 6, -6, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
      // Body bounce
      await animate(
        ".body",
        { y: [0, -2, 0, -1, 0] },
        { duration: 0.45, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".ant-left, .ant-right, .body",
        { rotate: 0, y: 0 },
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
        fill={color}
        stroke="none"
        className={`cursor-pointer ${className}`}
        style={{ overflow: "visible" }}
      >
        {/* Left antenna */}
        <motion.line
          className="ant-left"
          x1="8.5" y1="5.5" x2="6.5" y2="3"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ transformOrigin: "8.5px 5.5px" }}
        />
        {/* Right antenna */}
        <motion.line
          className="ant-right"
          x1="15.5" y1="5.5" x2="17.5" y2="3"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ transformOrigin: "15.5px 5.5px" }}
        />

        {/* Android body group */}
        <motion.g className="body" style={{ transformOrigin: "12px 13px" }}>
          {/* Head arc */}
          <path d="M6.5 9.5 A5.5 5.5 0 0 1 17.5 9.5 Z" />

          {/* Eyes */}
          <circle cx="9.5" cy="8" r="0.8" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="14.5" cy="8" r="0.8" fill="none" stroke={color} strokeWidth={strokeWidth} />

          {/* Body */}
          <rect x="4.5" y="10" width="15" height="8" rx="1.5" />

          {/* Left arm */}
          <rect x="1.5" y="10" width="2.5" height="6" rx="1.25" />
          {/* Right arm */}
          <rect x="20" y="10" width="2.5" height="6" rx="1.25" />

          {/* Left leg */}
          <rect x="7.5" y="18" width="2.5" height="4" rx="1.25" />
          {/* Right leg */}
          <rect x="14" y="18" width="2.5" height="4" rx="1.25" />
        </motion.g>
      </motion.svg>
    );
  },
);

AndroidIcon.displayName = "AndroidIcon";
export default AndroidIcon;
