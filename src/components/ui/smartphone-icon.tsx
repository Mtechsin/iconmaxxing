import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const SmartphoneIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      await animate(
        ".phone-body",
        { y: [0, -2, 0, -1, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
      animate(
        ".phone-dot",
        { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] },
        { duration: 0.4, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".phone-body, .phone-dot",
        { y: 0, scale: 1, opacity: 1 },
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
        <motion.g className="phone-body">
          {/* Phone outline */}
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          {/* Screen line 1 */}
          <line x1="8" y1="7" x2="16" y2="7" />
          {/* Screen line 2 */}
          <line x1="8" y1="10" x2="16" y2="10" />
          {/* Screen line 3 (shorter) */}
          <line x1="8" y1="13" x2="13" y2="13" />
        </motion.g>
        {/* Home button dot */}
        <motion.circle
          className="phone-dot"
          cx="12"
          cy="18"
          r="1"
          style={{ transformOrigin: "12px 18px" }}
        />
      </motion.svg>
    );
  },
);

SmartphoneIcon.displayName = "SmartphoneIcon";
export default SmartphoneIcon;
