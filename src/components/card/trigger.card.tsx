import { ActionIcon, Image, Tooltip } from "@mantine/core";
import type { CSSProperties } from "react";

// --- REUSABLE TRIGGER CARD COMPONENT ---
interface TriggerCardProps {
  category: string;
  label: string;
  icon?: React.ElementType;
  appIconUrl?: string;
  isOpen: boolean;
  isFocused: boolean;
  onClick: () => void;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  maxWidth?: CSSProperties["maxWidth"];
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
  height,
  maxWidth,
  flex,
  className,
}: TriggerCardProps) {
  const statusLabel = isOpen
    ? isFocused
      ? "Active"
      : "Open in background"
    : "Closed";

  return (
    <Tooltip label={`Click to [${label}]`} withArrow>
      <ActionIcon
        className={className}
        data-cursor="pointer"
        type="button"
        onClick={onClick}
        variant="default"
        size={56}
        radius={14}
        aria-label={`${label}, ${category}, ${statusLabel}`}
        style={{
          width,
          height,
          maxWidth,
          flex,
          padding: 10,
          background: isOpen
            ? "linear-gradient(145deg, rgba(255, 119, 0, 0.22), rgba(255, 255, 255, 0.04))"
            : "linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.025))",
          border: isOpen
            ? "1px solid rgba(255, 119, 0, 0.75)"
            : "1px solid rgba(255, 255, 255, 0.16)",
          backdropFilter: "blur(18px) saturate(135%)",
          WebkitBackdropFilter: "blur(18px) saturate(135%)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: isOpen
            ? "0 0 24px rgba(255, 119, 0, 0.28), 10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.2)"
            : "10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.16)",
        }}
      >
        {appIconUrl ? (
          <Image
            src={appIconUrl}
            alt=""
            aria-hidden="true"
            w={32}
            h={32}
            fit="contain"
            fallbackSrc="https://cdn-icons-png.flaticon.com/512/565/565547.png"
          />
        ) : Icon ? (
          <Icon
            size={26}
            aria-hidden="true"
            color={isOpen ? "var(--folio-accent)" : "var(--folio-text)"}
          />
        ) : null}
      </ActionIcon>
    </Tooltip>
  );
}
