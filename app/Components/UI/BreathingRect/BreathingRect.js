import React from "react";
import styles from "./BreathingRect.module.scss";

const BreathingRect = (props) => {
  return (
    <svg
      {...props}
      // viewBox="0 0 680 586"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`max-w-[1000px] ${styles["rect-group"]}`}
    >
      <rect
        x="138.483"
        y="137.326"
        width="403.034"
        height="311.348"
        rx="75.4494"
        stroke="white"
        strokeWidth="1.91011"
        className={styles["rect-1"]}
      />
      <rect
        x="92.6406"
        y="91.4834"
        width="494.719"
        height="403.034"
        rx="113.652"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1.91011"
        className={styles["rect-2"]}
      />
      <rect
        x="46.7978"
        y="47.5508"
        width="586.405"
        height="490.899"
        rx="151.854"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="1.91011"
        className={styles["rect-3"]}
      />
      <rect
        x="0.955056"
        y="1.70799"
        width="678.09"
        height="582.584"
        rx="191.855"
        stroke="white"
        strokeOpacity="0.05"
        strokeWidth="1.91011"
        className={styles["rect-4"]}
      />
    </svg>
  );
};
export default BreathingRect;
