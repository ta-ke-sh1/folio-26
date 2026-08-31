import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Card,
  ThemeIcon,
  Stack,
  Badge,
  Paper,
  Code,
  Box,
} from "@mantine/core";
import {
  IconCpu,
  IconTerminal2,
  IconFlame,
  IconArrowRight,
  IconCode,
  IconActivity,
  IconBinary,
} from "@tabler/icons-react";
import Footer from "../../components/footer/footer";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";

// =========================================================================
// --- ASCII ANIMATION FRAMES & ENGINE ---
// =========================================================================

// 3D Rotating Cube ASCII Frames
const cubeFrames = [
  `
      +------+
     /      /|
    +------+ |
    |      | +
    |      |/
    +------+ 
  `,
  `
       /------+
      /      /|
     +------+ |
     |      | +
     |      |/
     +------+ 
  `,
  `
     +------+
     |\\     |\\
     | +----+ |
     | |    | |
     +-|----+ |
      \\|     \\|
       +------+
  `,
  `
       +------+
      /|     /|
     + |----+ |
     | |    | |
     | +----|-+
     |/     |/
     +------+
  `,
];

// Matrix Binary Stream Frames
const binaryStreamFrames = [
  "1 0 1   1 11 1\n1 0 1   0 11 0\n1 0 1   1 10 1\n0 1 0   0  1 1\n0 0 0   0  0 0",
  "0 1 0   0 01 0\n1 1 0   1 00 1\n0 0 1   0 11 0\n1 0 1   1  0 1\n1 1 0   1  1 0",
  "1 1 1   0 10 1\n0 0 1   1 11 0\n1 0 0   0 01 1\n0 1 1   1  1 0\n0 0 1   0  0 1",
  "0 0 1   1 00 0\n1 0 0   0 10 1\n0 1 1   1 01 0\n1 1 0   0  1 1\n1 0 1   1  0 0",
];

// Custom Hook to drive ASCII updates
function useAsciiSequence(frames: string[], intervalMs: number) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [frames, intervalMs]);

  return frames[frameIndex];
}

// Sub-component: Animated ASCII Wireframe Canvas
function AsciiWireframeDisplay() {
  const activeCube = useAsciiSequence(cubeFrames, 250);
  const activeMatrix = useAsciiSequence(binaryStreamFrames, 180);

  return (
    <Paper
      p="md"
      radius="md"
      bg="dark.9"
      style={{
        border: "1px solid var(--mantine-color-dark-4)",
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
        height: 300,
      }}
    >
      <Stack
        justify="space-between"
        style={{
          height: "100%",
        }}
      >
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <IconTerminal2 size={16} color="var(--mantine-color-teal-4)" />
            <Text fz="xs" c="teal.4" style={{ fontFamily: "monospace" }}>
              ENGINE_CORE // RUNTIME_ACTIVE
            </Text>
          </Group>
          <Badge size="xs" variant="outline" color="teal">
            60 FPS SOLVER
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
          {/* 3D Spinning Cube Frame */}
          <Box
            p="xs"
            style={{ borderRight: "1px border var(--mantine-color-dark-6)" }}
          >
            <Text fz={10} c="dimmed" mb={4} style={{ fontFamily: "monospace" }}>
              // 3D MODEL PROJECTION
            </Text>
            <Code
              block
              bg="transparent"
              c="teal.3"
              fz={11}
              lh={1.2}
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                height: 145,
              }}
            >
              {activeCube}
            </Code>
          </Box>

          {/* Live Matrix Stream */}
          <Box p="xs">
            <Text fz={10} c="dimmed" mb={4} style={{ fontFamily: "monospace" }}>
              // REALTIME TELEMETRY STREAM
            </Text>
            <Code
              block
              bg="transparent"
              c="blue.3"
              fz={11}
              lh={1.2}
              style={{ fontFamily: "monospace", whiteSpace: "pre" }}
            >
              {activeMatrix}
            </Code>
          </Box>
        </SimpleGrid>

        <Box
          pt="xs"
          style={{ borderTop: "1px solid var(--mantine-color-dark-6)" }}
        >
          <Text
            fz={10}
            c="gray.6"
            ta="center"
            style={{ fontFamily: "monospace" }}
          >
            [ COMPUTING SYSTEM STATE SOLVER DELTAS... OK ]
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
}

// =========================================================================
// --- LANDING PAGE COMPONENT ---
// =========================================================================

const coreFeatures = [
  {
    icon: IconCpu,
    title: "High-Performance Compute",
    description:
      "Engineered with parallel algorithms and state machine orchestration for low-latency numerical computation.",
  },
  {
    icon: IconBinary,
    title: "Dynamic Simulation Engines",
    description:
      "Custom physics and parameter-driven solvers delivering real-time telemetry processing across system nodes.",
  },
  {
    icon: IconCode,
    title: "Microservice Web Systems",
    description:
      "Distributed gRPC and REST APIs engineered for resilience, fault tolerance, and multi-node synchronization.",
  },
  {
    icon: IconActivity,
    title: "Event Streaming Pipelines",
    description:
      "High-throughput event-driven messaging architectures handling stream analytics and state replication.",
  },
];

export default function AsciiLandingPage() {
  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <Group pt={"md"} justify={"center"}>
        <Stack justify="center">
          <Title
            style={{
              maxWidth: 750,
              textAlign: "center",
              lineHeight: "86px",
              fontWeight: 800,
              fontSize: 96,
              letterSpacing: -3,
              fontFamily: "Plus Jakarta Sans Variable",
            }}
          >
            MATERIALIZING YOUR WILDEST IMAGINATIONS
          </Title>
        </Stack>
      </Group>

      <Container size="lg" py={{ base: 40, sm: 80 }}>
        <Stack align="center" gap="md" ta="center" mb={40}>
          <Text
            c="dimmed"
            fz={{ base: "md", sm: "lg" }}
            style={{ maxWidth: 650 }}
          >
            Building high-speed simulation backends, real-time message
            pipelines, and resilient microservice architectures.
          </Text>
        </Stack>

        {/* ASCII Animation Interactive Display */}
        <Container size="md">
          <AsciiWireframeDisplay />
        </Container>
      </Container>

      {/* Engineering Capabilities */}
      <Paper bg="var(--mantine-color-gray-0)" py={{ base: 40, sm: 60 }} my="xl">
        <Container size="lg">
          <Stack align="center" mb={40} ta="center">
            <Badge color="blue" variant="dot">
              Core Capabilities
            </Badge>
            <Title order={2} fz={{ base: 28, sm: 36 }}>
              Architected for Performance & Precision
            </Title>
            <Text c="dimmed" max-w={550}>
              Bridging mathematical simulation algorithms with scalable,
              cloud-native web backends.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {coreFeatures.map((item) => (
              <Card
                key={item.title}
                shadow="sm"
                padding="xl"
                radius="md"
                withBorder
              >
                <Group align="flex-start" wrap="nowrap">
                  <ThemeIcon size={48} radius="md" variant="light" color="teal">
                    <item.icon size={26} stroke={1.5} />
                  </ThemeIcon>
                  <Stack gap="xs">
                    <Text fw={700} fz="lg">
                      {item.title}
                    </Text>
                    <Text fz="sm" c="dimmed" lh={1.6}>
                      {item.description}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Paper>

      {/* CTA Section */}
      <Container size="lg" py={{ base: 40, sm: 60 }}>
        <Paper
          radius="md"
          p={{ base: "xl", sm: 50 }}
          bg="teal.8"
          c="white"
          style={{ textAlign: "center" }}
        >
          <Stack align="center" gap="md">
            <Title order={2} c="white" fz={{ base: 24, sm: 36 }}>
              Ready to construct your simulation pipeline?
            </Title>
            <Text c="teal.1" max-w={550}>
              Available for system architecture consulting, high-throughput
              backend implementation, and core solver optimization.
            </Text>
            <Button size="lg" color="white" c="teal.8" radius="md" mt="sm">
              Schedule Architecture Review
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* Page Footer */}
      <Footer />
    </LayoutWrapper>
  );
}
