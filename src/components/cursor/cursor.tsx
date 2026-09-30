import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { maxWidth } from "../../styles/breakpoints";

type CursorMode =
  | "default"
  | "pointer"
  | "help"
  | "crosshair"
  | "zoom-in"
  | "grab"
  | "grabbing";

const INTERACTIVE_TARGETS =
  'button, a, input, textarea, select, [role="button"], [role="radio"], [aria-pressed], [tabindex]:not([tabindex="-1"])';

function getCursorMode(target: Element | null, isPressed: boolean): CursorMode {
  if (!target) return "default";

  if (target.closest(".footer-console__watcher")) return "crosshair";
  if (target.closest(".homepage-story-signal-planet")) return "help";
  if (target.closest(".homepage-story-signal-planet-marker")) return "pointer";
  if (target.closest(".memories-tv__screen-frame")) return "zoom-in";

  const flowTarget = target.closest(
    ".technology-flow .react-flow__pane, .technology-flow .react-flow__node",
  );
  if (flowTarget) {
    if (window.matchMedia(maxWidth("sm")).matches) return "default";
    return isPressed ? "grabbing" : "grab";
  }

  if (target.closest(INTERACTIVE_TARGETS)) return "pointer";

  if (
    target.closest(".instrument-window__titlebar") &&
    window.matchMedia(maxWidth("sm")).matches
  ) {
    return "default";
  }

  const customCursor = target.closest<HTMLElement>("[data-cursor]");
  const requestedMode = customCursor?.dataset.cursor;
  if (
    requestedMode === "pointer" ||
    requestedMode === "default" ||
    requestedMode === "grab" ||
    requestedMode === "grabbing"
  ) {
    return requestedMode === "grab" && isPressed ? "grabbing" : requestedMode;
  }

  if (target.closest(".instrument-window__titlebar")) {
    if (window.matchMedia(maxWidth("sm")).matches) return "default";
    return isPressed ? "grabbing" : "grab";
  }

  return "default";
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");

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

    let isClicked = false;
    let currentMode: CursorMode = "default";
    let lastTarget: Element | null = null;

    const updateStateAnimation = (nextMode: CursorMode) => {
      if (nextMode !== currentMode) {
        currentMode = nextMode;
        setMode(nextMode);
      }

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
      } else if (nextMode === "pointer") {
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
      } else if (nextMode === "crosshair") {
        gsap.to(ring, {
          scale: 1,
          borderRadius: "50%",
          rotate: 0,
          backgroundColor: "rgba(255, 115, 0, 0.04)",
          borderColor: "rgba(255, 153, 66, 0.95)",
          duration: 0.2,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 0.65, duration: 0.2, overwrite: "auto" });
      } else if (nextMode === "help" || nextMode === "zoom-in") {
        gsap.to(ring, {
          scale: nextMode === "zoom-in" ? 1.3 : 1.15,
          borderRadius: "50%",
          rotate: 0,
          backgroundColor: "rgba(255, 115, 0, 0.16)",
          borderColor: "rgba(255, 153, 66, 0.95)",
          duration: 0.22,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 0, duration: 0.18, overwrite: "auto" });
      } else if (nextMode === "grab" || nextMode === "grabbing") {
        gsap.to(ring, {
          scale: nextMode === "grabbing" ? 0.85 : 1.08,
          borderRadius: nextMode === "grabbing" ? "38%" : "50%",
          rotate: 0,
          backgroundColor:
            nextMode === "grabbing"
              ? "rgba(255, 115, 0, 0.28)"
              : "rgba(255, 115, 0, 0.08)",
          borderColor: "rgba(255, 153, 66, 0.95)",
          duration: 0.2,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 0, duration: 0.18, overwrite: "auto" });
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

      lastTarget = e.target instanceof Element ? e.target : null;
      updateStateAnimation(getCursorMode(lastTarget, isClicked));
    };

    const handleMouseDown = (e: MouseEvent) => {
      lastTarget = e.target instanceof Element ? e.target : lastTarget;
      isClicked = true;
      updateStateAnimation(getCursorMode(lastTarget, true));
    };

    const handleMouseUp = () => {
      isClicked = false;
      updateStateAnimation(getCursorMode(lastTarget, false));
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

  return createPortal(
    <>
      {/* Center Small Dot */}
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          backgroundColor: "#ff7300",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 2147483647,
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
      />

      {/* Outer Spring Ring */}
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: "1.5px solid rgba(255, 255, 255, 0.6)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 2147483646,
          mixBlendMode: "difference",
          transform: "translate(-100px, -100px)",
          willChange: "transform, border-radius",
        }}
      >
        {mode === "crosshair" && (
          <>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 52,
                height: 1,
                background: "rgba(255, 153, 66, 0.9)",
                transform: "translate(-50%, -50%)",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 1,
                height: 52,
                background: "rgba(255, 153, 66, 0.9)",
                transform: "translate(-50%, -50%)",
              }}
            />
          </>
        )}
        {(mode === "help" || mode === "zoom-in" || mode === "grab" || mode === "grabbing") && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              color: "#ffad66",
              font: "700 16px/1 monospace",
              transform: "translate(-50%, -50%)",
              userSelect: "none",
            }}
          >
            {mode === "help" ? "?" : mode === "zoom-in" ? "+" : "⋮"}
          </span>
        )}
      </div>
    </>,
    document.body,
  );
}
