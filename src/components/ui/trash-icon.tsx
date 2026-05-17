import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const TrashIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".trash-lid",
        { rotate: -15, y: -2, x: -1 },
        { duration: 0.2, ease: "easeOut" },
      );
      animate(
        ".trash-lines",
        { opacity: [1, 0.4, 1] },
        { duration: 0.4, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".trash-lid",
        { rotate: 0, y: 0, x: 0 },
        { duration: 0.2, ease: "easeIn" },
      );
      animate(
        ".trash-lines",
        { opacity: 1 },
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
        {/* Can body */}
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        {/* Lid handle */}
        <motion.path
          className="trash-lid"
          d="M10 2h4"
          style={{ transformOrigin: "12px 3px" }}
        />
        {/* Inner lines */}
        <motion.g className="trash-lines">
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </motion.g>
      </motion.svg>
    );
  },
);

TrashIcon.displayName = "TrashIcon";
export default TrashIcon;
