import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function useLenisSection(containerRef) {
  useEffect(() => {
    if (!containerRef?.current) return;

    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: containerRef.current,
      duration: 1.6, // slower, premium feel
      smooth: true,
      smoothTouch: false,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [containerRef]);
}
