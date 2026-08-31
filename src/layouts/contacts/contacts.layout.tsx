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
  | >>------------->   |
  |    ENCRYPTING...    |
  | [=====>        ]   |
  +---------------------+
  STATUS: TRANSMITTING
  `,
  `
 [ PACKET DISPATCHING ]
  +---------------------+
  |    ------------->>  |
  |    ENCRYPTING...    |
  | [===========>  ]   |
  +---------------------+
  STATUS: TRANSMITTING
  `,
  `
 [ PACKET DISPATCHING ]
  +---------------------+
  |   ------------->>>  |
  |    HANDSHAKE OK!    |
  | [==============]   |
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
    const frames = status === "idle" ? idleFrames : sendingFrames;
    const timer = setInterval(
      () => {
        setFrameIdx((prev) => (prev + 1) % frames.length);
      },
      status === "sending" ? 250 : 500,
    );

    return () => clearInterval(timer);
  }, [status]);

  const activeFrame =
    status === "sent"
      ? sendingFrames[2]
      : status === "sending"
        ? sendingFrames[frameIdx % 2]
        : idleFrames[frameIdx % 2];

  return (
    <Paper p="md" radius="md" bg="dark.9" withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap={6}>
          <IconTerminal2 size={16} color="var(--mantine-color-teal-4)" />
          <Text fz="xs" c="teal.4" style={{ fontFamily: "monospace" }}>
            COMMS_GATEWAY // ROUTER
          </Text>
        </Group>
        <Badge
          size="xs"
          color={
            status === "sent"
              ? "green"
              : status === "sending"
                ? "yellow"
                : "teal"
          }
          variant="dot"
        >
          {status.toUpperCase()}
        </Badge>
      </Group>

      <Code
        block
        bg="transparent"
        c={status === "sent" ? "green.4" : "teal.3"}
        fz={11}
        lh={1.2}
        style={{ fontFamily: "monospace", whiteSpace: "pre" }}
      >
        {activeFrame}
      </Code>

      <Box
        pt="xs"
        mt="xs"
        style={{ borderTop: "1px solid var(--mantine-color-dark-6)" }}
      >
        <Text fz={10} c="gray.6" style={{ fontFamily: "monospace" }}>
          {status === "idle" && "> Waiting for form payload submission..."}
          {status === "sending" &&
            "> Constructing packet payloads & dispatching..."}
          {status === "sent" &&
            "> Packet successfully routed to Trung Ha's inbox!"}
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

    // Simulate backend submission process
    setTimeout(() => {
      setFormStatus("sent");
    }, 1800);
  };

  return (
    <LayoutWrapper>
      <Stack gap="xl">
        {/* --- HERO TITLE (Preserved exact styling) --- */}
        <Group pt={"md"} justify={"center"}>
          <Stack justify="center">
            <Title
              style={{
                maxWidth: 700,
                textAlign: "center",
                lineHeight: "86px",
                fontWeight: 1000,
                fontSize: 96,
                letterSpacing: -3,
                fontFamily: "Plus Jakarta Sans Variable",
              }}
            >
              CONTACT ME
            </Title>
          </Stack>
        </Group>

        <Container size="md" pb={{ base: 40, sm: 80 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {/* Left Column: Direct Info & ASCII Console */}
            <Stack gap="md">
              <Stack gap="xs">
                <Text fz="lg" fw={700}>
                  Let's Discuss Architecture & Simulation Systems
                </Text>
                <Text c="dimmed" fz="sm" lh={1.6}>
                  Have a question about high-throughput backends, web service
                  design, or simulation core solvers? Send a message and I'll
                  get back to you shortly.
                </Text>
              </Stack>

              {/* Animated ASCII Signal Dispatcher */}
              <AsciiContactConsole status={formStatus} />

              {/* Direct Details */}
              <Paper
                p="md"
                radius="md"
                withBorder
                bg="var(--mantine-color-gray-0)"
              >
                <Stack gap="xs">
                  <Group gap="sm">
                    <ThemeIcon
                      size={32}
                      radius="md"
                      variant="light"
                      color="blue"
                    >
                      <IconMail size={18} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text fz={11} c="dimmed" fw={600}>
                        DIRECT EMAIL
                      </Text>
                      <Text fz="xs" fw={700}>
                        trung.ha@example.com
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap="sm">
                    <ThemeIcon
                      size={32}
                      radius="md"
                      variant="light"
                      color="blue"
                    >
                      <IconMapPin size={18} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text fz={11} c="dimmed" fw={600}>
                        LOCATION
                      </Text>
                      <Text fz="xs" fw={700}>
                        Available for Remote Work & Consulting
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
            </Stack>

            {/* Right Column: Interactive Form */}
            <Paper p="xl" radius="md" withBorder shadow="sm">
              {formStatus === "sent" ? (
                <Stack
                  align="center"
                  justify="center"
                  h="100%"
                  py="xl"
                  ta="center"
                >
                  <ThemeIcon
                    size={56}
                    radius="xl"
                    color="green"
                    variant="light"
                  >
                    <IconCheck size={32} />
                  </ThemeIcon>
                  <Title order={3}>Transmission Received!</Title>
                  <Text fz="sm" c="dimmed" style={{ maxWidth: 300 }}>
                    Thank you for reaching out. Your payload has been delivered
                    to my inbox.
                  </Text>
                  <Button
                    variant="default"
                    size="xs"
                    mt="sm"
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
                    Send Another Message
                  </Button>
                </Stack>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Stack gap="sm">
                    <TextInput
                      required
                      label="Your Name"
                      placeholder="e.g. Alex Mercer"
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
                      label="Your Email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.currentTarget.value,
                        })
                      }
                    />

                    <Select
                      label="Project / Request Type"
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
                      label="Message / System Specs"
                      placeholder="Describe your system requirements or technical inquiry..."
                      minRows={4}
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
                      color="blue"
                      loading={formStatus === "sending"}
                      rightSection={<IconSend size={18} />}
                      mt="xs"
                    >
                      {formStatus === "sending"
                        ? "Transmitting..."
                        : "Send Request"}
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
