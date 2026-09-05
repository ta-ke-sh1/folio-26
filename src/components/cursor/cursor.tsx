import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Fast position interpolation using GSAP quickTo
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });

    const xRing = gsap.quickTo(ring, "x", {
      duration: 0.3,
      ease: "power2.out",
    });
    const yRing = gsap.quickTo(ring, "y", {
      duration: 0.3,
      ease: "power2.out",
    });

    let isHovered = false;
    let isClicked = false;

    const updateStateAnimation = () => {
      if (isClicked) {
        // Click State: Squashes ring, rotates 45 deg, dark orange fill
        gsap.to(ring, {
          scale: 0.75,
          borderRadius: "30%",
          rotate: 45,
          backgroundColor: "rgba(255, 115, 0, 0.35)",
          borderColor: "rgba(255, 115, 0, 1)",
          duration: 0.15,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 0.5, duration: 0.15, overwrite: "auto" });
      } else if (isHovered) {
        // Hover State: Expands ring, glows orange
        gsap.to(ring, {
          scale: 1.6,
          borderRadius: "50%",
          rotate: 0,
          backgroundColor: "rgba(255, 115, 0, 0.15)",
          borderColor: "rgba(255, 115, 0, 0.9)",
          duration: 0.25,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 1.5, duration: 0.25, overwrite: "auto" });
      } else {
        // Default State: Circular outline
        gsap.to(ring, {
          scale: 1,
          borderRadius: "50%",
          rotate: 0,
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(255, 255, 255, 0.6)",
          duration: 0.25,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 1, duration: 0.25, overwrite: "auto" });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Center offsets
      xDot(e.clientX - 4);
      yDot(e.clientY - 4);
      xRing(e.clientX - 18);
      yRing(e.clientY - 18);

      // Check for interactive targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.onclick !== null ||
          target.getAttribute("role") === "button" ||
          window.getComputedStyle(target).cursor === "pointer";

        if (interactive !== isHovered) {
          isHovered = interactive;
          updateStateAnimation();
        }
      }
    };

    const handleMouseDown = () => {
      isClicked = true;
      updateStateAnimation();
    };

    const handleMouseUp = () => {
      isClicked = false;
      updateStateAnimation();
    };

    const handleMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Center Small Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          backgroundColor: "#ff7300",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
      />

      {/* Outer Spring Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: "1.5px solid rgba(255, 255, 255, 0.6)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          mixBlendMode: "difference",
          transform: "translate(-100px, -100px)",
          willChange: "transform, border-radius",
        }}
      />
    </>
  );
}
