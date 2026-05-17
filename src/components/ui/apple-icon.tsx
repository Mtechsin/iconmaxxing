import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const AppleIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      // Leaf flicks to the right
      animate(
        ".leaf",
        { rotate: [0, 20, -5, 10, 0], x: [0, 1, -0.5, 0.5, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
      // Apple body does a subtle sway
      await animate(
        ".apple-body",
        { rotate: [0, -4, 3, -2, 0] },
        { duration: 0.45, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".leaf, .apple-body",
        { rotate: 0, x: 0 },
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
        {/* Leaf / stem */}
        <motion.path
          className="leaf"
          d="M12 5 C12 5 13 2 16 2 C16 2 16 5 13 6"
          style={{ transformOrigin: "12px 5px" }}
        />

        {/* Apple body */}
        <motion.path
          className="apple-body"
          d="M8.5 7 C5 7 3 10 3 13 C3 17.5 6 22 9 22 C10 22 11 21.5 12 21.5 C13 21.5 14 22 15 22 C18 22 21 17.5 21 13 C21 10 19 7 15.5 7 C14.2 7 13 7.8 12 7.8 C11 7.8 9.8 7 8.5 7 Z"
          style={{ transformOrigin: "12px 14px" }}
        />
      </motion.svg>
    );
  },
);

AppleIcon.displayName = "AppleIcon";
export default AppleIcon;
