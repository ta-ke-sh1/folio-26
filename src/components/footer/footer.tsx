import { useState } from "react";
import {
  Anchor,
  Container,
  Group,
  ActionIcon,
  Text,
  Stack,
  SimpleGrid,
  Divider,
  Box,
  TextInput,
  Textarea,
  Button,
  Paper,
  Grid,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandFacebook,
  IconBrandInstagram,
  IconSend,
  IconTerminal2,
  IconCheck,
} from "@tabler/icons-react";
import { AsciiCanvas } from "../animations/ascii/ascii";
import { AsciiTypes } from "../animations/ascii/types";

const footerData = [
  {
    title: "CONNECT",
    links: [
      { label: "Facebook", link: "#" },
      { label: "Instagram", link: "#" },
      { label: "Github", link: "#" },
      { label: "trung.ha@folio.dev", link: "#" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Collections", link: "/collections" },
      { label: "Playground", link: "#" },
    ],
  },
  {
    title: "NAVIGATION",
    links: [
      { label: "About", link: "/about" },
      { label: "Contact", link: "/contacts" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const groups = footerData.map((group) => {
    const links = group.links.map((link, index) => (
      <Anchor
        key={index}
        href={link.link}
        lh={1.4}
        size="sm"
        style={{
          fontFamily: "monospace",
          color: "#A6A7AB",
          textDecoration: "none",
          transition: "color 0.2s ease, transform 0.2s ease",
        }}
      >
        {`> ${link.label}`}
      </Anchor>
    ));

    return (
      <Stack key={group.title} gap="xs">
        <Text
          fw={700}
          size="sm"
          style={{
            fontFamily: "monospace",
            color: "#FF7700",
            letterSpacing: "1px",
          }}
        >
          {`[${group.title}]`}
        </Text>
        <Divider color="rgba(255, 119, 0, 0.2)" mb="xs" />
        {links}
      </Stack>
    );
  });

  return (
    <Container
      component="footer"
      fluid
      px="xl"
      pt="xl"
      pb="md"
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "var(--folio-surface)",
        borderTop: "1px solid var(--folio-border)",
        overflow: "hidden",
      }}
    >
      <Stack
        justify="space-between"
        style={{ minHeight: "360px", position: "relative", zIndex: 12 }}
      >
        {/* Background ASCII Animation */}
        <Group
          style={{
            opacity: 1,
            width: "100%",
            pointerEvents: "none",
          }}
        >
          <AsciiCanvas type={AsciiTypes.BINARY_RAIN} defaultHeight={500} />
        </Group>

        {/* Main Footer Layout: Navigation & Direct Contact Form */}
        <Grid
          gap="xl"
          mb="xl"
          mt="md"
          style={{ position: "relative", zIndex: 13 }}
        >
          {/* Left Column: Brand Info & Quick Links */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Stack gap="xl">
              <Stack gap="xs" style={{ maxWidth: 420 }}>
                <Group gap="xs">
                  <Box
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#FF7700",
                      boxShadow: "0 0 8px #FF7700",
                    }}
                  />
                  <Text
                    fw={800}
                    size="lg"
                    style={{
                      fontFamily: "monospace",
                      color: "#FF7700",
                      letterSpacing: "-0.5px",
                      textShadow: "0 0 8px rgba(255, 119, 0, 0.5)",
                    }}
                  >
                    Trung. Ha
                  </Text>
                </Group>
                <Text
                  size="xs"
                  c="dimmed"
                  style={{
                    fontFamily: "monospace",
                    lineHeight: "1.6",
                    color: "#909296",
                  }}
                >
                  // A developer's stash of visions, architectures, and systems.
                  <br />
                  SYS_VER: 2026.09.05 // LOC: HAN
                </Text>
              </Stack>

              <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xl">
                {groups}
              </SimpleGrid>
            </Stack>
          </Grid.Col>

          {/* Right Column: Terminal Contact Form */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper
              p="md"
              radius="md"
              withBorder
              style={{
                backgroundColor: "var(--folio-card)",
                borderColor: "rgba(255, 119, 0, 0.3)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
              }}
            >
              <Group gap="xs" mb="xs">
                <IconTerminal2 size={18} color="#FF7700" />
                <Text
                  size="xs"
                  fw={700}
                  style={{
                    fontFamily: "monospace",
                    color: "#FF7700",
                    letterSpacing: "1px",
                  }}
                >
                  [DISPATCH_MESSAGE]
                </Text>
              </Group>
              <Divider color="rgba(255, 119, 0, 0.2)" mb="md" />

              {submitted ? (
                <Paper
                  p="sm"
                  style={{
                    backgroundColor: "rgba(255, 119, 0, 0.08)",
                    border: "1px solid #FF7700",
                  }}
                >
                  <Group gap="xs">
                    <IconCheck size={18} color="#FF7700" />
                    <Text
                      size="xs"
                      style={{ fontFamily: "monospace", color: "#FF7700" }}
                    >
                      STATUS: TRANSMISSION_SUCCESSFUL // ACK RECEIVED
                    </Text>
                  </Group>
                </Paper>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Stack gap="sm">
                    <TextInput
                      required
                      placeholder="user@domain.com"
                      label="SENDER_EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      styles={{
                        label: {
                          fontFamily: "monospace",
                          fontSize: "11px",
                          color: "#FF7700",
                          marginBottom: "4px",
                        },
                        input: {
                          backgroundColor: "var(--folio-surface)",
                          borderColor: "rgba(255, 119, 0, 0.3)",
                          color: "var(--folio-text)",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          "&:focus": {
                            borderColor: "#FF7700",
                          },
                        },
                      }}
                    />

                    <Textarea
                      required
                      placeholder="Type your message vector here..."
                      label="PAYLOAD_DATA"
                      minRows={3}
                      maxRows={5}
                      value={message}
                      onChange={(e) => setMessage(e.currentTarget.value)}
                      styles={{
                        label: {
                          fontFamily: "monospace",
                          fontSize: "11px",
                          color: "#FF7700",
                          marginBottom: "4px",
                        },
                        input: {
                          backgroundColor: "var(--folio-surface)",
                          borderColor: "rgba(255, 119, 0, 0.3)",
                          color: "var(--folio-text)",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          "&:focus": {
                            borderColor: "#FF7700",
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      fullWidth
                      variant="outline"
                      leftSection={<IconSend size={14} />}
                      style={{
                        borderColor: "#FF7700",
                        color: "#FF7700",
                        backgroundColor: "rgba(255, 119, 0, 0.05)",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        letterSpacing: "0.5px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      $ TRANSMIT_MSG
                    </Button>
                  </Stack>
                </form>
              )}
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Bottom Bar: Copyright, Telemetry Status & Social Icons */}
        <Stack gap="xs">
          <Divider color="rgba(255, 119, 0, 0.15)" />
          <Group justify="space-between" align="center" pt="xs">
            <Text
              c="dimmed"
              size="xs"
              style={{ fontFamily: "monospace", color: "#696969" }}
            >
              © {new Date().getFullYear()} FOLIO.26 // ALL RIGHTS RESERVED
            </Text>

            <Group gap="md" visibleFrom="xs">
              <Text
                size="xs"
                style={{ fontFamily: "monospace", color: "#505050" }}
              >
                STATUS: ONLINE
              </Text>
              <Text
                size="xs"
                style={{ fontFamily: "monospace", color: "#505050" }}
              >
                BAUD: 9600
              </Text>
            </Group>

            <Group gap="xs" justify="flex-end" wrap="nowrap">
              <ActionIcon
                size="md"
                variant="subtle"
                color="orange"
                style={{
                  border: "1px solid rgba(255, 119, 0, 0.2)",
                  backgroundColor: "rgba(255, 119, 0, 0.05)",
                  color: "#FF7700",
                }}
              >
                <IconBrandFacebook size={16} stroke={1.5} />
              </ActionIcon>

              <ActionIcon
                size="md"
                variant="subtle"
                color="orange"
                style={{
                  border: "1px solid rgba(255, 119, 0, 0.2)",
                  backgroundColor: "rgba(255, 119, 0, 0.05)",
                  color: "#FF7700",
                }}
              >
                <IconBrandInstagram size={16} stroke={1.5} />
              </ActionIcon>

              <Divider
                orientation="vertical"
                color="rgba(255, 119, 0, 0.2)"
                h={20}
              />

              <ActionIcon
                size="md"
                variant="subtle"
                color="orange"
                style={{
                  border: "1px solid rgba(255, 119, 0, 0.2)",
                  backgroundColor: "rgba(255, 119, 0, 0.05)",
                  color: "#FF7700",
                }}
              >
                <IconBrandGithub size={16} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Group>
        </Stack>
      </Stack>
    </Container>
  );
}
