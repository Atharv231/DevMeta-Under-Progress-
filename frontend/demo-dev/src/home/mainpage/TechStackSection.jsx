import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code,
  Coffee,
  Cpu,
  FileCode2,
  FileType,
  BarChart3,
  Gem,
  Zap,
} from "lucide-react";
import "./TechStackSection.css";

const languages = [
  { id: "python", name: "Python", icon: Code, angle: 0, distance: 280 },
  { id: "java", name: "Java", icon: Coffee, angle: 51.4, distance: 300 },
  { id: "cpp", name: "C++", icon: Cpu, angle: 102.8, distance: 260 },
  {
    id: "javascript",
    name: "JavaScript",
    icon: FileCode2,
    angle: 154.2,
    distance: 290,
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: FileType,
    angle: 205.7,
    distance: 270,
  },
  { id: "r", name: "R", icon: BarChart3, angle: 257.1, distance: 285 },
  { id: "ruby", name: "Ruby", icon: Gem, angle: 308.5, distance: 265 },
];

const TechStackSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const isHeaderInView = useInView(headerRef, {
    once: true,
    margin: "-50px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const coreRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const pathRotate1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const pathRotate2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section className="tech-orbit-section" ref={sectionRef}>
      {/* Ambient Background */}
      <div className="tech-orbit-ambient" />
      <div className="tech-orbit-grid" />

      {/* Floating Particles */}

      <div className="tech-orbit-container">
        {/* Header */}
        <motion.div
          className="tech-orbit-header"
          ref={headerRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <h2 className="tech-orbit-title">
            Code in Any
            <span className="tech-orbit-title-gradient"> Language.</span>
          </h2>

          <p className="tech-orbit-subtitle">
            Real-time collaboration across every major programming language.
          </p>
        </motion.div>

        {/* Orbital Hub */}
        <div className="tech-orbit-hub">
          {/* Orbital Paths */}
          <motion.div
            className="tech-orbit-path tech-orbit-path--1"
            style={{ rotate: pathRotate1 }}
          />
          <motion.div
            className="tech-orbit-path tech-orbit-path--2"
            style={{ rotate: pathRotate2 }}
          />
          <div className="tech-orbit-path tech-orbit-path--3" />
          <div className="tech-orbit-path tech-orbit-path--4" />

          {/* Center Core */}
          <div className="tech-orbit-core">
            <motion.div
              className="tech-orbit-core-outer"
              style={{ rotate: coreRotate }}
            />
            <div className="tech-orbit-core-inner">
              <Zap className="tech-orbit-core-icon" />
            </div>
            <div className="tech-orbit-core-pulse" />
            <div className="tech-orbit-core-pulse tech-orbit-core-pulse--2" />
            <div className="tech-orbit-core-pulse tech-orbit-core-pulse--3" />
          </div>

          {/* Language Items */}
          {languages.map((lang, index) => {
            const Icon = lang.icon;
            const angleRad = (lang.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * lang.distance;
            const y = Math.sin(angleRad) * lang.distance;

            const itemOpacity = useTransform(
              scrollYProgress,
              [0, 0.1 + index * 0.03, 0.35, 0.85, 1],
              [0, 1, 1, 1, 0],
            );

            const itemScale = useTransform(
              scrollYProgress,
              [0, 0.15, 0.5, 0.85, 1],
              [0.6, 1, 1, 1, 0.7],
            );

            const itemY = useTransform(
              scrollYProgress,
              [0, 0.2, 0.5, 0.8, 1],
              [80, 0, 0, 0, -40],
            );

            const beamAngle = lang.angle + 180;
            const beamLength = lang.distance - 80;

            return (
              <motion.div
                key={lang.id}
                className="tech-orbit-lang"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  translateX: "-50%",
                  translateY: "-50%",
                  opacity: itemOpacity,
                  scale: itemScale,
                  y: itemY,
                }}
              >
                {/* Connection Beam */}
                <div
                  className="tech-orbit-lang-beam"
                  style={{
                    height: `${beamLength}px`,
                    transform: `rotate(${beamAngle}deg)`,
                    bottom: "50%",
                  }}
                />

                {/* Glow */}
                <div
                  className={`tech-orbit-lang-glow tech-orbit-lang-glow--${lang.id}`}
                />

                {/* Card */}
                <div className="tech-orbit-lang-card">
                  <div
                    className={`tech-orbit-lang-icon tech-orbit-lang-icon--${lang.id}`}
                  >
                    <Icon className="tech-orbit-lang-svg" />
                  </div>
                  <div className="tech-orbit-lang-name">{lang.name}</div>
                  <div className="tech-orbit-lang-stats">
                    <div className="tech-orbit-lang-stat-bar">
                      <div
                        className={`tech-orbit-lang-stat-fill tech-orbit-lang-stat-fill--${lang.id}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
