import { useState, useEffect, useRef } from "react";
import { Image, Text, Box, Group, Badge } from "@mantine/core";
import { shuffleText } from "../../services/utils.service";

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
  className?: string;
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
  className,
}: TriggerCardProps) {
  const [displayCategory, setDisplayCategory] = useState(category);
  const [displayLabel, setDisplayLabel] = useState(label);
  const intervalRef = useRef<any>(null);

  // Sync state if props change externally
  useEffect(() => {
    setDisplayCategory(category);
    setDisplayLabel(label);
  }, [category, label]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    const maxIterations = Math.max(category.length, label.length) * 3;

    intervalRef.current = setInterval(() => {
      setDisplayCategory(shuffleText(category, iteration));
      setDisplayLabel(shuffleText(label, iteration));

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayCategory(category);
        setDisplayLabel(label);
      }

      iteration += 1;
    }, 30);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayCategory(category);
    setDisplayLabel(label);
  };

  return (
    <Box
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width,
        maxWidth,
        flex,
        padding: "14px 18px",
        background: isOpen
          ? "linear-gradient(145deg, rgba(255, 119, 0, 0.18), rgba(255, 255, 255, 0.04))"
          : "linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.025))",
        border: isOpen
          ? "1px solid rgba(255, 119, 0, 0.75)"
          : "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: "16px",
        backdropFilter: "blur(18px) saturate(135%)",
        WebkitBackdropFilter: "blur(18px) saturate(135%)",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isOpen
          ? "0 0 24px rgba(255, 119, 0, 0.28), 10px 10px 24px rgba(0, 0, 0, 0.32), -8px -8px 20px rgba(255, 255, 255, 0.055), inset 1px 1px 0 rgba(255, 255, 255, 0.2), inset -1px -1px 0 rgba(0, 0, 0, 0.18)"
          : "10px 10px 24px rgba(0, 0, 0, 0.32), -8px -8px 20px rgba(255, 255, 255, 0.055), inset 1px 1px 0 rgba(255, 255, 255, 0.16), inset -1px -1px 0 rgba(0, 0, 0, 0.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="md" wrap="nowrap" align="center">
          {/* Desktop Application Icon Box */}
          <Box
            className={className ? `${className}__icon` : undefined}
            style={{
              width: 44,
              height: 44,
              borderRadius: "10px",
              backgroundColor: "var(--folio-surface)",
              border: isOpen
                ? "1px solid var(--folio-accent)"
                : "1px solid var(--folio-card-border)",
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
              <Icon
                size={24}
                color={isOpen ? "var(--folio-accent)" : "var(--folio-text)"}
              />
            ) : null}
          </Box>

          {/* Labels and Metadata */}
          <Box className={className ? `${className}__content` : undefined}>
            <Text
              fz="10px"
              fw={700}
              style={{
                fontFamily: "monospace",
                color: isOpen ? "var(--folio-accent)" : "var(--folio-muted)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {displayCategory}
            </Text>

            <Text
              fw={700}
              fz="sm"
              style={{
                fontFamily: "monospace",
                color: "var(--folio-text)",
                letterSpacing: "-0.3px",
                lineHeight: 1.2,
                marginTop: "2px",
              }}
            >
              {displayLabel}
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
