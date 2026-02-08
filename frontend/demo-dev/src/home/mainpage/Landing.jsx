import { useEffect, useLayoutEffect, useRef } from "react";
import Second from "./Second";
import Demo2 from "./Demo2";
import RealtimeSection from "./RealtimeSection";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./land.css";
import CommunicationSection from "./CommunicationSection";
import TechStackSection from "./TechStackSection";
import { CTAFinal } from "./CTAFinal";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function Landing() {
  const FRAME_OFFSET = 10; // image files start at frame_0010.webp
  const TOTAL_FRAMES = 287;
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const indicatorRef = useRef(null);
  const frames = useRef({ currentIndex: 1 });
  const images = useRef([]);

  // ================== LOCK CANVAS SIZE (ONCE) ==================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1920;
    canvas.height = 1080;
  }, []);

  // ================== FIRST PAINT (NO BG FLASH) ==================
  useLayoutEffect(() => {
    const img = new Image();
    img.src = `/images/frame_${String(FRAME_OFFSET).padStart(4, "0")}.webp`;

    img.onload = () => {
      images.current[0] = img;
      frames.current.currentIndex = 1;
      drawFrame(1);
    };
  }, []);

  // ================== LOAD ALL FRAMES ==================
  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/images/frame_${String(i + FRAME_OFFSET - 1).padStart(4, "0")}.webp`;
      images.current[i - 1] = img;
    }
  }, []);

  // ================== DRAW FRAME ==================
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    const img = images.current[index - 1];

    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  // ================== SCROLL LOGIC (UNCHANGED) ==================
  useEffect(() => {
    gsap.set(".ani1", { opacity: 0 });
    gsap.set(".ani2", { opacity: 0 });
    gsap.set(".ani3", { opacity: 0, y: 60 });
    gsap.set(".ani4", { opacity: 0, x: 60 });
    gsap.set(indicatorRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".parent",
        start: "top top",
        end: "bottom top",
        scrub: 2,
        onUpdate: (self) => {
          gsap.to(indicatorRef.current, {
            opacity: self.progress > 0.02 ? 0 : 1,
            duration: 0.3,
          });
        },
      },
    });

    const updateFrame = (index) => ({
      currentIndex: index,
      ease: "none",
      onUpdate: () => {
        drawFrame(Math.round(frames.current.currentIndex));
      },
    });

    tl.to(frames.current, updateFrame(100), "T1")
      .to(".ani1", { opacity: 1 }, "T1")
      .to(frames.current, updateFrame(130), "T2")
      .to(".ani2", { opacity: 1 }, "T2")
      .to(frames.current, updateFrame(190), "T3")
      .to(
        ".ani3",
        { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" },
        "T3",
      )
      .to(frames.current, updateFrame(240), "T4")
      .to(
        ".ani4",
        {
          opacity: 1,
          x: 0,

          ease: "power3.out",
        },
        "T4",
      );
    // .to(frames.current, updateFrame(287), "T5")
    // .to(".ani1", { opacity: 0 }, "T5")
    // .to(".ani2", { opacity: 0 }, "T5")
    // .to(
    //   ".ani3",
    //   { opacity: 0, y: 60, duration: 0.8, ease: "power3.out" },
    //   "T5",
    // )
    // .to(
    //   ".ani4",
    //   {
    //     opacity: 0,
    //     x: 60,
    //     duration: 0.8,
    //     ease: "power3.out",
    //   },
    //   "T5",
    // );

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <>
      <div>
        <div className="parent">
          <div>
            {/* WAVE LOGO */}
            <div className="wave-container">
              <h1 className="wave-text">
                <span>D</span>
                <span>E</span>
                <span>v</span>
                <span>M</span>
                <span>a</span>
                <span>t</span>
                <span>e</span>
              </h1>
            </div>

            {/* SCROLL INDICATOR */}
            <div className="scroll-indicator" ref={indicatorRef}>
              <svg
                width="40"
                height="40"
                margin-top="19px"
                viewBox="0 0 24 36"
                fill="none"
                stroke="#ffffff"
                z-index="20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="32" rx="10" />
                <circle cx="12" cy="12" r="2">
                  <animate
                    attributeName="cy"
                    from="10"
                    to="18"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>

            {/* CANVAS */}
            <canvas ref={canvasRef} />

            <div className="animate1">
              <section className="hero parallax">
                <div className="sticky">
                  <div className="layer reveal">
                    <h1 className="heading">
                      <span className="ani2">
                        A Shared <br />
                      </span>

                      <span className="f1 ani1 gradient-text">Workspace </span>

                      <span className="ani2">Built For Real Development</span>
                    </h1>

                    <p className="ani3">
                      Devmate is an online code editor where people work
                      together in real time. Code, discussion, and
                      problem-solving stay inside one focused environment.
                    </p>
                    <div className="actions">
                      <button
                        className="styled-button ani4"
                        onClick={() => {
                          navigate(`/create`); // Search page
                        }}
                      >
                        Enter Workspace
                        <div cl="inner-button"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <Demo2 />
        <Second />
        <CommunicationSection />

        <TechStackSection />
        <CTAFinal />
        <Footer />
      </div>
    </>
  );
}

export default Landing;
