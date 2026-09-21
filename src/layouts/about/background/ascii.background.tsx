import { useRef, useEffect } from "react";

export default // --- LIGHTWEIGHT ANIMATED ASCII & WAVE BACKGROUND ---
function AsciiWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const asciiChars = " .:-=+*#%@";

    const draw = () => {
      time += 0.015;
      ctx.fillStyle = "#0e0600"; // Deep dark background with warm orange baseline
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Layer 1: Smooth Sine Waves
      const waves = [
        {
          amplitude: 45,
          frequency: 0.008,
          speed: 0.02,
          color: "rgba(255, 119, 0, 0.22)",
          yOffset: 0.35,
        },
        {
          amplitude: 60,
          frequency: 0.005,
          speed: 0.015,
          color: "rgba(255, 146, 43, 0.18)",
          yOffset: 0.55,
        },
        {
          amplitude: 35,
          frequency: 0.012,
          speed: 0.025,
          color: "rgba(230, 107, 0, 0.25)",
          yOffset: 0.75,
        },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        const baseY = canvas.height * wave.yOffset;
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 12) {
          const y =
            baseY +
            Math.sin(x * wave.frequency + time * wave.speed * 50) *
              wave.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // Layer 2: Lightweight ASCII Matrix Wave Overlay
      const fontSize = 16;
      const cols = Math.floor(canvas.width / fontSize);
      const rows = Math.floor(canvas.height / fontSize);
      ctx.font = `${fontSize}px monospace`;

      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          const x = c * fontSize;
          const y = r * fontSize;

          // Trigonometric wave math for ASCII character intensity
          const waveVal =
            Math.sin(c * 0.12 + time * 1.8) + Math.cos(r * 0.1 + time * 1.2);
          const norm = (waveVal + 2) / 4; // 0..1 range

          if (norm > 0.38) {
            const charIdx = Math.floor(norm * (asciiChars.length - 1));
            const char = asciiChars[charIdx];
            const alpha = (norm - 0.38) * 0.4;
            ctx.fillStyle = `rgba(255, 140, 30, ${alpha.toFixed(2)})`;
            ctx.fillText(char, x, y);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        borderRadius: 10,
        zIndex: 0,
      }}
    />
  );
}
