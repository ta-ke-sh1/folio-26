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
  IconBrandGithub,
  IconCheck,
  IconCopy,
  IconBrandFacebook,
  IconBrandInstagram,
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
    handle: "tru.ng_ha",
    icon: IconBrandDiscord,
    type: "REALTIME_CHAT",
  },
  {
    name: "Facebook",
    handle: "https://www.facebook.com/ed.1698/",
    icon: IconBrandFacebook,
    type: "SOCIAL",
  },
  {
    name: "Instagram",
    handle: "https://www.instagram.com/tru.ng_ha/",
    icon: IconBrandInstagram,
    type: "SOCIAL",
  },
  {
    name: "GitHub",
    handle: "https://github.com/ta-ke-sh1",
    icon: IconBrandGithub,
    type: "SOURCE_CONTROL",
  },
];

export default function TalkContactsForm() {
  return (
    <Stack className="instrument-form" gap="sm" p="md">
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
            fontFamily: "DotGothic16",
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
          fontFamily: "DotGothic16",
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
            <Paper className="instrument-contact" key={i} p="xs">
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
                          fontFamily: "DotGothic16",
                          color: "var(--folio-text)",
                        }}
                      >
                        {contact.name}
                      </Text>
                    </Group>
                    <Text
                      className="instrument-contact__handle"
                      fz="clamp(8px, 1.2vw, 12px)"
                      style={{
                        fontFamily: "DotGothic16",
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
