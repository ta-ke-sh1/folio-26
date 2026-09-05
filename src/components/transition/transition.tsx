import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { Box, Text, Group, Stack } from "@mantine/core";
import { ZIndexLevel } from "../../enums/styles.enum";

interface TransitionContextType {
  navigateTo: (to: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
);

// --- CRT Scanline & Grain Noise Canvas ---
function CrtNoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imgData.data.buffer);

      for (let i = 0; i < buffer.length; i++) {
        if (Math.random() < 0.12) {
          const noise = Math.floor(Math.random() * 45);
          buffer[i] = (255 << 24) | (noise << 16) | (noise << 8) | noise;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
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
        opacity: 0.85,
      }}
    />
  );
}

// --- Provider Component ---
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stage, setStage] = useState<"idle" | "enter" | "active" | "exit">(
    "idle",
  );
  const [progress, setProgress] = useState(0);
  const [destination, setDestination] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const navigateTo = (to: string) => {
    if (isTransitioning) return;

    const formattedDest =
      to === "/" ? "WELCOME BACK" : `${to.replace("/", "").toUpperCase()}`;

    setDestination(formattedDest);
    setIsTransitioning(true);
    setStage("enter");
    setProgress(0);
    setTerminalLogs([`> INITIALIZING_CHANNEL_SWITCH -> ${to}`]);

    // Fast turn-on flash (CRT expansion)
    setTimeout(() => {
      setStage("active");
    }, 200);

    // Sequence log steps spread across 3.5 seconds
    const steps = [
      `> SYSTEM_CHECK: VERIFIED`,
      `> LOCATING_TARGET_ROUTE: [${formattedDest}]`,
      `> ALLOCATING_VIRTUAL_DOM_BUFFERS...`,
      `> PRELOADING_ASYNC_COMPONENTS...`,
      `> COMPILED_CSS_MODULES: OK`,
      `> HYDRATING_STATE_TREE...`,
      `> VERIFYING_CANVAS_PIXEL_RATIO...`,
      `> ROUTE_READY: MOUNTING_PAGE...`,
    ];

    let currentStep = 0;
    const duration = 3500; // 3.5 Seconds transition
    const startTime = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Distribute logs sequentially across progress percentage
      const stepInterval = 100 / steps.length;
      if (pct > currentStep * stepInterval && currentStep < steps.length) {
        setTerminalLogs((prev) => [...prev, steps[currentStep]]);
        currentStep++;
      }

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        // Perform React Router route change
        navigate(to);

        // Allow 2 additional animation frames for React component tree mounting
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Stage 3: CRT collapse/turn-off animation
            setStage("exit");

            setTimeout(() => {
              setIsTransitioning(false);
              setStage("idle");
            }, 450);
          });
        });
      }
    };

    requestAnimationFrame(updateProgress);
  };

  return (
    <PageTransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {children}

      {isTransitioning && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#050505",
            zIndex: ZIndexLevel.HIGH + 1000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px",
            overflow: "hidden",
            pointerEvents: "all",
            animation:
              stage === "enter"
                ? "crtTurnOn 0.2s ease-out forwards"
                : stage === "exit"
                  ? "crtTurnOff 0.45s cubic-bezier(0.77, 0, 0.175, 1) forwards"
                  : "none",
          }}
        >
          {/* Static Scanline Background */}
          <CrtNoiseCanvas />

          {/* Top Bar Terminal Header */}
          <Group justify="space-between" style={{ zIndex: 2 }}>
            <Text
              size="xs"
              c="dimmed"
              style={{ fontFamily: "monospace", letterSpacing: "2px" }}
            >
              CH_NO: 26 // SIGNAL: LOCKED
            </Text>
            <Text
              size="xs"
              c="primaryOrange"
              style={{ fontFamily: "monospace", fontWeight: 700 }}
            >
              [{progress.toString().padStart(3, "0")}%]
            </Text>
          </Group>

          {/* Center Content: Destination + Terminal Stream */}
          <Stack
            align="center"
            justify="center"
            style={{ flex: 1, zIndex: 2 }}
            gap="md"
          >
            <Text
              style={{
                fontSize: "clamp(36px, 7vw, 84px)",
                fontWeight: 900,
                color: "#FF7700",
                fontFamily: "monospace",
                letterSpacing: "-2px",
                lineHeight: 1,
                textShadow: "0 0 12px rgba(255, 119, 0, 0.6)",
              }}
            >
              {destination}
            </Text>

            {/* Terminal Log Console */}
            <Box
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                border: "1px solid rgba(255, 119, 0, 0.25)",
                padding: "16px 24px",
                borderRadius: "4px",
                minWidth: "320px",
                maxWidth: "480px",
                fontFamily: "monospace",
              }}
            >
              {terminalLogs.map((log, index) => (
                <Text
                  key={index}
                  size="xs"
                  c={
                    index === terminalLogs.length - 1
                      ? "primaryOrange"
                      : "dimmed"
                  }
                  style={{ fontFamily: "monospace", lineHeight: "1.6" }}
                >
                  {log}
                </Text>
              ))}
            </Box>
          </Stack>

          {/* Bottom Bar Details */}
          <Group justify="space-between" style={{ zIndex: 2 }}>
            <Text size="xs" c="dimmed" style={{ fontFamily: "monospace" }}>
              NTSC 60Hz
            </Text>
            <Text size="xs" c="dimmed" style={{ fontFamily: "monospace" }}>
              PRELOADING VIRTUAL DOM...
            </Text>
          </Group>

          {/* Keyframes for CRT Animations */}
          <style>{`
            @keyframes crtTurnOn {
              0% {
                transform: scale(1, 0.002);
                filter: brightness(30);
              }
              50% {
                transform: scale(1, 0.005);
                filter: brightness(10);
              }
              100% {
                transform: scale(1, 1);
                filter: brightness(1);
              }
            }

            @keyframes crtTurnOff {
              0% {
                transform: scale(1, 1);
                filter: brightness(1);
              }
              40% {
                transform: scale(1, 0.004);
                filter: brightness(8);
              }
              80% {
                transform: scale(0.002, 0.004);
                filter: brightness(50);
              }
              100% {
                transform: scale(0, 0);
                filter: brightness(100);
              }
            }
          `}</style>
        </Box>
      )}
    </PageTransitionContext.Provider>
  );
}

export function useAnimatedNavigate() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "useAnimatedNavigate must be used within a PageTransitionProvider",
    );
  }
  return context.navigateTo;
}
