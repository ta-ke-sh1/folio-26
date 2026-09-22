// ==========================================
// FORM 1: COLLABORATION FORM

import {
  Stack,
  Badge,
  Group,
  Button,
  Box,
  TextInput,
  Text,
  Select,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { commonInputStyles } from "../../../components/modals/form.types";

// ==========================================
export default function CollaborationForm() {
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

  if (formStatus === "sent") {
    return (
      <Stack className="instrument-form instrument-form__success" align="center" justify="center" py="xl" gap="sm">
        <Badge size="lg" color="orange" variant="filled">
          <Group gap={4}>
            <IconCheck size={14} />
            COLLABORATION PROPOSAL SENT
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
          Proposal received. Pipeline review scheduled.
        </Text>
        <Button
          size="xs"
          variant="outline"
          color="orange"
          mt="xs"
          onClick={() => setFormStatus("idle")}
        >
          RESET_FORM
        </Button>
      </Stack>
    );
  }

  return (
    <form className="instrument-form" onSubmit={handleSubmit}>
      <Stack gap="sm">
        {/* Decorative ASCII Banner */}
        <Box
          className="instrument-form__beacon"
          p="xs"
          style={{
            borderLeft: "3px solid #FF7700",
          }}
        >
          <Text
            component="pre"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              lineHeight: 1.1,
              color: "#FF7700",
              margin: 0,
            }}
          >
            {`[NODE_A] =====( API PIPELINE )=====> [NODE_B]
   ||                                    ||
[DATABASE] <======( SECURE SYNC )====== [WORKER]`}
          </Text>
        </Box>

        <TextInput
          required
          label="ORIGIN // NAME"
          placeholder="e.g. Alex Mercer"
          styles={commonInputStyles}
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.currentTarget.value })
          }
        />

        <TextInput
          required
          type="email"
          label="RETURN_ADDRESS // EMAIL"
          placeholder="alex@company.com"
          styles={commonInputStyles}
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.currentTarget.value })
          }
        />

        <Select
          label="PAYLOAD // TYPE"
          styles={commonInputStyles}
          data={[
            "Backend Systems Design",
            "Simulation Engine Core",
            "Consulting & Code Review",
            "General Inquiry",
          ]}
          value={formData.subject}
          onChange={(val) => setFormData({ ...formData, subject: val || "" })}
        />

        <Textarea
          required
          label="SPECIFICATION // MESSAGE"
          placeholder="Detail your system requirements or technical inquiry..."
          minRows={3}
          styles={commonInputStyles}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.currentTarget.value })
          }
        />

        <Button
          className="instrument-form__submit"
          type="submit"
          size="md"
          color="orange"
          variant="filled"
          loading={formStatus === "sending"}
          rightSection={<IconSend size={18} />}
          mt="xs"
        >
          {formStatus === "sending"
            ? "Transmitting Proposal..."
            : "Dispatch Proposal"}
        </Button>
      </Stack>
    </form>
  );
}
