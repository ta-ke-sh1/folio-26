import { useState, useEffect } from "react";
import {
  Group,
  Stack,
  Title,
  Text,
  Container,
  SimpleGrid,
  Paper,
  Badge,
  Code,
  ThemeIcon,
  Timeline,
  Anchor,
} from "@mantine/core";
import {
  IconCpu,
  IconServer,
  IconVariable,
  IconTerminal2,
  IconCheck,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconBriefcase,
  IconSchool,
} from "@tabler/icons-react";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";

// =========================================================================
// --- ASCII TELEMETRY & ANIMATION frames ---
// =========================================================================

const asciiRadarFrames = [
  `
    [ SYSTEM TELEMETRY ]
    +-------------------+
    |     .   :   .     |
    |   .   ::::.   .   |
    |  :  ::  :  ::  :  |
    |   .   ::::.   .   |
    |     .   :   .     |
    +-------------------+
    STATUS: NOMINAL (0ms)
  `,
  `
    [ SYSTEM TELEMETRY ]
    +-------------------+
    |  :  ::  :  ::  :  |
    |   .   ::::.   .   |
    |     .   :   .     |
    |   .   ::::.   .   |
    |  :  ::  :  ::  :  |
    +-------------------+
    STATUS: SOLVING PIPELINE
  `,
];

function AsciiTelemetryCard() {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % asciiRadarFrames.length);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <Paper p="md" radius="md" bg="dark.9" withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap={6}>
          <IconTerminal2 size={16} color="var(--mantine-color-teal-4)" />
          <Text fz="xs" c="teal.4" style={{ fontFamily: "monospace" }}>
            NODE_STATE // TRUNG_HA_CORE
          </Text>
        </Group>
        <Badge size="xs" color="teal" variant="dot">
          ACTIVE
        </Badge>
      </Group>

      <Code
        block
        bg="transparent"
        c="teal.3"
        fz={11}
        lh={1.2}
        style={{ fontFamily: "monospace", whiteSpace: "pre" }}
      >
        {asciiRadarFrames[frameIdx]}
      </Code>
    </Paper>
  );
}

// =========================================================================
// --- MAIN ABOUT COMPONENT ---
// =========================================================================

const expertise = [
  {
    icon: IconServer,
    title: "Distributed Web Systems",
    description:
      "Architecting scalable gRPC, REST, and WebSocket APIs with strong emphasis on concurrency, memory management, and data flow efficiency.",
  },
  {
    icon: IconVariable,
    title: "Simulation Systems Design",
    description:
      "Developing numerical state solvers, discrete-event simulations, and parameter-driven modeling backends for complex workflows.",
  },
  {
    icon: IconCpu,
    title: "High-Performance Core",
    description:
      "Parallel algorithm execution, state machine orchestration, and low-level compute optimization across microservice pipelines.",
  },
];

const techList = [
  "Go / Rust / C++",
  "Node.js & TypeScript",
  "gRPC & Protocol Buffers",
  "PostgreSQL & Redis",
  "Kafka & NATS Messaging",
  "Docker & Kubernetes",
];

export default function AboutLayout() {
  return (
    <LayoutWrapper>
      <Stack gap="xl">
        {/* --- HERO TITLE (Preserved exact styling) --- */}
        <Group pt={"90"} justify={"center"}>
          <Stack justify="center">
            <Title
              style={{
                fontSize: "clamp(36px, 7vw, 84px)",
                fontWeight: 900,
                color: "#FF7700",
                fontFamily: "monospace",
                letterSpacing: "-2px",
                lineHeight: 1,
                textAlign: "center",
                textShadow: "0 0 12px rgba(255, 119, 0, 0.6)",
              }}
            >
              ABOUT ME
            </Title>
          </Stack>
        </Group>

        <Container size="md" pb={{ base: 40, sm: 80 }}>
          <Stack gap={40}>
            {/* --- ASCII TELEMETRY CARD & BIO --- */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="sm">
                <Badge variant="light" color="blue" size="lg" radius="sm">
                  Back-End & Simulation Engineer
                </Badge>
                <Text fz="lg" fw={500} lh={1.6}>
                  Hi, I’m Trung. I specialize in designing distributed backend
                  systems, low-latency web services, and domain-specific
                  simulation engines.
                </Text>
                <Text c="dimmed" fz="sm" lh={1.6}>
                  My work centers around turning complex system mechanics and
                  numerical state models into reliable, high-throughput
                  microservice architectures.
                </Text>

                {/* Social Links */}
                <Group gap="md" mt="xs">
                  <Anchor href="https://github.com" target="_blank" c="dimmed">
                    <Group gap={4}>
                      <IconBrandGithub size={18} />
                      <Text fz="xs" fw={600}>
                        GitHub
                      </Text>
                    </Group>
                  </Anchor>
                  <Anchor
                    href="https://linkedin.com"
                    target="_blank"
                    c="dimmed"
                  >
                    <Group gap={4}>
                      <IconBrandLinkedin size={18} />
                      <Text fz="xs" fw={600}>
                        LinkedIn
                      </Text>
                    </Group>
                  </Anchor>
                  <Anchor href="mailto:contact@example.com" c="dimmed">
                    <Group gap={4}>
                      <IconMail size={18} />
                      <Text fz="xs" fw={600}>
                        Email
                      </Text>
                    </Group>
                  </Anchor>
                </Group>
              </Stack>

              {/* Interactive ASCII Frame */}
              <AsciiTelemetryCard />
            </SimpleGrid>

            {/* --- EXPERTISE GRID --- */}
            <Stack gap="md">
              <Title order={3} fz={24}>
                Core Competencies
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {expertise.map((item) => (
                  <Paper key={item.title} p="md" radius="md" withBorder>
                    <ThemeIcon
                      size={40}
                      radius="md"
                      color="blue"
                      variant="light"
                      mb="sm"
                    >
                      <item.icon size={22} />
                    </ThemeIcon>
                    <Text fw={700} fz="md" mb={4}>
                      {item.title}
                    </Text>
                    <Text fz="xs" c="dimmed" lh={1.5}>
                      {item.description}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>

            {/* --- TECH STACK & EXPERIENCE TIMELINE --- */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {/* Tech Stack Box */}
              <Paper
                p="lg"
                radius="md"
                withBorder
                bg="var(--mantine-color-gray-0)"
              >
                <Text fw={700} fz="lg" mb="sm">
                  Primary Technical Stack
                </Text>
                <Text fz="xs" c="dimmed" mb="md">
                  Tools & languages used for building system backends and
                  computational modules:
                </Text>

                <SimpleGrid cols={2} spacing="xs">
                  {techList.map((tech) => (
                    <Group key={tech} gap={6}>
                      <ThemeIcon color="teal" size={16} radius="xl">
                        <IconCheck size={10} />
                      </ThemeIcon>
                      <Text fz="xs" fw={600}>
                        {tech}
                      </Text>
                    </Group>
                  ))}
                </SimpleGrid>
              </Paper>

              {/* Experience Timeline */}
              <Stack gap="xs">
                <Text fw={700} fz="lg" mb="xs">
                  Milestones
                </Text>
                <Timeline active={1} bulletSize={24} lineWidth={2}>
                  <Timeline.Item
                    bullet={<IconBriefcase size={12} />}
                    title="Senior Systems Architect"
                  >
                    <Text c="dimmed" fz="xs">
                      Lead backend engineer responsible for simulation engines
                      and distributed pipeline services.
                    </Text>
                    <Text size="xs" mt={4} c="blue" fw={500}>
                      2024 – Present
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item
                    bullet={<IconBriefcase size={12} />}
                    title="Back-End Software Engineer"
                  >
                    <Text c="dimmed" fz="xs">
                      Designed high-throughput REST & gRPC API systems and
                      state-synchronization channels.
                    </Text>
                    <Text size="xs" mt={4} c="dimmed">
                      2021 – 2024
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item
                    bullet={<IconSchool size={12} />}
                    title="B.S. in Computer Science"
                  >
                    <Text c="dimmed" fz="xs">
                      Focused on Software Architecture, Distributed Systems, and
                      Parallel Algorithms.
                    </Text>
                  </Timeline.Item>
                </Timeline>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Container>
      </Stack>
    </LayoutWrapper>
  );
}
