import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const LayersIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".layer-top",
        { y: -3 },
        { duration: 0.25, ease: "easeOut" },
      );
      animate(
        ".layer-bottom",
        { y: 3 },
        { duration: 0.25, ease: "easeOut" },
      );
      await new Promise((r) => setTimeout(r, 300));
      animate(
        ".layer-top",
        { y: 0 },
        { duration: 0.25, ease: "easeIn" },
      );
      animate(
        ".layer-bottom",
        { y: 0 },
        { duration: 0.25, ease: "easeIn" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".layer-top, .layer-bottom",
        { y: 0 },
        { duration: 0.2, ease: "easeOut" },
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
        {/* Top layer */}
        <motion.path
          className="layer-top"
          d="M12 2L2 7l10 5 10-5-10-5z"
        />
        {/* Middle layer */}
        <path d="M2 12l10 5 10-5" />
        {/* Bottom layer */}
        <motion.path
          className="layer-bottom"
          d="M2 17l10 5 10-5"
        />
      </motion.svg>
    );
  },
);

LayersIcon.displayName = "LayersIcon";
export default LayersIcon;
