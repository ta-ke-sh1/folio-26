import { useState, useEffect } from "react";
import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Box,
  Button,
  Grid,
  SimpleGrid,
  MantineProvider,
  createTheme,
  Anchor,
  Paper,
  Card,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconTerminal2,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconArrowDown,
  IconArrowUpRight,
  IconFlame,
  IconCircleCheck,
  IconShieldCheck,
  IconCpu,
  IconServer,
  IconLock,
  IconCopy,
  IconCheck,
  IconActivity,
  IconCode,
  IconDatabase,
  IconLayersIntersect,
  IconFingerprint,
  IconBolt,
  IconWorld,
  IconShieldLock,
  IconChevronRight,
} from "@tabler/icons-react";

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

// High-tech editorial styles with crisp typography & retro-futuristic grid borders
const editorialStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&family=Space+Grotesk:wght@400;500;700;800&display=swap');
  
  html, body {
    background-color: #060608 !important;
    color: #f1f5f9;
    font-family: 'Space Grotesk', sans-serif;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  .mono-font {
    font-family: 'JetBrains Mono', monospace !important;
  }

  /* Unbounded Glowing Telemetry Text */
  .radar-telemetry-raw {
    font-family: 'JetBrains Mono', monospace;
    color: #FF7700;
    font-size: clamp(0.7rem, 1.1vw, 0.95rem);
    line-height: 1.15;
    letter-spacing: 0.5px;
    text-shadow: 0 0 16px rgba(255, 119, 0, 0.4), 0 0 32px rgba(255, 119, 0, 0.15);
    white-space: pre;
    user-select: none;
  }

  /* Editorial Section Border Dividers */
  .editorial-section-border {
    border-top: 1px solid rgba(255, 119, 0, 0.25);
  }

  .editorial-row-divider {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    transition: border-color 0.3s ease, background-color 0.3s ease;
  }
  .editorial-row-divider:hover {
    border-bottom: 1px solid rgba(255, 119, 0, 0.5);
    background-color: rgba(255, 119, 0, 0.02);
  }

  /* Interactive Editorial Card Hover */
  .editorial-card {
    background: rgba(12, 13, 18, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }
  .editorial-card:hover {
    border-color: rgba(255, 119, 0, 0.6);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(255, 119, 0, 0.08);
  }

  /* Pixelated Image Frame Hover Effect */
  .pixel-frame {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .pixel-frame img {
    transition: filter 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    image-rendering: auto;
  }

  .pixel-frame:hover img {
    image-rendering: pixelated;
    filter: contrast(135%) saturate(140%) brightness(110%);
    transform: scale(1.05);
  }

  .pixel-frame::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0.25) 2px,
      transparent 2px,
      transparent 4px
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .pixel-frame:hover::after {
    opacity: 1;
  }

  .hover-orange-text {
    transition: color 0.25s ease, transform 0.25s ease;
  }
  .hover-orange-text:hover {
    color: #FF7700 !important;
  }

  /* Scanline effect overlay */
  .scanline-bg {
    background: linear-gradient(
      to bottom,
      rgba(255,255,255,0),
      rgba(255,255,255,0) 50%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.3)
    );
    background-size: 100% 4px;
  }

  .terminal-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    padding: 6px 12px;
    border: 1px solid rgba(255, 119, 0, 0.3);
    background: rgba(10, 10, 15, 0.8);
    color: #94A3B8;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .terminal-btn:hover, .terminal-btn.active {
    background: #FF7700;
    color: #000;
    border-color: #FF7700;
    font-weight: 700;
  }
`;

// ASCII Telemetry animation frames
const asciiRadarFrames = [
  `
    [ RADAR_TELEMETRY_SCANNER v4.2 ]
    +-----------------------------------------------+
    |           .         :         .               |
    |         .           |           .             |
    |       .             |             .           |
    |     .      *       (o)              .         |  TARGET: SEC_NODE_01
    |---:-----------------+-----------------:---|  BEARING: 042°
    |     .               |        .      .         |  DISTANCE: 12.4 km
    |       .             |      *       .          |  SIGNAL: OPTIMAL
    |         .           |           .             |  STATUS: ENCRYPTED
    |           .         :         .               |
    +-----------------------------------------------+
  `,
  `
    [ RADAR_TELEMETRY_SCANNER v4.2 ]
    +-----------------------------------------------+
    |           .         :         .               |
    |         .          /            .             |
    |       .           /     *         .           |
    |     .            (o)                .         |  TARGET: SEC_NODE_01
    |---:-------------/---+-----------------:---|  BEARING: 088°
    |     .          /    |        .      .         |  DISTANCE: 12.1 km
    |       .       /     |      *       .          |  SIGNAL: OPTIMAL
    |         .    /      |           .             |  STATUS: SCANNING
    |           . /       :         .               |
    +-----------------------------------------------+
  `,
  `
    [ RADAR_TELEMETRY_SCANNER v4.2 ]
    +-----------------------------------------------+
    |           .         :         .               |
    |         .    *      |           .             |
    |       .             |             .           |
    |     .--------------(o)--------------.         |  TARGET: SEC_NODE_01
    |---:-----------------+-----------------:---|  BEARING: 180°
    |     .               |        *      .         |  DISTANCE: 11.8 km
    |       .             |             .           |  SIGNAL: LOCKED
    |         .           |           .             |  STATUS: VERIFIED
    |           .         :         .               |
    +-----------------------------------------------+
  `,
  `
    [ RADAR_TELEMETRY_SCANNER v4.2 ]
    +-----------------------------------------------+
    |           .         :         .               |
    |         .            \\          .             |
    |       .               \\   *       .           |
    |     .       *          (o)          .         |  TARGET: SEC_NODE_01
    |---:-----------------+---\\-------------:---|  BEARING: 245°
    |     .               |    \\   .      .         |  DISTANCE: 11.5 km
    |       .             |     \\       .           |  SIGNAL: LOCKED
    |         .           |      \\.                 |  STATUS: STABLE
    |           .         :       *                 |
    +-----------------------------------------------+
  `,
];

export default function AboutPage() {
  const [radarFrame, setRadarFrame] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [terminalTab, setTerminalTab] = useState<
    "status" | "stack" | "certs" | "logs"
  >("status");

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarFrame((prev) => (prev + 1) % asciiRadarFrames.length);
    }, 850);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hathetrung.sec@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <style>{editorialStyles}</style>

      <Box
        style={{
          backgroundColor: "#060608",
          color: "#f1f5f9",
          minHeight: "100vh",
        }}
      >
        {/* ==========================================
            Top Telemetry Bar
        ========================================== */}
        <Box
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "#030305",
          }}
          py="xs"
        >
          <Container size="xl">
            <Group justify="space-between" align="center">
              <Group gap="lg">
                <Text className="mono-font" size="xs" color="#64748B">
                  OPERATIVE:{" "}
                  <Text span color="#FF7700" fw={700}>
                    HÀ THẾ TRUNG
                  </Text>
                </Text>
                <Text
                  className="mono-font"
                  size="xs"
                  color="#64748B"
                  visibleFrom="sm"
                >
                  LOC:{" "}
                  <Text span color="#F1F5F9">
                    HANOI, VN [21.0285° N, 105.8542° E]
                  </Text>
                </Text>
              </Group>

              <Group gap="md">
                <Badge
                  variant="dot"
                  color="green"
                  size="sm"
                  className="mono-font"
                >
                  ONLINE // SLA 99.998%
                </Badge>
                <Text
                  className="mono-font"
                  size="xs"
                  color="#64748B"
                  visibleFrom="md"
                >
                  PGP:{" "}
                  <Text span color="#FF7700">
                    0x8F3A29B1
                  </Text>
                </Text>
              </Group>
            </Group>
          </Container>
        </Box>

        {/* ==========================================
            SECTION 1: HERO MANIFESTO (LXL Inspired Header)
        ========================================== */}
        <Box
          style={{
            minHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: "60px",
            paddingBottom: "40px",
            position: "relative",
          }}
        >
          <Container
            size="xl"
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid gutter={50} align="center" style={{ width: "100%" }}>
              <Grid.Col span={{ base: 12, lg: 7 }}>
                <Stack gap="xl">
                  <Group gap="xs">
                    <Text
                      className="mono-font"
                      color="#FF7700"
                      size="sm"
                      fw={700}
                    >
                      // 01. OPERATIVE_MANIFESTO
                    </Text>
                    <Badge
                      color="orange"
                      variant="outline"
                      size="sm"
                      className="mono-font"
                    >
                      AVAILABILITY: FULL_STACK / SEC
                    </Badge>
                  </Group>

                  <Title
                    order={1}
                    style={{
                      fontSize: "clamp(46px, 7.5vw, 98px)",
                      fontWeight: 800,
                      lineHeight: 0.92,
                      letterSpacing: "-2.5px",
                      color: "#FFFFFF",
                    }}
                  >
                    HÀ THẾ TRUNG
                  </Title>

                  <Text
                    className="mono-font"
                    style={{
                      fontSize: "clamp(16px, 2.2vw, 26px)",
                      fontWeight: 700,
                      color: "#FF7700",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    BACKEND & WEB SECURITY ARCHITECT
                  </Text>

                  <Text
                    style={{
                      fontSize: "clamp(16px, 1.35vw, 21px)",
                      lineHeight: 1.6,
                      color: "#94A3B8",
                      maxWidth: "660px",
                      fontWeight: 400,
                    }}
                  >
                    Designing fault-tolerant microservice architectures,
                    real-time REST/GraphQL endpoints, and automated zero-trust
                    security perimeters with high-throughput precision.
                  </Text>

                  <Group gap="md" mt="xs">
                    <Button
                      size="lg"
                      color="orange"
                      variant="filled"
                      component="a"
                      href="#contact"
                      leftSection={<IconFlame size={20} />}
                      style={{
                        color: "#000",
                        fontWeight: 800,
                        fontFamily: "JetBrains Mono",
                        borderRadius: "0px",
                      }}
                    >
                      INITIATE_CONTACT()
                    </Button>
                    <Button
                      size="lg"
                      color="gray"
                      variant="outline"
                      component="a"
                      href="#pillars"
                      leftSection={<IconTerminal2 size={20} />}
                      style={{
                        borderColor: "rgba(255,119,0,0.5)",
                        color: "#FF7700",
                        fontFamily: "JetBrains Mono",
                        borderRadius: "0px",
                      }}
                    >
                      EXPLORE_SYSTEMS
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>

              {/* Right Column: Dynamic ASCII Telemetry Display */}
              <Grid.Col span={{ base: 12, lg: 5 }}>
                <Paper
                  p="md"
                  style={{
                    background: "#08090D",
                    border: "1px solid rgba(255, 119, 0, 0.3)",
                    boxShadow: "0 0 30px rgba(255, 119, 0, 0.08)",
                  }}
                >
                  <Group
                    justify="space-between"
                    mb="xs"
                    style={{ borderBottom: "1px dashed rgba(255,119,0,0.3)" }}
                    pb="xs"
                  >
                    <Text
                      className="mono-font"
                      size="xs"
                      color="#FF7700"
                      fw={700}
                    >
                      LIVE_TELEMETRY_FEED
                    </Text>
                    <Badge
                      size="xs"
                      color="orange"
                      variant="light"
                      className="mono-font"
                    >
                      REC: 60FPS
                    </Badge>
                  </Group>
                  <Box style={{ overflowX: "auto", padding: "6px 0" }}>
                    <Text className="radar-telemetry-raw">
                      {asciiRadarFrames[radarFrame]}
                    </Text>
                  </Box>
                  <Group
                    justify="space-between"
                    mt="xs"
                    pt="xs"
                    style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}
                  >
                    <Text className="mono-font" size="xs" color="#64748B">
                      LATENCY:{" "}
                      <Text span color="#00FF66">
                        8.4ms
                      </Text>
                    </Text>
                    <Text className="mono-font" size="xs" color="#64748B">
                      NODES:{" "}
                      <Text span color="#FF7700">
                        12/12 ACTIVE
                      </Text>
                    </Text>
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>
          </Container>

          <Container size="xl" style={{ width: "100%" }} mt="xl">
            <Group
              justify="space-between"
              align="center"
              className="editorial-section-border"
              pt="md"
            >
              <Text className="mono-font" size="xs" color="#64748B">
                SYSTEM STATUS:{" "}
                <Text span color="#00FF66" fw={700}>
                  ALL_SYSTEMS_NOMINAL
                </Text>
              </Text>
              <Anchor
                href="#origin"
                underline="never"
                className="mono-font hover-orange-text"
                size="xs"
                color="#94A3B8"
              >
                // SCROLL TO EXPLORE{" "}
                <IconArrowDown
                  size={14}
                  style={{ verticalAlign: "middle", marginLeft: 4 }}
                />
              </Anchor>
            </Group>
          </Container>
        </Box>

        {/* ==========================================
            SECTION 2: ARCHITECTURAL ORIGIN & STORY (LXL Narrative Layout)
        ========================================== */}
        <Box
          id="origin"
          py={100}
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Container size="xl">
            <Stack gap={60}>
              <Group justify="space-between" align="flex-end">
                <Box>
                  <Text
                    className="mono-font"
                    color="#FF7700"
                    size="sm"
                    fw={700}
                    mb="xs"
                  >
                    // 02. ARCHITECTURAL_ORIGIN
                  </Text>
                  <Title
                    order={2}
                    style={{
                      fontSize: "clamp(28px, 4.5vw, 54px)",
                      fontWeight: 800,
                      color: "#FFF",
                    }}
                  >
                    CRAFTING UNBREAKABLE BACKEND INFRASTRUCTURE
                  </Title>
                </Box>
                <Badge
                  size="lg"
                  variant="outline"
                  color="orange"
                  className="mono-font"
                >
                  EST. 2018 — PRESENT
                </Badge>
              </Group>

              <Grid gap={40}>
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <Stack gap="lg">
                    <Text
                      style={{
                        fontSize: "clamp(20px, 2.2vw, 28px)",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: "#F1F5F9",
                      }}
                    >
                      From raw kernel-level experiments to orchestrating
                      high-throughput distributed microservices, my engineering
                      doctrine revolves around speed, reliability, and zero
                      compromise on security.
                    </Text>
                    <Text
                      style={{
                        fontSize: "17px",
                        lineHeight: 1.7,
                        color: "#94A3B8",
                      }}
                    >
                      Modern software architectures face relentless threat
                      vectors and sudden, volatile traffic spikes. My approach
                      combines clean code engineering with defensive
                      cyber-security principles. Every system I build is
                      engineered with automated zero-trust authorization,
                      sub-millisecond API caching layer, and self-healing
                      microservice clusters.
                    </Text>
                    <Text
                      style={{
                        fontSize: "17px",
                        lineHeight: 1.7,
                        color: "#94A3B8",
                      }}
                    >
                      Whether hardening web infrastructure against OWASP
                      vulnerabilities or optimizing heavy database queries for
                      millions of concurrent connections, I focus on measurable
                      impact and clean execution.
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Paper
                    p="xl"
                    style={{
                      background: "#0B0C10",
                      border: "1px solid rgba(255,119,0,0.2)",
                    }}
                  >
                    <Stack gap="xl">
                      <Group gap="xs">
                        <IconActivity color="#FF7700" size={24} />
                        <Text
                          className="mono-font"
                          fw={700}
                          color="#FF7700"
                          size="sm"
                        >
                          SYSTEM PERFORMANCE BENCHMARKS
                        </Text>
                      </Group>

                      <SimpleGrid cols={2} spacing="md">
                        <Box
                          p="md"
                          style={{
                            background: "#050508",
                            borderLeft: "3px solid #FF7700",
                          }}
                        >
                          <Text
                            className="mono-font"
                            style={{
                              fontSize: "28px",
                              fontWeight: 800,
                              color: "#FFF",
                            }}
                          >
                            99.999%
                          </Text>
                          <Text size="xs" color="#64748B" className="mono-font">
                            SLA UPTIME TARGET
                          </Text>
                        </Box>
                        <Box
                          p="md"
                          style={{
                            background: "#050508",
                            borderLeft: "3px solid #00FF66",
                          }}
                        >
                          <Text
                            className="mono-font"
                            style={{
                              fontSize: "28px",
                              fontWeight: 800,
                              color: "#FFF",
                            }}
                          >
                            &lt; 12ms
                          </Text>
                          <Text size="xs" color="#64748B" className="mono-font">
                            AVG API LATENCY
                          </Text>
                        </Box>
                        <Box
                          p="md"
                          style={{
                            background: "#050508",
                            borderLeft: "3px solid #38BDF8",
                          }}
                        >
                          <Text
                            className="mono-font"
                            style={{
                              fontSize: "28px",
                              fontWeight: 800,
                              color: "#FFF",
                            }}
                          >
                            150M+
                          </Text>
                          <Text size="xs" color="#64748B" className="mono-font">
                            MONTHLY REQS
                          </Text>
                        </Box>
                        <Box
                          p="md"
                          style={{
                            background: "#050508",
                            borderLeft: "3px solid #A855F7",
                          }}
                        >
                          <Text
                            className="mono-font"
                            style={{
                              fontSize: "28px",
                              fontWeight: 800,
                              color: "#FFF",
                            }}
                          >
                            0-DAY
                          </Text>
                          <Text size="xs" color="#64748B" className="mono-font">
                            ZERO TRUST STANCE
                          </Text>
                        </Box>
                      </SimpleGrid>

                      <Text size="xs" color="#64748B" className="mono-font">
                        // CONTINUOUS TELEMETRY AUDITED REAL-TIME
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Stack>
          </Container>
        </Box>

        {/* ==========================================
            SECTION 3: CORE PILLARS & VALUES (LXL "Why Us" Grid)
        ========================================== */}
        <Box
          id="pillars"
          py={100}
          style={{
            background: "#040406",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Container size="xl">
            <Stack gap={50}>
              <Box>
                <Text
                  className="mono-font"
                  color="#FF7700"
                  size="sm"
                  fw={700}
                  mb="xs"
                >
                  // 03. ENGINEERING_PILLARS
                </Text>
                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    fontWeight: 800,
                    color: "#FFF",
                  }}
                >
                  CORE ARCHITECTURAL PRINCIPLES
                </Title>
              </Box>

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                <Paper p="xl" className="editorial-card">
                  <Stack gap="md">
                    <Text
                      className="mono-font"
                      color="#FF7700"
                      fw={800}
                      size="xl"
                    >
                      01 //
                    </Text>
                    <IconShieldCheck size={32} color="#FF7700" />
                    <Text fw={700} size="lg" color="#FFF">
                      ZERO-TRUST SECURITY
                    </Text>
                    <Text size="sm" color="#94A3B8" style={{ lineHeight: 1.6 }}>
                      Security is never an afterthought or a post-launch patch.
                      Cryptographic authentication, RBAC, and strict input
                      sanitization are engineered into every route from line
                      one.
                    </Text>
                  </Stack>
                </Paper>

                <Paper p="xl" className="editorial-card">
                  <Stack gap="md">
                    <Text
                      className="mono-font"
                      color="#FF7700"
                      fw={800}
                      size="xl"
                    >
                      02 //
                    </Text>
                    <IconServer size={32} color="#FF7700" />
                    <Text fw={700} size="lg" color="#FFF">
                      FAULT-TOLERANT DESIGN
                    </Text>
                    <Text size="sm" color="#94A3B8" style={{ lineHeight: 1.6 }}>
                      Built to withstand unexpected node failures and DDoS
                      spikes. Utilizing circuit breakers, event-driven MQ
                      queues, and graceful degradation strategies.
                    </Text>
                  </Stack>
                </Paper>

                <Paper p="xl" className="editorial-card">
                  <Stack gap="md">
                    <Text
                      className="mono-font"
                      color="#FF7700"
                      fw={800}
                      size="xl"
                    >
                      03 //
                    </Text>
                    <IconBolt size={32} color="#FF7700" />
                    <Text fw={700} size="lg" color="#FFF">
                      HIGH THROUGHPUT
                    </Text>
                    <Text size="sm" color="#94A3B8" style={{ lineHeight: 1.6 }}>
                      Sub-millisecond execution cycles using Go, Rust, and
                      optimized Node.js runtimes. Optimized database indexes and
                      in-memory Redis acceleration.
                    </Text>
                  </Stack>
                </Paper>

                <Paper p="xl" className="editorial-card">
                  <Stack gap="md">
                    <Text
                      className="mono-font"
                      color="#FF7700"
                      fw={800}
                      size="xl"
                    >
                      04 //
                    </Text>
                    <IconTerminal2 size={32} color="#FF7700" />
                    <Text fw={700} size="lg" color="#FFF">
                      TRANSPARENT AUDITING
                    </Text>
                    <Text size="sm" color="#94A3B8" style={{ lineHeight: 1.6 }}>
                      Comprehensive observability with structured logging,
                      Prometheus metrics, distributed tracing, and clear,
                      reproducible documentation.
                    </Text>
                  </Stack>
                </Paper>
              </SimpleGrid>
            </Stack>
          </Container>
        </Box>

        {/* ==========================================
            SECTION 4: CAPABILITIES & SERVICES MATRIX (LXL Services Style)
        ========================================== */}
        <Box
          id="capabilities"
          py={100}
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Container size="xl">
            <Stack gap={50}>
              <Group justify="space-between" align="flex-end">
                <Box>
                  <Text
                    className="mono-font"
                    color="#FF7700"
                    size="sm"
                    fw={700}
                    mb="xs"
                  >
                    // 04. CAPABILITIES_MATRIX
                  </Text>
                  <Title
                    order={2}
                    style={{
                      fontSize: "clamp(28px, 4vw, 48px)",
                      fontWeight: 800,
                      color: "#FFF",
                    }}
                  >
                    CORE SPECIALIZATIONS & STACK
                  </Title>
                </Box>
              </Group>

              <Stack gap="xs">
                {/* Capability Row 1 */}
                <Box className="editorial-row-divider" p="lg">
                  <Grid align="center" gutter="md">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Group gap="sm">
                        <IconCpu size={24} color="#FF7700" />
                        <Text fw={700} size="xl" color="#FFF">
                          BACKEND MICROSERVICES
                        </Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                      <Text size="sm" color="#94A3B8">
                        Distributed system architectures, REST & GraphQL APIs,
                        gRPC inter-service communication, Kafka event streaming,
                        and async queue processing.
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 3 }}>
                      <Group gap="xs" justify="flex-end">
                        <Badge variant="outline" color="orange" size="xs">
                          GO
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          NODE.JS
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          RUST
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          GRPC
                        </Badge>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Box>

                {/* Capability Row 2 */}
                <Box className="editorial-row-divider" p="lg">
                  <Grid align="center" gutter="md">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Group gap="sm">
                        <IconShieldLock size={24} color="#FF7700" />
                        <Text fw={700} size="xl" color="#FFF">
                          WEB SECURITY & AUDITING
                        </Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                      <Text size="sm" color="#94A3B8">
                        OWASP Top 10 mitigation, OAuth2/OIDC identity providers,
                        dynamic rate-limiting, static code analysis (SAST), and
                        automated penetration testing.
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 3 }}>
                      <Group gap="xs" justify="flex-end">
                        <Badge variant="outline" color="orange" size="xs">
                          OWASP
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          JWT/OAUTH
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          WAF
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          BURP
                        </Badge>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Box>

                {/* Capability Row 3 */}
                <Box className="editorial-row-divider" p="lg">
                  <Grid align="center" gutter="md">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Group gap="sm">
                        <IconDatabase size={24} color="#FF7700" />
                        <Text fw={700} size="xl" color="#FFF">
                          DATABASE & DATA PIPELINES
                        </Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                      <Text size="sm" color="#94A3B8">
                        PostgreSQL query tuning, MongoDB sharding, Redis caching
                        patterns, schema migrations, and real-time analytical
                        pipeline design.
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 3 }}>
                      <Group gap="xs" justify="flex-end">
                        <Badge variant="outline" color="orange" size="xs">
                          POSTGRES
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          REDIS
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          MONGO
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          PRISMA
                        </Badge>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Box>

                {/* Capability Row 4 */}
                <Box className="editorial-row-divider" p="lg">
                  <Grid align="center" gutter="md">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Group gap="sm">
                        <IconLayersIntersect size={24} color="#FF7700" />
                        <Text fw={700} size="xl" color="#FFF">
                          CLOUD & INFRASTRUCTURE OPS
                        </Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                      <Text size="sm" color="#94A3B8">
                        Container orchestration with Docker & Kubernetes, CI/CD
                        security scanning integration, HashiCorp Vault secrets
                        management, AWS/GCP deployment.
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 3 }}>
                      <Group gap="xs" justify="flex-end">
                        <Badge variant="outline" color="orange" size="xs">
                          DOCKER
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          K8S
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          VAULT
                        </Badge>
                        <Badge variant="outline" color="orange" size="xs">
                          TERRAFORM
                        </Badge>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Box>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* ==========================================
            SECTION 5: FEATURED ARCHITECTURE PROJECTS
        ========================================== */}
        <Box
          py={100}
          style={{
            background: "#040406",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Container size="xl">
            <Stack gap={50}>
              <Group justify="space-between" align="flex-end">
                <Box>
                  <Text
                    className="mono-font"
                    color="#FF7700"
                    size="sm"
                    fw={700}
                    mb="xs"
                  >
                    // 05. FEATURED_DEPLOYMENTS
                  </Text>
                  <Title
                    order={2}
                    style={{
                      fontSize: "clamp(28px, 4vw, 48px)",
                      fontWeight: 800,
                      color: "#FFF",
                    }}
                  >
                    SYSTEM ARCHITECTURE SHOWCASE
                  </Title>
                </Box>
              </Group>

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {/* Card 1 */}
                <Card className="editorial-card pixel-frame" p={0}>
                  <Box p="xl">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Badge
                          color="orange"
                          variant="filled"
                          size="xs"
                          className="mono-font"
                          style={{ borderRadius: 0, color: "#000" }}
                        >
                          PRODUCTION DEPLOYMENT
                        </Badge>
                        <IconArrowUpRight color="#FF7700" size={20} />
                      </Group>
                      <Title
                        order={3}
                        color="#FFF"
                        style={{ fontSize: "24px" }}
                      >
                        AEGIS-WAF // API SECURITY GATEWAY
                      </Title>
                      <Text
                        size="sm"
                        color="#94A3B8"
                        style={{ lineHeight: 1.6 }}
                      >
                        High-performance reverse proxy and web application
                        firewall built with Go and Redis. Mitigates automated
                        bot attacks, rate-limits abuse vectors, and signs JWT
                        tokens at sub-3ms latency.
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          GOLANG
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          REDIS
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          DOCKER
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          RATE-LIMIT
                        </Badge>
                      </Group>
                    </Stack>
                  </Box>
                </Card>

                {/* Card 2 */}
                <Card className="editorial-card pixel-frame" p={0}>
                  <Box p="xl">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Badge
                          color="orange"
                          variant="filled"
                          size="xs"
                          className="mono-font"
                          style={{ borderRadius: 0, color: "#000" }}
                        >
                          REAL-TIME TELEMETRY
                        </Badge>
                        <IconArrowUpRight color="#FF7700" size={20} />
                      </Group>
                      <Title
                        order={3}
                        color="#FFF"
                        style={{ fontSize: "24px" }}
                      >
                        NEXUS STREAM // FINANCIAL EVENT BUS
                      </Title>
                      <Text
                        size="sm"
                        color="#94A3B8"
                        style={{ lineHeight: 1.6 }}
                      >
                        Fault-tolerant microservice event bus handling over
                        50,000 real-time crypto & stock market telemetry
                        messages per second with zero payload loss and
                        distributed Kafka logging.
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          NODE.JS
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          KAFKA
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          WEBSOCKET
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          TIMESCALEDB
                        </Badge>
                      </Group>
                    </Stack>
                  </Box>
                </Card>

                {/* Card 3 */}
                <Card className="editorial-card pixel-frame" p={0}>
                  <Box p="xl">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Badge
                          color="orange"
                          variant="filled"
                          size="xs"
                          className="mono-font"
                          style={{ borderRadius: 0, color: "#000" }}
                        >
                          ZERO-TRUST IDENTITY
                        </Badge>
                        <IconArrowUpRight color="#FF7700" size={20} />
                      </Group>
                      <Title
                        order={3}
                        color="#FFF"
                        style={{ fontSize: "24px" }}
                      >
                        SENTINEL AUTH // PASSWORDLESS IDENTITY PROVIDER
                      </Title>
                      <Text
                        size="sm"
                        color="#94A3B8"
                        style={{ lineHeight: 1.6 }}
                      >
                        Enterprise OAuth2 / OIDC compliant authentication
                        service featuring WebAuthn hardware key support,
                        encrypted session tokens, and automated RBAC policy
                        enforcement.
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          RUST
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          WEBAUTHN
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          POSTGRESQL
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          OIDC
                        </Badge>
                      </Group>
                    </Stack>
                  </Box>
                </Card>

                {/* Card 4 */}
                <Card className="editorial-card pixel-frame" p={0}>
                  <Box p="xl">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Badge
                          color="orange"
                          variant="filled"
                          size="xs"
                          className="mono-font"
                          style={{ borderRadius: 0, color: "#000" }}
                        >
                          SYSTEM AUDIT ENGINE
                        </Badge>
                        <IconArrowUpRight color="#FF7700" size={20} />
                      </Group>
                      <Title order={3} style={{ fontSize: "24px" }}>
                        VORTEX AUDIT // AUTOMATED SAST & DAEMON
                      </Title>
                      <Text
                        size="sm"
                        color="#94A3B8"
                        style={{ lineHeight: 1.6 }}
                      >
                        Continuous integration security auditing tool that scans
                        backend code repositories for secrets leakage, hardcoded
                        API keys, and vulnerable third-party dependencies.
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          PYTHON
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          SAST
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          GITHUB ACTIONS
                        </Badge>
                        <Badge
                          color="dark"
                          variant="outline"
                          size="xs"
                          className="mono-font"
                        >
                          REGEX ENGINE
                        </Badge>
                      </Group>
                    </Stack>
                  </Box>
                </Card>
              </SimpleGrid>
            </Stack>
          </Container>
        </Box>

        {/* ==========================================
            SECTION 6: INTERACTIVE TELEMETRY CONSOLE
        ========================================== */}
        <Box py={100} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Container size="xl">
            <Stack gap={30}>
              <Box justify="space-between">
                <Text
                  className="mono-font"
                  color="#FF7700"
                  size="sm"
                  fw={700}
                  mb="xs"
                >
                  // 06. INTERACTIVE_DIAGNOSTICS
                </Text>
                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    fontWeight: 800,
                    color: "#FFF",
                  }}
                >
                  LIVE OPERATIVE TELEMETRY CONSOLE
                </Title>
              </Box>

              <Paper
                p="lg"
                style={{
                  background: "#05060A",
                  border: "1px solid rgba(255,119,0,0.3)",
                }}
              >
                <Group justify="space-between" mb="md">
                  <Group gap="xs">
                    <button
                      className={`terminal-btn ${terminalTab === "status" ? "active" : ""}`}
                      onClick={() => setTerminalTab("status")}
                    >
                      $ status
                    </button>
                    <button
                      className={`terminal-btn ${terminalTab === "stack" ? "active" : ""}`}
                      onClick={() => setTerminalTab("stack")}
                    >
                      $ stack
                    </button>
                    <button
                      className={`terminal-btn ${terminalTab === "certs" ? "active" : ""}`}
                      onClick={() => setTerminalTab("certs")}
                    >
                      $ certifications
                    </button>
                    <button
                      className={`terminal-btn ${terminalTab === "logs" ? "active" : ""}`}
                      onClick={() => setTerminalTab("logs")}
                    >
                      $ live_logs
                    </button>
                  </Group>

                  <Badge
                    color="orange"
                    variant="outline"
                    size="xs"
                    className="mono-font"
                  >
                    TTY / TERMINAL_READY
                  </Badge>
                </Group>

                <Box
                  p="md"
                  style={{
                    background: "#020203",
                    minHeight: "180px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {terminalTab === "status" && (
                    <Text
                      className="mono-font"
                      size="sm"
                      style={{ color: "#00FF66", lineHeight: 1.8 }}
                    >
                      [SUCCESS] OPERATIVE_NAME: Hà Thế Trung
                      <br />
                      [SUCCESS] SPECIALIZATION: Backend Architecture & Web
                      Application Security
                      <br />
                      [SUCCESS] CURRENT_LOCATION: Hanoi, Vietnam (Available for
                      Remote Global Operations)
                      <br />
                      [SUCCESS] SECURITY_CLEARANCE: Verified Zero-Trust Protocol
                      <br />
                      [SUCCESS] SYSTEM_HEALTH: 100% Operational // Ready for new
                      backend design mandates.
                    </Text>
                  )}

                  {terminalTab === "stack" && (
                    <Text
                      className="mono-font"
                      size="sm"
                      style={{ color: "#FF7700", lineHeight: 1.8 }}
                    >
                      LANGUAGES :: Golang, Node.js, TypeScript, Rust, Python,
                      SQL, C++
                      <br />
                      FRAMEWORKS :: Express, NestJS, Gin-Gonic, Actix-Web,
                      Fastify, Next.js
                      <br />
                      DATABASES :: PostgreSQL, Redis, MongoDB, TimescaleDB,
                      Cassandra
                      <br />
                      INFRASTRUCTURE :: Docker, Kubernetes, Nginx, Envoy, Kafka,
                      HashiCorp Vault
                      <br />
                      SECURITY :: OWASP Zed Attack Proxy, Burp Suite, Wireshark,
                      JWT, OAuth2, OpenID
                    </Text>
                  )}

                  {terminalTab === "certs" && (
                    <Text
                      className="mono-font"
                      size="sm"
                      style={{ color: "#38BDF8", lineHeight: 1.8 }}
                    >
                      [CERT] Certified Ethical Hacker (CEH) - Defensive &
                      Penetration Principles
                      <br />
                      [CERT] AWS Certified Solutions Architect - Associate
                      <br />
                      [CERT] Offensive Security Certified Professional (OSCP) -
                      In-Progress
                      <br />
                      [HONOR] Top 5% Contributor in Web Security Vulnerability
                      Disclosures
                    </Text>
                  )}

                  {terminalTab === "logs" && (
                    <Text
                      className="mono-font"
                      size="xs"
                      style={{ color: "#94A3B8", lineHeight: 1.8 }}
                    >
                      10:47:01.002 [INFO] TLS 1.3 Handshake completed
                      successfully with Sec_Node_01
                      <br />
                      10:47:01.214 [INFO] Rate Limiter check: IP 192.168.1.104
                      allowed (Bucket status: 98/100)
                      <br />
                      10:47:01.450 [SEC] WAF Payload Scan: No SQLi or XSS
                      patterns detected in 0.42ms
                      <br />
                      10:47:01.890 [DB] PostgreSQL Query: 'SELECT * FROM
                      security_logs' executed in 1.1ms
                      <br />
                      10:47:02.310 [SYSTEM] All microservice health checks
                      passed. Zero errors reported.
                    </Text>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Container>
        </Box>

        {/* ==========================================
            SECTION 7: INITIATE CONTACT / FOOTER (LXL Contact Banner)
        ========================================== */}
        <Box
          id="contact"
          py={120}
          style={{
            background: "#030305",
            borderTop: "1px solid rgba(255,119,0,0.3)",
          }}
        >
          <Container size="xl">
            <Grid gutter={50} align="center">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Stack gap="lg">
                  <Text
                    className="mono-font"
                    color="#FF7700"
                    size="sm"
                    fw={700}
                  >
                    // 07. INITIATE_COMMUNICATION_PROTOCOL
                  </Text>

                  <Title
                    order={2}
                    style={{
                      fontSize: "clamp(36px, 6vw, 72px)",
                      fontWeight: 800,
                      lineHeight: 0.98,
                      color: "#FFF",
                    }}
                  >
                    READY TO FORTIFY YOUR BACKEND?
                  </Title>

                  <Text
                    style={{
                      fontSize: "18px",
                      color: "#94A3B8",
                      maxWidth: "600px",
                      lineHeight: 1.6,
                    }}
                  >
                    Have a critical backend system to build, an API
                    infrastructure to scale, or security vulnerabilities to
                    patch? Reach out directly to establish secure comms.
                  </Text>

                  <Group gap="md" mt="md">
                    <Button
                      size="xl"
                      color="orange"
                      variant="filled"
                      onClick={handleCopyEmail}
                      leftSection={
                        copiedEmail ? (
                          <IconCheck size={22} />
                        ) : (
                          <IconCopy size={22} />
                        )
                      }
                      style={{
                        color: "#000",
                        fontWeight: 800,
                        fontFamily: "JetBrains Mono",
                        borderRadius: "0px",
                      }}
                    >
                      {copiedEmail
                        ? "EMAIL_COPIED_TO_CLIPBOARD!"
                        : "COPY_DIRECT_EMAIL"}
                    </Button>

                    <Button
                      size="xl"
                      color="gray"
                      variant="outline"
                      component="a"
                      href="mailto:hathetrung.sec@gmail.com"
                      leftSection={<IconMail size={22} />}
                      style={{
                        borderColor: "rgba(255,255,255,0.2)",
                        color: "#FFF",
                        fontFamily: "JetBrains Mono",
                        borderRadius: "0px",
                      }}
                    >
                      OPEN_MAIL_CLIENT
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 5 }}>
                <Paper
                  p="xl"
                  style={{
                    background: "#08090E",
                    border: "1px solid rgba(255,119,0,0.2)",
                  }}
                >
                  <Stack gap="md">
                    <Text
                      className="mono-font"
                      color="#FF7700"
                      fw={700}
                      size="sm"
                    >
                      DIRECT CHANNELS & FINGERPRINT
                    </Text>

                    <Group
                      justify="space-between"
                      className="editorial-row-divider"
                      py="xs"
                    >
                      <Group gap="xs">
                        <IconBrandGithub size={20} color="#94A3B8" />
                        <Text className="mono-font" size="sm" color="#FFF">
                          GITHUB
                        </Text>
                      </Group>
                      <Anchor
                        href="https://github.com"
                        target="_blank"
                        color="#FF7700"
                        className="mono-font"
                        size="sm"
                      >
                        @hathetrung{" "}
                        <IconArrowUpRight
                          size={14}
                          style={{ verticalAlign: "middle" }}
                        />
                      </Anchor>
                    </Group>

                    <Group
                      justify="space-between"
                      className="editorial-row-divider"
                      py="xs"
                    >
                      <Group gap="xs">
                        <IconBrandLinkedin size={20} color="#94A3B8" />
                        <Text className="mono-font" size="sm" color="#FFF">
                          LINKEDIN
                        </Text>
                      </Group>
                      <Anchor
                        href="https://linkedin.com"
                        target="_blank"
                        color="#FF7700"
                        className="mono-font"
                        size="sm"
                      >
                        in/hathetrung{" "}
                        <IconArrowUpRight
                          size={14}
                          style={{ verticalAlign: "middle" }}
                        />
                      </Anchor>
                    </Group>

                    <Group
                      justify="space-between"
                      className="editorial-row-divider"
                      py="xs"
                    >
                      <Group gap="xs">
                        <IconFingerprint size={20} color="#94A3B8" />
                        <Text className="mono-font" size="sm" color="#FFF">
                          PGP KEY
                        </Text>
                      </Group>
                      <Text className="mono-font" size="xs" color="#64748B">
                        8F3A 29B1 9C02 E41F
                      </Text>
                    </Group>

                    <Group
                      justify="space-between"
                      className="editorial-row-divider"
                      py="xs"
                    >
                      <Group gap="xs">
                        <IconWorld size={20} color="#94A3B8" />
                        <Text className="mono-font" size="sm" color="#FFF">
                          TIMEZONE
                        </Text>
                      </Group>
                      <Text className="mono-font" size="sm" color="#94A3B8">
                        ICT (UTC +7)
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>

            {/* Footer Row */}
            <Box
              mt={100}
              pt="md"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Group justify="space-between" align="center">
                <Text className="mono-font" size="xs" color="#64748B">
                  © {new Date().getFullYear()} HÀ THẾ TRUNG. ALL RIGHTS
                  RESERVED.
                </Text>
                <Text className="mono-font" size="xs" color="#64748B">
                  ENGINEERED WITH MANTINE & REACT // HIGH CONTRAST DARK
                  TELEMETRY
                </Text>
              </Group>
            </Box>
          </Container>
        </Box>
      </Box>
    </MantineProvider>
  );
}
