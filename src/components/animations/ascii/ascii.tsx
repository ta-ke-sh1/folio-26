import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mantine/core";
import { AsciiTypes } from "./types";

export interface AsciiCanvasProps {
  type: AsciiTypes;
  targetRef?: React.RefObject<HTMLDivElement | null>;
  defaultHeight?: number;
  color?: string;
}

export function AsciiCanvas({
  type,
  targetRef,
  defaultHeight = 120,
  color = "rgba(255, 119, 0, 0.45)",
}: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number>(defaultHeight);

  // Measure and track target element height dynamically
  useEffect(() => {
    const targetEl = targetRef?.current;
    if (!targetEl) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const measuredHeight = entry.contentRect.height;
        if (measuredHeight > 0) {
          setDynamicHeight(measuredHeight);
        }
      }
    });

    observer.observe(targetEl);
    setDynamicHeight(targetEl.getBoundingClientRect().height || defaultHeight);

    return () => observer.disconnect();
  }, [targetRef, defaultHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;
    let A = 0; // 3D Donut rotation angle A
    let B = 0; // 3D Donut rotation angle B

    const densityChars = " .:-=+*#%@";
    const binaryChars = "01";
    const matrixChars = "0101010101./\\|[]{}-+*#_";

    const fontSize = 12;
    let width = 0;
    let cols = 0;
    let rows = Math.floor(dynamicHeight / fontSize);
    let drops: number[] = [];

    let lastTime = performance.now();
    const frameInterval = type === "donut" ? 30 : 50;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;

      if (width > 0 && dynamicHeight > 0) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = dynamicHeight * dpr;

        ctx.scale(dpr, dpr);

        cols = Math.max(20, Math.floor(width / 8));
        rows = Math.floor(dynamicHeight / fontSize);

        if (drops.length !== cols) {
          drops = Array(cols)
            .fill(0)
            .map(() => Math.floor(Math.random() * rows));
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(container);
    updateDimensions();

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      const elapsed = now - lastTime;
      if (elapsed < frameInterval) return;
      lastTime = now - (elapsed % frameInterval);

      if (width === 0 || dynamicHeight === 0) return;

      ctx.clearRect(0, 0, width, dynamicHeight);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = color;

      frame += 0.02;
      const charWidth = width / cols;

      // --- ANIMATION 1: WAVE ---
      if (type === AsciiTypes.WAVE) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const v = Math.sin(c * 0.12 + frame) + Math.cos(r * 0.25 + frame);
            const charIdx = Math.floor(
              ((v + 2) / 4) * (densityChars.length - 1),
            );
            const char =
              densityChars[
                Math.max(0, Math.min(densityChars.length - 1, charIdx))
              ];
            ctx.fillText(char, c * charWidth, (r + 1) * fontSize);
          }
        }
      }

      // --- ANIMATION 2: MATRIX ---
      else if (type === AsciiTypes.MATRIX) {
        for (let c = 0; c < cols; c++) {
          const char =
            matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = c * charWidth;
          const y = drops[c] * fontSize;

          ctx.fillText(char, x, y);

          if (y > dynamicHeight && Math.random() > 0.95) {
            drops[c] = 0;
          }
          drops[c]++;
        }
      }

      // --- ANIMATION 3: CYBER GRID ---
      else if (type === AsciiTypes.CYBER_GRID) {
        const speed = (frame * 15) % fontSize;
        for (let r = 0; r < rows; r++) {
          const isHorizontalLine =
            (r * fontSize + speed) % (fontSize * 3) < fontSize;
          for (let c = 0; c < cols; c++) {
            const isVerticalLine = c % 4 === 0;
            let char = " ";
            if (isHorizontalLine && isVerticalLine) char = "+";
            else if (isHorizontalLine) char = "-";
            else if (isVerticalLine) char = "|";

            if (char !== " ") {
              ctx.fillText(char, c * charWidth, (r + 1) * fontSize);
            }
          }
        }
      }

      // --- ANIMATION 4: NOISE FIELD ---
      else if (type === AsciiTypes.NOISE_FIELD) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const n1 = Math.sin(c * 0.08 + frame * 0.5);
            const n2 = Math.cos(r * 0.12 - frame * 0.3);
            const n3 = Math.sin((c + r) * 0.05 + frame);
            const noiseVal = (n1 + n2 + n3 + 3) / 6;

            const charIdx = Math.floor(noiseVal * (densityChars.length - 1));
            const char =
              densityChars[
                Math.max(0, Math.min(densityChars.length - 1, charIdx))
              ];
            ctx.fillText(char, c * charWidth, (r + 1) * fontSize);
          }
        }
      }

      // --- ANIMATION 5: RADAR SCAN ---
      else if (type === AsciiTypes.RADAR_SCAN) {
        const centerX = cols / 2;
        const centerY = rows / 2;
        const scanAngle = frame % (Math.PI * 2);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dx = c - centerX;
            const dy = (r - centerY) * 2; // Correct aspect ratio
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = (Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2);

            let diff = scanAngle - angle;
            if (diff < 0) diff += Math.PI * 2;

            if (diff < 0.6) {
              const intensity = 1 - diff / 0.6;
              const charIdx = Math.floor(intensity * (densityChars.length - 1));
              const char = densityChars[charIdx];
              ctx.fillText(char, c * charWidth, (r + 1) * fontSize);
            } else if (Math.abs(dist - 12) < 0.5 || Math.abs(dist - 6) < 0.5) {
              ctx.fillText(".", c * charWidth, (r + 1) * fontSize);
            }
          }
        }
      }

      // --- ANIMATION 6: BINARY RAIN ---
      else if (type === AsciiTypes.BINARY_RAIN) {
        const rainChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        for (let c = 0; c < cols; c++) {
          // Pick a random character from the full alphabet & symbol set
          const char = rainChars[Math.floor(Math.random() * rainChars.length)];
          const x = c * charWidth;
          const y = drops[c] * fontSize;

          // Highlight the leading "head" character of the drop
          ctx.fillStyle =
            Math.random() > 0.25 ? color : "rgba(255, 220, 180, 0.95)";
          ctx.fillText(char, x, y);

          // Reset drop to top once it passes the bottom bound
          if (y > dynamicHeight && Math.random() > 0.92) {
            drops[c] = 0;
          }
          drops[c]++;
        }

        // Restore baseline color context
        ctx.fillStyle = color;
      }
      // --- ANIMATION 7: 3D DONUT ---
      else if (type === AsciiTypes.DONUT_3D) {
        A += 0.04;
        B += 0.02;

        const b: string[] = Array(cols * rows).fill(" ");
        const z: number[] = Array(cols * rows).fill(0);

        for (let j = 0; j < 6.28; j += 0.15) {
          for (let i = 0; i < 6.28; i += 0.07) {
            const cI = Math.cos(i);
            const sI = Math.sin(i);
            const cJ = Math.cos(j);
            const sJ = Math.sin(j);
            const cA = Math.cos(A);
            const sA = Math.sin(A);
            const cB = Math.cos(B);
            const sB = Math.sin(B);

            const h = cJ + 2; // R2 + R1*costheta
            const D = 1 / (sI * h * sA + sJ * cA + 5); // 1/z
            const t = sI * h * cA - sJ * sA;

            const x = Math.floor(
              cols / 2 + (cols / 3) * D * (cI * h * cB - t * sB),
            );
            const y = Math.floor(
              rows / 2 + (rows / 2) * D * (cI * h * sB + t * cB),
            );
            const o = x + cols * y;

            const N = Math.floor(
              8 *
                ((sJ * sA - sI * cJ * cA) * cB -
                  sI * cJ * sA -
                  sJ * cA -
                  cI * cJ * sB),
            );

            if (y >= 0 && y < rows && x >= 0 && x < cols && D > z[o]) {
              z[o] = D;
              b[o] = ".,-~:;=!*#$@"[Math.max(0, N)];
            }
          }
        }

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const char = b[c + r * cols];
            if (char && char !== " ") {
              ctx.fillText(char, c * charWidth, (r + 1) * fontSize);
            }
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [type, dynamicHeight, color]);

  return (
    <Box
      ref={containerRef}
      style={{
        width: "100%",
        height: `${dynamicHeight}px`,
        display: "block",
        overflow: "hidden",
        opacity: 0.6,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: `${dynamicHeight}px`,
        }}
      />
    </Box>
  );
}
