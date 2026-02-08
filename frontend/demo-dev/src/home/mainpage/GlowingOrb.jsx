import { motion } from "framer-motion";
import "./glowing-orb.css";

const colorMap = {
  cyan: "hsl(185, 100%, 50%)",
  blue: "hsl(220, 100%, 60%)",
  purple: "hsl(270, 100%, 65%)",
};

export const GlowingOrb = ({
  size = 300,
  color = "cyan",
  className = "",
  delay = 0,
}) => {
  const baseColor = colorMap[color];

  return (
    <motion.div
      className={`glowing-orb ${className}`}
      style={{
        width: size,
        height: size,
        "--orb-color": baseColor,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};
