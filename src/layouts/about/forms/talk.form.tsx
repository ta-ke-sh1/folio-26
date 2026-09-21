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
    <Stack gap="sm" style={{}}>
      {/* Decorative ASCII Radar / Satellite Graphic */}
      <Box
        p="xs"
        style={{
          backgroundColor: "#050505",
          border: "1px border #262626",
          borderRadius: "4px",
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
              key={i}
              p="xs"
              style={{
                backgroundColor: "#141414",
                border: "1px solid #262626",
                borderRadius: "4px",
              }}
            >
              <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "4px",
                      backgroundColor: "#1f1f1f",
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
                        style={{ fontFamily: "monospace", color: "#ffffff" }}
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
