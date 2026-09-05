import { useState, useEffect } from "react";
import {
  Group,
  Stack,
  Title,
  Text,
  Container,
  SimpleGrid,
  Paper,
  TextInput,
  Textarea,
  Button,
  Select,
  Code,
  Badge,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconTerminal2,
  IconSend,
  IconMail,
  IconMapPin,
  IconCheck,
  IconCpu,
} from "@tabler/icons-react";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";

// =========================================================================
// --- ASCII ANIMATION STATES ---
// =========================================================================

const idleFrames = [
  `
 [ SIGNAL ENGINE: IDLE ]
  +---------------------+
  |   .   .   .   .   . |
  |   o===o===o===o   |
  |   .   .   .   .   . |
  +---------------------+
  PORT: 443 // READY
  `,
  `
 [ SIGNAL ENGINE: IDLE ]
  +---------------------+
  |  .   .   .   .   .  |
  |   o---o---o---o   |
  |  .   .   .   .   .  |
  +---------------------+
  PORT: 443 // READY
  `,
];

const sendingFrames = [
  `
 [ PACKET DISPATCHING ]
  +---------------------+
  | >>------------->    |
  |    ENCRYPTING...    |
  | [=====>        ]    |
  +---------------------+
  STATUS: TRANSMITTING
  `,
  `
 [ PACKET DISPATCHING ]
  +---------------------+
  |    ------------->>  |
  |    ENCRYPTING...    |
  | [===========>  ]    |
  +---------------------+
  STATUS: TRANSMITTING
  `,
  `
 [ PACKET DISPATCHING ]
  +---------------------+
  |   ------------->>>  |
  |    HANDSHAKE OK!    |
  | [==============]    |
  +---------------------+
  STATUS: DELIVERED
  `,
];

function AsciiContactConsole({
  status,
}: {
  status: "idle" | "sending" | "sent";
}) {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (status === "sent") return;

    const intervalTime = status === "sending" ? 200 : 600;
    const timer = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % 2);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [status]);

  const activeFrame =
    status === "sent"
      ? sendingFrames[2]
      : status === "sending"
        ? sendingFrames[frameIdx]
        : idleFrames[frameIdx];

  return (
    <Paper
      p="md"
      radius="md"
      bg="dark.9"
      style={{
        border: "1px solid var(--mantine-color-orange-8)",
        boxShadow: "0 0 15px rgba(255, 146, 43, 0.12)",
      }}
    >
      <Group justify="space-between" mb="xs">
        <Group gap={6}>
          <IconTerminal2 size={16} color="var(--mantine-color-orange-5)" />
          <Text
            fz="xs"
            c="orange.5"
            fw={700}
            style={{ fontFamily: "monospace", letterSpacing: 0.5 }}
          >
            COMMS_GATEWAY // ROUTER
          </Text>
        </Group>
        <Badge
          size="xs"
          color={
            status === "sent"
              ? "orange"
              : status === "sending"
                ? "yellow"
                : "gray"
          }
          variant="outline"
          style={{ fontFamily: "monospace" }}
        >
          {status.toUpperCase()}
        </Badge>
      </Group>

      <Code
        block
        bg="transparent"
        c={status === "sent" ? "orange.4" : "orange.5"}
        fz={11}
        lh={1.25}
        style={{ fontFamily: "monospace", whiteSpace: "pre" }}
      >
        {activeFrame}
      </Code>

      <Box
        pt="xs"
        mt="xs"
        style={{ borderTop: "1px solid var(--mantine-color-dark-7)" }}
      >
        <Text fz={10} c="gray.6" style={{ fontFamily: "monospace" }}>
          {status === "idle" && "> System status normal. Ready for payload..."}
          {status === "sending" &&
            "> Encrypting payload & initiating TLS handshake..."}
          {status === "sent" &&
            "> Packet acknowledged. Output buffer verified."}
        </Text>
      </Box>
    </Paper>
  );
}

// =========================================================================
// --- MAIN CONTACT LAYOUT ---
// =========================================================================

export default function ContactsLayout() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">(
    "idle",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Backend Systems Design",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    setTimeout(() => {
      setFormStatus("sent");
    }, 2200);
  };

  const inputStyles = {
    input: {
      backgroundColor: "var(--mantine-color-dark-8)",
      borderColor: "var(--mantine-color-dark-5)",
      color: "var(--mantine-color-gray-1)",
      "&:focus": {
        borderColor: "var(--mantine-color-orange-5)",
      },
    },
    label: {
      color: "var(--mantine-color-gray-4)",
      fontFamily: "monospace",
      fontSize: "11px",
      letterSpacing: "0.5px",
      marginBottom: "4px",
    },
  };

  return (
    <LayoutWrapper>
      {/* Dynamic Keyframes for VHS Glitch Effect */}

      <Stack gap="xl">
        {/* --- HERO TITLE WITH VHS EFFECT --- */}
        <Group pt="100" justify="center">
          <Box className="vhs-title-container">
            <Title
              className="vhs-title"
              data-text="CONTACT ME"
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
              CONTACT ME
            </Title>
          </Box>
        </Group>

        <Container size="md" pb={{ base: 40, sm: 80 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {/* Left Column: Direct Info & ASCII Console */}
            <Stack gap="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconCpu size={20} color="var(--mantine-color-orange-5)" />
                  <Text fz="lg" fw={700}>
                    Systems & Architecture
                  </Text>
                </Group>
                <Text c="dimmed" fz="sm" lh={1.6}>
                  Discussing high-throughput backends, security analysis, or
                  simulation core engines? Send over a message payload or reach
                  out directly.
                </Text>
              </Stack>

              {/* Animated ASCII Terminal Console */}
              <AsciiContactConsole status={formStatus} />

              {/* Direct Details Panel */}
              <Paper
                p="md"
                radius="md"
                bg="dark.8"
                style={{ border: "1px solid var(--mantine-color-dark-6)" }}
              >
                <Stack gap="sm">
                  <Group gap="sm">
                    <ThemeIcon
                      size={32}
                      radius="md"
                      variant="light"
                      color="orange"
                    >
                      <IconMail size={18} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text
                        fz={10}
                        c="gray.5"
                        fw={700}
                        style={{ fontFamily: "monospace" }}
                      >
                        DIRECT_EMAIL
                      </Text>
                      <Text fz="xs" fw={600} c="gray.2">
                        trung.ha@example.com
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap="sm">
                    <ThemeIcon
                      size={32}
                      radius="md"
                      variant="light"
                      color="orange"
                    >
                      <IconMapPin size={18} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text
                        fz={10}
                        c="gray.5"
                        fw={700}
                        style={{ fontFamily: "monospace" }}
                      >
                        LOCATION
                      </Text>
                      <Text fz="xs" fw={600} c="gray.2">
                        Available for Remote Work & Consulting
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
            </Stack>

            {/* Right Column: Interactive Dark Form */}
            <Paper
              p="xl"
              radius="md"
              bg="dark.8"
              style={{ border: "1px solid var(--mantine-color-dark-5)" }}
              shadow="md"
            >
              {formStatus === "sent" ? (
                <Stack
                  align="center"
                  justify="center"
                  h="100%"
                  py="xl"
                  ta="center"
                  gap="md"
                >
                  <ThemeIcon
                    size={60}
                    radius="xl"
                    color="orange"
                    variant="light"
                  >
                    <IconCheck size={34} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Title order={3} c="gray.1">
                      Transmission Received
                    </Title>
                    <Text fz="sm" c="dimmed" style={{ maxWidth: 300 }}>
                      Your message has been safely encrypted and routed to my
                      inbox.
                    </Text>
                  </Stack>
                  <Button
                    variant="outline"
                    color="orange"
                    size="xs"
                    mt="xs"
                    onClick={() => {
                      setFormStatus("idle");
                      setFormData({
                        name: "",
                        email: "",
                        subject: "Backend Systems Design",
                        message: "",
                      });
                    }}
                  >
                    Send Another Packet
                  </Button>
                </Stack>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Stack gap="sm">
                    <TextInput
                      required
                      label="ORIGIN // NAME"
                      placeholder="e.g. Alex Mercer"
                      styles={inputStyles}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.currentTarget.value,
                        })
                      }
                    />

                    <TextInput
                      required
                      type="email"
                      label="RETURN_ADDRESS // EMAIL"
                      placeholder="alex@company.com"
                      styles={inputStyles}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.currentTarget.value,
                        })
                      }
                    />

                    <Select
                      label="PAYLOAD // TYPE"
                      styles={inputStyles}
                      data={[
                        "Backend Systems Design",
                        "Simulation Engine Core",
                        "Consulting & Code Review",
                        "General Inquiry",
                      ]}
                      value={formData.subject}
                      onChange={(val) =>
                        setFormData({ ...formData, subject: val || "" })
                      }
                    />

                    <Textarea
                      required
                      label="SPECIFICATION // MESSAGE"
                      placeholder="Detail your system requirements or technical inquiry..."
                      minRows={4}
                      styles={inputStyles}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.currentTarget.value,
                        })
                      }
                    />

                    <Button
                      type="submit"
                      size="md"
                      color="orange"
                      variant="filled"
                      loading={formStatus === "sending"}
                      rightSection={<IconSend size={18} />}
                      mt="xs"
                    >
                      {formStatus === "sending"
                        ? "Transmitting Payload..."
                        : "Dispatch Signal"}
                    </Button>
                  </Stack>
                </form>
              )}
            </Paper>
          </SimpleGrid>
        </Container>
      </Stack>
    </LayoutWrapper>
  );
}
