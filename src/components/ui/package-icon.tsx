import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const PackageIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".pkg-lid",
        { y: -3 },
        { duration: 0.2, ease: "easeOut" },
      );
      await animate(
        ".pkg-stripe",
        { scaleX: [1, 0.6, 1], opacity: [1, 0.3, 1] },
        { duration: 0.5, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".pkg-lid",
        { y: 0 },
        { duration: 0.2, ease: "easeIn" },
      );
      animate(
        ".pkg-stripe",
        { scaleX: 1, opacity: 1 },
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
        {/* Lid */}
        <motion.path
          className="pkg-lid"
          d="M16.5 9.4L7.55 4.24"
        />
        <motion.path
          className="pkg-lid"
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        />
        {/* Center stripe */}
        <motion.polyline
          className="pkg-stripe"
          points="3.27 6.96 12 12.01 20.73 6.96"
          style={{ transformOrigin: "12px 9.5px" }}
        />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </motion.svg>
    );
  },
);

PackageIcon.displayName = "PackageIcon";
export default PackageIcon;
