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
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandFacebook,
  IconBrandInstagram,
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
        sx={{
          "&:hover": {
            color: "#FF7700 !important",
            transform: "translateX(4px)",
          },
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
      pt="xxl"
      pb="md"
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "#050505",
        borderTop: "1px solid rgba(255, 119, 0, 0.25)",
        overflow: "hidden",
      }}
    >
      <Stack
        justify="space-between"
        style={{ minHeight: "360px", position: "relative", zIndex: 12 }}
      >
        {/* Top Section: Brand Info + Dynamic Link Columns */}
        <Group>
          <AsciiCanvas type={AsciiTypes.BINARY_RAIN} defaultHeight={400} />
        </Group>
        <Group justify="space-between" align="flex-start" mb="xl" mt="md">
          <Stack gap="xs" style={{ maxWidth: 320 }}>
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
              // A developer's stash of visions, dreams, and escapes.
              <br />
              SYS_VER: 2026.09.05 // LOC: HAN
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xl">
            {groups}
          </SimpleGrid>
        </Group>

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
