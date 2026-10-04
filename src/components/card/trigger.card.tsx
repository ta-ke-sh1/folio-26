import { ActionIcon, Image, Stack, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const statusLabel = isOpen
    ? isFocused
      ? "Active"
      : "Open in background"
    : "Closed";

  const animateInteraction = (isActive: boolean) => {
    const button = buttonRef.current;
    if (
      !button ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.to(button, {
      scale: isActive ? 1.06 : 1,
      y: isActive ? -3 : 0,
      duration: isActive ? 0.22 : 0.28,
      ease: isActive ? "back.out(2)" : "power2.out",
      overwrite: "auto",
    });
  };

  const animatePress = () => {
    const button = buttonRef.current;
    if (
      !button ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.to(button, {
      scale: 0.94,
      duration: 0.08,
      ease: "power1.out",
      yoyo: true,
      repeat: 1,
      overwrite: "auto",
    });
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (
      !button ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const restingShadow = isOpen
      ? "0 0 24px rgba(255, 119, 0, 0.28), 10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.2)"
      : "10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.16)";
    const pulseShadow = isOpen
      ? "0 0 34px rgba(255, 190, 120, 0.58), 10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.2)"
      : "0 0 16px rgba(255, 190, 120, 0.42), 10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.16)";
    const pulse = gsap.fromTo(
      button,
      { boxShadow: restingShadow },
      {
        boxShadow: pulseShadow,
        duration: 1.25,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
    );

    return () => {
      pulse.kill();
    };
  }, [isOpen]);

  return (
    <Stack justify="center" align="center" gap={0}>
      <ActionIcon
        ref={buttonRef}
        className={className}
        data-cursor="pointer"
        type="button"
        onClick={() => {
          animatePress();
          onClick();
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") animateInteraction(true);
        }}
        onPointerLeave={() => {
          if (document.activeElement !== buttonRef.current) {
            animateInteraction(false);
          }
        }}
        onFocus={() => animateInteraction(true)}
        onBlur={() => animateInteraction(false)}
        variant="default"
        size={64}
        radius={14}
        aria-label={`${label}, ${category}, ${statusLabel}`}
        style={{
          width,
          height,
          maxWidth,
          flex,
          padding: 10,
          transformOrigin: "center",
          willChange: "transform",
          background: isOpen
            ? "linear-gradient(145deg, rgba(255, 119, 0, 0.22), rgba(255, 255, 255, 0.04))"
            : "linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.025))",
          border: isOpen
            ? "1px solid rgba(255, 190, 120, 0.95)"
            : "1px solid rgba(255, 190, 120, 0.72)",
          backdropFilter: "blur(18px) saturate(135%)",
          WebkitBackdropFilter: "blur(18px) saturate(135%)",
          transition:
            "background 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: isOpen
            ? "0 0 24px rgba(255, 119, 0, 0.28), 10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.2)"
            : "10px 10px 24px rgba(0, 0, 0, 0.32), inset 1px 1px 0 rgba(255, 255, 255, 0.16)",
        }}
      >
        <Stack justify="center" align="center" gap={0}>
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
              size={32}
              aria-hidden="true"
              color={isOpen ? "var(--folio-accent)" : "var(--folio-text)"}
            />
          ) : null}
          <Text
            style={{
              fontSize: 8,
              fontFamily: "monospace",
            }}
          >
            {label}
          </Text>
        </Stack>
      </ActionIcon>
    </Stack>
  );
}
