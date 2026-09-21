import { Image, Text, Box, Group, Badge } from "@mantine/core";

// --- REUSABLE TRIGGER CARD COMPONENT ---
interface TriggerCardProps {
  category: string;
  label: string;
  icon?: React.ElementType;
  appIconUrl?: string;
  isOpen: boolean;
  isFocused: boolean;
  onClick: () => void;
  width?: string | number;
  maxWidth?: string | number;
  flex?: string;
}

export default function TriggerCard({
  category,
  label,
  icon: Icon,
  appIconUrl,
  isOpen,
  isFocused,
  onClick,
  width,
  maxWidth,
  flex,
}: TriggerCardProps) {
  return (
    <Box
      onClick={onClick}
      style={{
        width,
        maxWidth,
        flex,
        padding: "14px 18px",
        backgroundColor: isOpen ? "#141414" : "#0a0a0a",
        border: isOpen ? "1px solid #FF7700" : "1px solid #262626",
        borderRadius: "16px",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isOpen
          ? "0 0 20px rgba(255, 119, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.5)"
          : "0 2px 8px rgba(0, 0, 0, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="md" wrap="nowrap" align="center">
          {/* Desktop Application Icon Box */}
          <Box
            style={{
              width: 44,
              height: 44,
              borderRadius: "10px",
              backgroundColor: "#171717",
              border: isOpen
                ? "1px solid #FF7700"
                : "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow:
                "0 4px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              flexShrink: 0,
              transition: "transform 0.2s ease",
            }}
          >
            {appIconUrl ? (
              <Image
                src={appIconUrl}
                alt={label}
                w={32}
                h={32}
                fit="contain"
                fallbackSrc="https://cdn-icons-png.flaticon.com/512/565/565547.png"
              />
            ) : Icon ? (
              <Icon size={24} color={isOpen ? "#FF7700" : "#ffffff"} />
            ) : null}
          </Box>

          {/* Labels and Metadata */}
          <Box>
            <Text
              fz="10px"
              fw={700}
              style={{
                fontFamily: "monospace",
                color: isOpen ? "#FF7700" : "#737373",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </Text>

            <Text
              fw={700}
              fz="sm"
              style={{
                fontFamily: "monospace",
                color: "#ffffff",
                letterSpacing: "-0.3px",
                lineHeight: 1.2,
                marginTop: "2px",
              }}
            >
              {label}
            </Text>

            <Badge
              ff="monospace"
              fz="xs"
              variant="dot"
              style={{
                "--badge-dot-color": isOpen
                  ? isFocused
                    ? "green"
                    : "orange"
                  : "red",
                marginTop: "3px",
              }}
            >
              {isOpen ? (isFocused ? "Active" : "Background") : "Closed"}
            </Badge>
          </Box>
        </Group>
      </Group>
    </Box>
  );
}
