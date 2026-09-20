import { useState, useRef, useEffect } from "react";
import {
  Box,
  Image,
  Group,
  MantineProvider,
  Stack,
  Title,
  Text,
  createTheme,
  Grid,
  Badge,
  ActionIcon,
  Paper,
} from "@mantine/core";
import {
  IconCat,
  IconTrophy,
  IconClock,
  IconCamera,
  IconX,
  IconTerminal,
  IconGripHorizontal,
  IconCheck,
} from "@tabler/icons-react";
import Footer from "../../components/footer/footer";

const theme = createTheme({
  primaryColor: "orange",
  colors: {
    orange: [
      "#fff4e6",
      "#ffe8cc",
      "#ffd8a8",
      "#ffc078",
      "#ffa94d",
      "#ff922b",
      "#ff8000",
      "#FF7700",
      "#e66b00",
      "#cc5f00",
    ],
  },
  fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
});

// --- LIGHTWEIGHT ANIMATED ASCII & WAVE BACKGROUND ---
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

interface InteractiveItem {
  id: string;
  label: string;
  category: string;
  icon: React.ElementType;
  appIconUrl?: string;
  tag: string;
  content: {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    details?: { key: string; val: string }[];
  };
}

const ITEMS: InteractiveItem[] = [
  {
    id: "pets",
    label: "PETS",
    category: "SYS_BIO",
    icon: IconCat,
    tag: "CAT_V1.0",
    content: {
      title: "BOBA & FELIX",
      subtitle: "Full-time Debugging Assistants & Nap Specialists",
      description:
        "Engineered for high-frequency purring and automated keyboard sitting. Primary duties include monitoring code deployments and enforcing mandatory screen breaks.",
      highlights: [
        "Senior Code Inspector (Specializing in Async Ops)",
        "Zero downtime nap scheduling",
        "High tolerance for Mechanical Keyboard noise",
      ],
      details: [
        { key: "STATUS", val: "ACTIVE / SLEEPING" },
        { key: "FEED_CYCLE", val: "08:00 & 19:00 IST" },
        { key: "THREAT_LEVEL", val: "LOW (UNLESS HUNGRY)" },
      ],
    },
  },
  {
    id: "awards",
    label: "AWARDS & HONORS",
    category: "SYS_ACHIEVE",
    icon: IconTrophy,
    tag: "ACCOLADES",
    content: {
      title: "RECOGNITIONS & CERTIFICATIONS",
      subtitle: "Academic Excellence & Professional Milestones",
      description:
        "Consistently striving for engineering excellence, system architecture optimizations, and high-standard backend security standards.",
      highlights: [
        "Top University Graduate (Honors)",
        "Software Engineering Innovation Award",
        "Certified OWASP Security & Automated Scan Specialist",
      ],
      details: [
        { key: "ALMA_MATER", val: "TOP TIER TECH UNIV" },
        { key: "DOMAINS", val: "BACKEND / SECURITY / QA" },
        { key: "SECURITY_SCAN", val: "CODEQL / ZAP PASS" },
      ],
    },
  },
  {
    id: "watches",
    label: "HOBBY",
    category: "SYS_TIME",
    icon: IconClock,
    tag: "TIMEPIECES",
    content: {
      title: "MECHANICAL HOROLOGY",
      subtitle: "Analog Precision in a Digital Realm",
      description:
        "Fascinated by mechanical complications, automatic movements, and tactile engineering. Appreciates the architecture behind gear trains and escapements.",
      highlights: [
        "Automatic Movement Enthusiast (NH35 / ETA / Miyota)",
        "Tactical & Diver Tool Watches",
        "Sapphire Crystal & Custom Mod Assembly",
      ],
      details: [
        { key: "PREFERENCE", val: "AUTOMATIC / MECHANICAL" },
        { key: "DAILY_DRIVER", val: "SEIKO MOD 39MM" },
        { key: "TOLERANCE", val: "+5s/DAY DEV" },
      ],
    },
  },
  {
    id: "photography",
    label: "PHOTOGRAPHY",
    category: "SYS_OPTICS",
    icon: IconCamera,
    tag: "35MM_RAW",
    content: {
      title: "CYBER STREET & SHADOWS",
      subtitle: "High-Contrast Visual Log",
      description:
        "Capturing urban nocturnal landscapes, high-contrast monochrome architecture, neon reflections, and quiet moments in busy cities.",
      highlights: [
        "Street & Architectural Night Photography",
        "Color Grading: Dark Cyber Orange & High-Contrast B&W",
        "35mm & 50mm Prime Lens Framing",
      ],
      details: [
        { key: "GEAR", val: "MIRRORLESS + 35MM F1.4" },
        { key: "PALETTE", val: "NOIR / CYBER ORANGE" },
        { key: "EXPORT", val: "100% UNCOMPRESSED RAW" },
      ],
    },
  },
];

// --- DRAGGABLE WINDOW COMPONENT ---
interface DraggableWindowProps {
  item: InteractiveItem;
  itemIndex: number;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
}

function DraggableWindow({
  item,
  itemIndex,
  zIndex,
  onClose,
  onFocus,
}: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Stagger window position on initial mount based on module index
  useEffect(() => {
    const offset = itemIndex * 28;
    const defaultX = Math.max(20, window.innerWidth / 2 - 250 + offset);
    const defaultY = Math.max(80, window.innerHeight / 2 - 220 + offset);
    setPosition({ x: defaultX, y: defaultY });
  }, [itemIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus(); // Focus window on header drag start
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(10, dragRef.current.initialX + dx),
        y: Math.max(10, dragRef.current.initialY + dy),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const ItemIcon = item.icon;

  return (
    <>
      <style>{`
        @keyframes windowEntrance {
          0% {
            opacity: 0;
            transform: scale(0.94) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      <Paper
        shadow="xl"
        onMouseDown={onFocus}
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "clamp(320px, 90vw, 520px)",
          backgroundColor: "#0d0d0d",
          border: "1px solid #FF7700",
          boxShadow:
            "0 0 30px rgba(255, 119, 0, 0.25), 0 10px 40px rgba(0,0,0,0.8)",
          borderRadius: "8px",
          zIndex: zIndex,
          overflow: "hidden",
          userSelect: isDragging ? "none" : "auto",
          animation:
            "windowEntrance 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          willChange: "transform, opacity",
        }}
      >
        {/* Draggable Title Bar */}
        <Group
          justify="space-between"
          px="md"
          py="xs"
          onMouseDown={handleMouseDown}
          style={{
            backgroundColor: "#171717",
            borderBottom: "1px solid #262626",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <Group gap="xs">
            <IconTerminal size={16} color="#FF7700" />
            <Text
              fz="xs"
              fw={700}
              style={{
                fontFamily: "monospace",
                color: "#e5e5e5",
                letterSpacing: "1px",
              }}
            >
              // WIN_{item.id.toUpperCase()}.EXE
            </Text>
          </Group>

          <Group gap="xs">
            <IconGripHorizontal size={16} color="#525252" />
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              onClick={onClose}
              aria-label="Close window"
              style={{
                "&:hover": {
                  backgroundColor: "#FF7700",
                  color: "#000",
                },
              }}
            >
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Window Body Content */}
        <Stack p="md" gap="md">
          {/* Header Badge & Title */}
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Group gap="xs">
                <ItemIcon size={20} color="#FF7700" />
                <Text
                  fz="xl"
                  fw={800}
                  style={{
                    fontFamily: "monospace",
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {item.content.title}
                </Text>
              </Group>
              <Text
                fz="xs"
                style={{ color: "#a3a3a3", fontFamily: "monospace" }}
              >
                {item.content.subtitle}
              </Text>
            </Stack>
            <Badge
              variant="outline"
              color="orange"
              size="xs"
              style={{ fontFamily: "monospace" }}
            >
              {item.tag}
            </Badge>
          </Group>

          <Text fz="sm" style={{ color: "#d4d4d4", lineHeight: "1.5" }}>
            {item.content.description}
          </Text>

          {/* Highlights List */}
          <Box
            p="xs"
            style={{
              backgroundColor: "#141414",
              borderLeft: "2px solid #FF7700",
              borderRadius: "0 4px 4px 0",
            }}
          >
            <Text
              fz="xs"
              fw={700}
              mb={6}
              style={{ fontFamily: "monospace", color: "#FF7700" }}
            >
              // KEY_FEATURES
            </Text>
            <Stack gap={4}>
              {item.content.highlights.map((h, idx) => (
                <Group key={idx} gap="xs" wrap="nowrap" align="flex-start">
                  <IconCheck
                    size={14}
                    color="#FF7700"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <Text fz="xs" style={{ color: "#a3a3a3" }}>
                    {h}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Box>

          {/* System Metadata Table */}
          {item.content.details && (
            <Grid gap="xs">
              {item.content.details.map((d, i) => (
                <Grid.Col
                  span={4}
                  key={i}
                  p="xs"
                  style={{
                    backgroundColor: "#050505",
                    border: "1px solid #262626",
                    borderRadius: "4px",
                  }}
                >
                  <Text
                    fz="9px"
                    style={{ fontFamily: "monospace", color: "#737373" }}
                  >
                    {d.key}
                  </Text>
                  <Text
                    fz="11px"
                    fw={700}
                    style={{ fontFamily: "monospace", color: "#e5e5e5" }}
                  >
                    {d.val}
                  </Text>
                </Grid.Col>
              ))}
            </Grid>
          )}

          <Group justify="flex-end" pt="xs">
            <Badge
              size="sm"
              variant="filled"
              color="orange"
              onClick={onClose}
              style={{ cursor: "pointer", fontFamily: "monospace" }}
            >
              CLOSE_WINDOW [ESC]
            </Badge>
          </Group>
        </Stack>
      </Paper>
    </>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function AboutPage() {
  const [openWindows, setOpenWindows] = useState<InteractiveItem[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [topZIndex, setTopZIndex] = useState<number>(1000);
  const [zIndices, setZIndices] = useState<Record<string, number>>({});

  // Bring specified window to the front layer
  const bringToFront = (id: string) => {
    setFocusedWindowId(id);
    setTopZIndex((prevZ) => {
      const nextZ = prevZ + 1;
      setZIndices((prevMap) => ({ ...prevMap, [id]: nextZ }));
      return nextZ;
    });
  };

  const handleToggleWindow = (item: InteractiveItem) => {
    const isOpen = openWindows.some((w) => w.id === item.id);

    if (isOpen) {
      if (focusedWindowId === item.id) {
        // If already open and focused, close it
        handleCloseWindow(item.id);
      } else {
        // If open in background, bring to front
        bringToFront(item.id);
      }
    } else {
      // Open new window (no duplicates) and focus it
      setOpenWindows((prev) => [...prev, item]);
      bringToFront(item.id);
    }
  };

  const handleCloseWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    if (focusedWindowId === id) {
      setFocusedWindowId(null);
    }
  };

  // Keyboard shortcut listener: pressing Escape closes the currently focused top window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openWindows.length > 0) {
        if (focusedWindowId) {
          handleCloseWindow(focusedWindowId);
        } else {
          const lastWindow = openWindows[openWindows.length - 1];
          if (lastWindow) {
            handleCloseWindow(lastWindow.id);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openWindows, focusedWindowId]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Stack
        ml="lg"
        mr="lg"
        mt="60"
        mb="lg"
        pl="xl"
        pr="xl"
        pt={0}
        style={{
          minHeight: "85dvh",
          position: "relative",
          backgroundColor: "#0e0600",
          overflowX: "hidden",
          borderRadius: 10,
        }}
      >
        {/* Animated ASCII Wave Canvas Background */}
        <AsciiWaveBackground />

        <Grid
          gap="xl"
          style={{
            marginTop: "0px",
            height: "100%",
            zIndex: 1,
            position: "relative",
          }}
        >
          {/* Left Column: Hero Headers */}
          <Grid.Col span={{ base: 12, md: 7, lg: 6 }}>
            <Group pt="30" justify="space-between">
              <Box className="vhs-title-container">
                <Title
                  className="vhs-title"
                  data-text="A back-end developer with a twist of artistic ideas running through his veins."
                  style={{
                    fontSize: "clamp(24px, 6vw, 44px)",
                    fontWeight: 400,
                    color: "white",
                    letterSpacing: "-1.5px",
                    lineHeight: 1.1,
                    maxWidth: "600px",
                  }}
                >
                  A back-end developer with a twist of artistic ideas running
                  through his veins.
                </Title>
              </Box>
            </Group>

            <Group justify="left" mt="md">
              <Box className="vhs-title-container">
                <Text
                  className="vhs-title"
                  data-text="Currently working full-time at Toshiba Software Development Vietnam"
                  style={{
                    fontSize: "clamp(12px, 3.5vw, 15px)",
                    fontWeight: 400,
                    color: "white",
                    fontFamily: "monospace",
                    letterSpacing: "-1px",
                    lineHeight: 1.4,
                    textShadow: "0 0 12px rgba(255, 119, 0, 0.6)",
                    maxWidth: "340px",
                  }}
                >
                  Currently working full-time at Toshiba Software Development
                  Vietnam
                </Text>
              </Box>
            </Group>
          </Grid.Col>

          {/* Right Column: Interactive Deck Trigger Cards */}
          <Grid.Col
            span={{ base: 12, md: 5, lg: 6 }}
            style={{
              height: "100%",
            }}
          >
            <Stack
              justify="end"
              style={{
                height: "100%",
              }}
            >
              <Grid gap="md" mt="25">
                {ITEMS.map((item) => {
                  const isOpen = openWindows.some((w) => w.id === item.id);
                  const isFocused = focusedWindowId === item.id;
                  const ItemIcon = item.icon;

                  return (
                    <Grid.Col key={item.id}>
                      <Group justify="end">
                        <Box
                          onClick={() => handleToggleWindow(item)}
                          style={{
                            width: "240px",
                            padding: "14px 18px",
                            backgroundColor: isOpen ? "#141414" : "#0a0a0a",
                            border: isOpen
                              ? "1px solid #FF7700"
                              : "1px solid #262626",
                            borderRadius: "16px",
                            cursor: "pointer",
                            transition:
                              "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            boxShadow: isOpen
                              ? "0 0 20px rgba(255, 119, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.5)"
                              : "0 2px 8px rgba(0, 0, 0, 0.3)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Group
                            justify="space-between"
                            align="center"
                            wrap="nowrap"
                          >
                            {/* Left Side: Window App Icon + Category & Title */}
                            <Group gap="md" wrap="nowrap" align="center">
                              {/* Desktop Application Icon Box */}
                              <Box
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: "10px",
                                  backgroundColor: "#171717",
                                  border: isOpen
                                    ? "1px solid #FF7700"
                                    : "1px solid rgba(255, 255, 255, 0.12)",
                                  boxShadow:
                                    "0 4px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "6px",
                                  flexShrink: 0,
                                  transition: "transform 0.2s ease",
                                }}
                              >
                                {item.appIconUrl ? (
                                  <Image
                                    src={item.appIconUrl}
                                    alt={item.label}
                                    w={32}
                                    h={32}
                                    fit="contain"
                                    fallbackSrc="https://cdn-icons-png.flaticon.com/512/565/565547.png"
                                  />
                                ) : (
                                  <ItemIcon
                                    size={24}
                                    color={isOpen ? "#FF7700" : "#ffffff"}
                                  />
                                )}
                              </Box>

                              {/* Labels and Metadata */}
                              <Box>
                                <Text
                                  fz="10px"
                                  fw={700}
                                  style={{
                                    fontFamily: "monospace",
                                    color: isOpen ? "#FF7700" : "#737373",
                                    letterSpacing: "0.5px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {item.category}
                                </Text>

                                <Text
                                  fw={700}
                                  fz="sm"
                                  style={{
                                    fontFamily: "monospace",
                                    color: "#ffffff",
                                    letterSpacing: "-0.3px",
                                    lineHeight: 1.2,
                                    marginTop: "2px",
                                  }}
                                >
                                  {item.label}
                                </Text>

                                <Badge
                                  ff="monospace"
                                  fz="xs"
                                  variant="dot"
                                  style={{
                                    "--badge-dot-color": isOpen
                                      ? isFocused
                                        ? "green"
                                        : "orange"
                                      : "red",
                                    marginTop: "3px",
                                  }}
                                >
                                  {isOpen
                                    ? isFocused
                                      ? "Active"
                                      : "Background"
                                    : "Closed"}
                                </Badge>
                              </Box>
                            </Group>
                          </Group>
                        </Box>
                      </Group>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Multi-Window Render Area */}
        {openWindows.map((item) => {
          const itemIndex = ITEMS.findIndex((i) => i.id === item.id);
          const zIndex = zIndices[item.id] || 1000;

          return (
            <DraggableWindow
              key={item.id}
              item={item}
              itemIndex={itemIndex}
              zIndex={zIndex}
              onClose={() => handleCloseWindow(item.id)}
              onFocus={() => bringToFront(item.id)}
            />
          );
        })}
      </Stack>

      <Footer />
    </MantineProvider>
  );
}
