import { useEffect, useRef } from "react";
import { Box } from "@mantine/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import StorySection from "./story.section";
import "./main.layout.scss";

gsap.registerPlugin(ScrollTrigger);

type AsciiLandingPageProps = {
  embedded?: boolean;
};

export default function LandingPage({
  embedded = false,
}: AsciiLandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const storySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedded) return;

    let previousWidth = window.innerWidth;
    let previousHeight = window.innerHeight;
    let resizeTimer: number | undefined;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const nextWidth = window.innerWidth;
        const nextHeight = window.innerHeight;
        const widthChanged = Math.abs(nextWidth - previousWidth) > 1;
        const heightChanged = Math.abs(nextHeight - previousHeight) > 1;

        previousWidth = nextWidth;
        previousHeight = nextHeight;

        // Ignore mobile browser chrome/keyboard height changes; orientation and
        // width changes still reload so viewport-dependent layouts are rebuilt.
        if (widthChanged || (!isCoarsePointer && heightChanged)) {
          window.location.reload();
        }
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(resizeTimer);
    };
  }, [embedded]);


  return (
    <Box
      ref={containerRef}
      className={`ascii-landing-page${embedded ? " ascii-landing-page--embedded" : ""}`}
      style={{
        position: "relative",
        width: embedded ? "100%" : undefined,
        height: embedded ? "auto" : undefined,
        minHeight: embedded ? 0 : "100vh",
        overflowX: embedded ? "visible" : "clip",
        flex: embedded ? "0 0 auto" : undefined,
        isolation: embedded ? "isolate" : undefined,
        transform: embedded ? "translateZ(0)" : undefined,
        backgroundColor: "var(--folio-page-bg)",
      }}
    >
      {/* Foreground Scrolling Content Layer */}
      <Box
        style={{ position: "relative", zIndex: 3, color: "var(--folio-text)" }}
      >
        <LayoutWrapper>
          <Box
            ref={storySectionRef}
            className="homepage-content"
            style={{
              backgroundColor: "var(--folio-page-bg)",
              position: "relative",
              zIndex: 10,
              pointerEvents: "auto",
              willChange: "transform",
              marginBottom: embedded ? 0 : "20px",
            }}
          >
            <StorySection embedded={embedded} />
          </Box>
        </LayoutWrapper>
      </Box>
    </Box>
  );
}
