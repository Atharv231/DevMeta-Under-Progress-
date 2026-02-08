import { motion } from "framer-motion";
import "./LiveCursor.css";

const LiveCursor = ({ name, color, delay = 0, path }) => {
  return (
    <motion.div
      className="live-cursor"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: path?.x || [0, 20, -10, 30, 0],
        y: path?.y || [0, -10, 20, 5, 0],
      }}
      transition={{
        opacity: { duration: 0.3, delay },
        scale: { duration: 0.3, delay },
        x: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        },
        y: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        },
      }}
    >
      <svg
        width="18"
        height="24"
        viewBox="0 0 18 24"
        fill="none"
        className="cursor-icon"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      >
        <path
          d="M2.5 2L15.5 11.5L9 12.5L6 21L2.5 2Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
        />
      </svg>

      <span className="cursor-label" style={{ backgroundColor: color }}>
        {name}
      </span>
    </motion.div>
  );
};

export default LiveCursor;
