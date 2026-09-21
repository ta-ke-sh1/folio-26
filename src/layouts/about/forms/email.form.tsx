// ==========================================
// FORM 2: EMAIL DIRECT FORM (1 BIG TEXTAREA + PREFIX/POSTFIX)

import {
  Stack,
  Badge,
  Group,
  Button,
  Text,
  Box,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { commonInputStyles } from "../../../components/modals/form.types";

// ==========================================
export default function EmailDirectForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">(
    "idle",
  );
  const [senderEmail, setSenderEmail] = useState("");
  const [emailBody, setEmailBody] = useState(
    "I'm reaching out regarding your technical projects and backend engineering setup. Let's connect!",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => {
      setFormStatus("sent");
    }, 2000);
  };

  if (formStatus === "sent") {
    return (
      <Stack align="center" justify="center" py="xl" gap="sm">
        <Badge size="lg" color="orange" variant="filled">
          <Group gap={4}>
            <IconCheck size={14} />
            EMAIL ENCRYPTED & SENT
          </Group>
        </Badge>
        <Text
          fz="xs"
          style={{
            fontFamily: "monospace",
            color: "var(--mantine-color-gray-4)",
          }}
          ta="center"
        >
          Direct email transmitted to inbox target.
        </Text>
        <Button
          size="xs"
          variant="outline"
          color="orange"
          mt="xs"
          onClick={() => setFormStatus("idle")}
        >
          NEW_DISPATCH
        </Button>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xs">
        {/* Decorative ASCII Envelope Graphic */}
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
            {`+------------------------------------------------+
|  /\\   TARGET: dev@terminal.local               |
| /  \\  ENCRYPTION: SHA-256 TLS 1.3              |
+------------------------------------------------+`}
          </Text>
        </Box>

        <TextInput
          required
          type="email"
          label="SENDER_ADDRESS"
          placeholder="your.email@domain.com"
          styles={commonInputStyles}
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.currentTarget.value)}
        />

        {/* Email Form Wrapper with Fixed Prefix & Postfix */}
        <Box
          p="xs"
          style={{
            backgroundColor: "var(--mantine-color-dark-9)",
            border: "1px solid var(--mantine-color-dark-5)",
            borderRadius: "4px",
          }}
        >
          {/* PREFIX */}
          <Text
            fz="11px"
            fw={700}
            style={{ fontFamily: "monospace", color: "#FF7700" }}
          >
            [PREFIX]: DEAR DEVELOPER,
          </Text>

          {/* MAIN EDITABLE EMAIL TEXTAREA */}
          <Textarea
            required
            minRows={5}
            autosize
            maxRows={8}
            placeholder="Type your primary message here..."
            value={emailBody}
            onChange={(e) => setEmailBody(e.currentTarget.value)}
            mt={6}
            mb={6}
            styles={{
              input: {
                backgroundColor: "transparent",
                border: "none",
                color: "#e5e5e5",
                fontFamily: "monospace",
                fontSize: "13px",
                padding: 0,
                "&:focus": {
                  outline: "none",
                },
              },
            }}
          />

          {/* POSTFIX */}
          <Text
            fz="11px"
            fw={700}
            style={{ fontFamily: "monospace", color: "#FF7700" }}
          >
            [POSTFIX]: REGARDS, {senderEmail || "[SENDER_EMAIL]"}
            <br />
            // DISPATCHED VIA WEB_TERMINAL_V2
          </Text>
        </Box>

        <Button
          type="submit"
          size="md"
          color="orange"
          variant="filled"
          loading={formStatus === "sending"}
          rightSection={<IconSend size={18} />}
          mt="xs"
        >
          {formStatus === "sending" ? "Transmitting..." : "Send Direct Mail"}
        </Button>
      </Stack>
    </form>
  );
}
