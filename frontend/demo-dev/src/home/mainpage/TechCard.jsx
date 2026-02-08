import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MoreVertical, GitFork } from "lucide-react";
import "./TechCard.css";

const TechCard = ({ icon: Icon, title, description, forks, color, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`tech-card ${
        isInView ? "tech-card--animate" : ""
      } tech-card--stagger-${(index % 6) + 1}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="tech-card__glow" />

      <div className="tech-card__header">
        <div
          className={`tech-card__icon-wrapper tech-card__icon-wrapper--${color}`}
        >
          <Icon className={`tech-card__icon tech-card__icon--${color}`} />
        </div>

        <div className="tech-card__menu">
          <MoreVertical size={16} />
        </div>
      </div>

      <h3 className="tech-card__title">{title}</h3>
      <p className="tech-card__description">{description}</p>

      <div className="tech-card__footer">
        <GitFork className="tech-card__stat-icon" />
        <span className="tech-card__stat">{forks}</span>
      </div>
    </motion.div>
  );
};

export default TechCard;
