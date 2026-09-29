// ==========================================
// FORM 2: EMAIL DIRECT FORM (1 BIG TEXTAREA + PREFIX/POSTFIX)

import {
  Stack,
  Badge,
  Group,
  Text,
  Box,
  TextInput,
  Textarea,
} from "@mantine/core";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { commonInputStyles } from "../../../components/modals/form.types";

// ==========================================
export default function EmailDirectForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "draft-ready">("idle");
  const [senderEmail, setSenderEmail] = useState("");
  const [emailBody, setEmailBody] = useState(
    "I'm reaching out regarding your technical projects and backend engineering setup. Let's connect!",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = "trunght.yrc@gmail.com";
    const subject = `Portfolio contact from ${senderEmail}`;
    const body = `DEAR DEVELOPER,\n\n${emailBody}\n\nREGARDS, ${senderEmail}\n\nDISPATCHED VIA WEB_TERMINAL_V2`;

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setFormStatus("draft-ready");
  };

  if (formStatus === "draft-ready") {
    return (
      <Stack m={"md"} className="instrument-form instrument-form__success" align="center" justify="center" py="xl" gap="sm">
        <Badge size="lg" color="orange" variant="filled">
          <Group gap={4}>
            <IconSend size={14} />
            EMAIL DRAFT READY
          </Group>
        </Badge>
        <Text
          fz="xs"
          style={{
            fontFamily: "DotGothic16",
            color: "var(--mantine-color-gray-4)",
          }}
          ta="center"
        >
          Your mail app should open with the message addressed to trunght.yrc@gmail.com. Review and send it there.
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
    <form className="instrument-form" onSubmit={handleSubmit}>
      <Stack gap="xs" p="md">
        {/* Decorative ASCII Envelope Graphic */}
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
            {`+------------------------------------------------+
|  /\\   TARGET: trunght.yrc@gmail.com            |
| /  \\  ACTION: SEND FROM YOUR MAIL APP          |
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
          className="instrument-form__message-shell"
          p="xs"
          style={{
          }}
        >
          {/* PREFIX */}
          <Text
            className="instrument-form__protocol"
            fz="11px"
            fw={700}
            style={{ fontFamily: "DotGothic16", color: "#FF7700" }}
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
                color: "var(--folio-text)",
                fontFamily: "DotGothic16",
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
            className="instrument-form__protocol"
            fz="11px"
            fw={700}
            style={{ fontFamily: "DotGothic16", color: "#FF7700" }}
          >
            [POSTFIX]: REGARDS, {senderEmail || "[SENDER_EMAIL]"}
            <br />
            // DISPATCHED VIA WEB_TERMINAL_V2
          </Text>
        </Box>

        <Button
          className="instrument-form__submit"
          type="submit"
          size="md"
          color="orange"
          variant="filled"
          rightSection={<IconSend size={18} />}
          mt="xs"
        >
          Send Direct Mail
        </Button>
      </Stack>
    </form>
  );
}
