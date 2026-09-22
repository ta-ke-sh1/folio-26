// ==========================================
// FORM 3: TALK / CONTACT LIST FORM

import {
  Stack,
  Box,
  Text,
  Paper,
  Group,
  Badge,
  CopyButton,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import {
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandMatrix,
  IconBrandGithub,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react";

// ==========================================
interface ContactChannel {
  name: string;
  handle: string;
  icon: React.ElementType;
  type: string;
}

const CONTACT_LIST: ContactChannel[] = [
  {
    name: "Discord",
    handle: "developer#0001",
    icon: IconBrandDiscord,
    type: "REALTIME_CHAT",
  },
  {
    name: "Telegram",
    handle: "@dev_terminal",
    icon: IconBrandTelegram,
    type: "ENCRYPTED_MSG",
  },
  {
    name: "Matrix",
    handle: "@dev:matrix.org",
    icon: IconBrandMatrix,
    type: "DECENTRALIZED",
  },
  {
    name: "GitHub",
    handle: "github.com/dev-profile",
    icon: IconBrandGithub,
    type: "SOURCE_CONTROL",
  },
];

export default function TalkContactsForm() {
  return (
    <Stack className="instrument-form" gap="sm">
      {/* Decorative ASCII Radar / Satellite Graphic */}
      <Box
        className="instrument-form__beacon"
        p="xs"
        style={{
          textAlign: "center",
        }}
      >
        <Text
          component="pre"
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            lineHeight: 1.1,
            color: "#FF7700",
            margin: 0,
          }}
        >
          {`    .-.     SIGNAL BEACON ACTIVE
   (( ))    FREQ: 2.4 GHz // MULTI-CHANNEL
    '-'     STATUS: LISTENING FOR CONNECTION`}
        </Text>
      </Box>

      <Text
        className="instrument-form__intro"
        fz="xs"
        style={{
          fontFamily: "monospace",
          color: "var(--mantine-color-gray-4)",
        }}
      >
        Select a channel below to initiate direct communication or copy contact
        coordinates:
      </Text>

      {/* List of Contacts */}
      <Stack gap="xs">
        {CONTACT_LIST.map((contact, i) => {
          const ChannelIcon = contact.icon;
          return (
            <Paper
              className="instrument-contact"
              key={i}
              p="xs"
            >
              <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <Box
                    className="instrument-contact__icon"
                    style={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ChannelIcon size={18} color="#FF7700" />
                  </Box>

                  <Box>
                    <Group gap={6} align="center">
                      <Text
                        fz="xs"
                        fw={700}
                        style={{
                          fontFamily: "monospace",
                          color: "var(--folio-text)",
                        }}
                      >
                        {contact.name}
                      </Text>
                      <Badge
                        size="xs"
                        color="gray"
                        variant="outline"
                        ff="monospace"
                      >
                        {contact.type}
                      </Badge>
                    </Group>
                    <Text
                      className="instrument-contact__handle"
                      fz="11px"
                      style={{
                        fontFamily: "monospace",
                        color: "var(--mantine-color-gray-5)",
                      }}
                    >
                      {contact.handle}
                    </Text>
                  </Box>
                </Group>

                <CopyButton value={contact.handle} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied!" : "Copy Handle"}
                      withArrow
                      position="left"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "orange"}
                        variant="subtle"
                        onClick={copy}
                      >
                        {copied ? (
                          <IconCheck size={16} />
                        ) : (
                          <IconCopy size={16} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}
