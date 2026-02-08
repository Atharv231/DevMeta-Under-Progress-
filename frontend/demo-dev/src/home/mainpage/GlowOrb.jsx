import { motion } from "framer-motion";
import "./GlowOrb.css";

const colorMap = {
  cyan: "var(--glow-cyan)",
  violet: "var(--glow-violet)",
  blue: "var(--glow-blue)",
};

const GlowOrb = ({ size = 400, color = "cyan", className = "", delay = 0 }) => {
  return (
    <motion.div
      className={`glow-orb ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(
          circle,
          hsl(${colorMap[color]} / 0.3) 0%,
          hsl(${colorMap[color]} / 0.1) 30%,
          transparent 70%
        )`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export default GlowOrb;
