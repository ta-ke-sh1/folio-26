import { useEffect, useRef, useState } from "react";
import { Container, Stack, Badge, Grid, Text, Box } from "@mantine/core";

interface AsciiCanvasProps {
  type: "wave" | "matrix";
  targetRef?: React.RefObject<HTMLDivElement | null>;
  defaultHeight?: number;
}

function AsciiCanvas({
  type,
  targetRef,
  defaultHeight = 120,
}: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number>(defaultHeight);

  // Measure and track target text block height dynamically
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

    const chars = type === "wave" ? " .:-=+*#%@" : "0101010101./\\|[]{}-+*#_";

    const fontSize = 12;
    let width = 0;
    let cols = 0;
    let rows = Math.floor(dynamicHeight / fontSize);
    let drops: number[] = [];

    let lastTime = performance.now();
    const frameInterval = type === "wave" ? 50 : 80;

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
      ctx.fillStyle = "rgba(255, 119, 0, 0.45)";

      frame += 0.015;

      const charWidth = width / cols;

      if (type === "wave") {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const v = Math.sin(c * 0.12 + frame) + Math.cos(r * 0.25 + frame);
            const charIdx = Math.floor(((v + 2) / 4) * (chars.length - 1));
            const char =
              chars[Math.max(0, Math.min(chars.length - 1, charIdx))];

            ctx.fillText(char, c * charWidth, (r + 1) * fontSize);
          }
        }
      } else {
        for (let c = 0; c < cols; c++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = c * charWidth;
          const y = drops[c] * fontSize;

          ctx.fillText(char, x, y);

          if (y > dynamicHeight && Math.random() > 0.95) {
            drops[c] = 0;
          }
          drops[c]++;
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [type, dynamicHeight]);

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

// --- Main Component ---
export function Story() {
  const storyTextRef = useRef<HTMLDivElement | null>(null);
  const strategyTextRef = useRef<HTMLDivElement | null>(null);

  return (
    <Container fluid mt="100px">
      <Stack gap={60}>
        {/* Section Header */}
        <Stack gap="md" mt="60px">
          <Badge
            size="lg"
            variant="dot"
            color="primaryOrange"
            style={{ width: "fit-content" }}
          >
            I. About
          </Badge>

          <Grid align="flex-start">
            {/* Story Heading Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              style={{
                position: "relative",
              }}
            >
              <Text
                size="xl"
                c="white"
                style={{
                  fontSize: 20,
                  fontWeight: 200,
                  letterSpacing: "-1px",
                  maxWidth: "50dvw",
                  position: "absolute",
                  left: 10,
                  top: 10,
                  zIndex: 2,
                }}
              >
                {"I.a. Story"}
              </Text>
              {/* ASCII Wave Animation height matched to storyTextRef */}
              <AsciiCanvas type="wave" targetRef={storyTextRef} />
            </Grid.Col>

            {/* Story Content Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              style={{
                position: "relative",
              }}
            >
              <div ref={storyTextRef}>
                <Text
                  size="xl"
                  c="white"
                  style={{
                    fontSize: 64,
                    maxWidth: "50dvw",
                    lineHeight: "60px",
                  }}
                >
                  {`Mainly proficient in simulations, my development expertise focuses
              on replicating life events and interactions into the programming
              scene. I enjoy combining visual design with digital strategy.`.toUpperCase()}
                </Text>
              </div>
            </Grid.Col>

            {/* Strategy Content Column */}
            <Grid.Col span={{ base: 12, md: 6 }} mt="xl">
              <div ref={strategyTextRef}>
                <Text
                  size="xl"
                  c="white"
                  style={{
                    fontSize: 64,
                    maxWidth: "50dvw",
                    lineHeight: "60px",
                  }}
                >
                  {`My works aims to serve its purposes while maintaining a certain degree
              of personal aesthetic preferenes.`.toUpperCase()}
                </Text>
              </div>
            </Grid.Col>

            {/* Strategy Heading Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              mt="xl"
              style={{
                position: "relative",
              }}
            >
              <Text
                size="xl"
                c="white"
                style={{
                  fontSize: 20,
                  fontWeight: 200,
                  letterSpacing: "-1px",
                  maxWidth: "50dvw",
                  position: "absolute",
                  left: 10,
                  top: 10,
                  zIndex: 2,
                }}
              >
                {"I.b. Strategy"}
              </Text>
              {/* ASCII Matrix Animation height matched to strategyTextRef */}
              <AsciiCanvas type="matrix" targetRef={strategyTextRef} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
}
