import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import "./land.css";
import RealtimeSection from "./RealtimeSection";

gsap.registerPlugin(ScrollTrigger);

export default function Second() {
  const galleryWrapRef = useRef(null);
  const galleryTitleRef = useRef(null);
  const panelRefs = useRef([]);

  panelRefs.current = [];

  const addPanelRef = (el) => {
    if (el && !panelRefs.current.includes(el)) {
      panelRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    /* ================= LENIS ================= */
    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* ================= MATCH MEDIA ================= */
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1000px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".gallery-section",
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        galleryTitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
      );

      tl.fromTo(
        galleryWrapRef.current,
        { width: "75%" },
        { width: "60%", duration: 0.5 },
        "<",
      );

      tl.to(galleryWrapRef.current, {
        gap: "20px",
        duration: 0.5,
        ease: "power3.out",
      });

      tl.to(
        panelRefs.current,
        {
          borderRadius: "20px",
          duration: 0.5,
          ease: "power3.out",
        },
        "<",
      );

      tl.to(panelRefs.current, {
        rotationY: 180,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.1,
      });

      tl.to(
        [panelRefs.current[0], panelRefs.current[2]],
        {
          y: 30,
          rotationZ: (i) => [-15, 15][i],
          duration: 0.8,
          ease: "power3.inOut",
        },
        "<",
      );
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <section className="gallery-section">
        <div className="gallery-title">
          <h1 className="har1" ref={galleryTitleRef}>
            The Details That <span className="cr">Make</span> the Difference
          </h1>
        </div>

        <div className="gallery-wrap" ref={galleryWrapRef}>
          <div className="flip-panel panel-a" ref={addPanelRef}>
            <div className="panel-front">
              <img src="/images/row-1-column-1.png" alt="" />
            </div>
            <div className="panel-back">
              <span>( 01 )</span>
              <p className="par1">
                Code in real time with developers from around the world. One
                workspace
              </p>
            </div>
          </div>

          <div className="flip-panel panel-b" ref={addPanelRef}>
            <div className="panel-front">
              <img src="/images/row-1-column-2.png" alt="" />
            </div>
            <div className="panel-back">
              <span>( 02 )</span>
              <p className="par1">
                Write, run, and debug code in a true cloud workspace
              </p>
            </div>
          </div>

          <div className="flip-panel panel-c" ref={addPanelRef}>
            <div className="panel-front">
              <img src="/images/row-1-column-3.png" alt="" />
            </div>
            <div className="panel-back">
              <span>( 03 )</span>
              <p className="par1">
                Turn concepts into working code faster. Collaborate, experiment
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
