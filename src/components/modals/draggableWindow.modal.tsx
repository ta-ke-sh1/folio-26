import {
  Text,
  Paper,
  Group,
  ActionIcon,
  Stack,
  Badge,
  Box,
  Grid,
} from "@mantine/core";
import {
  IconTerminal,
  IconGripHorizontal,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { maxWidth } from "../../styles/breakpoints";
import { EditorialFileModal } from "./editorialFile.modal";
import { InstrumentModalStyles } from "./instrumentModal.styles";

export interface InteractiveItem {
  id: string;
  windowWidth?: CSSProperties["width"];
  windowHeight?: CSSProperties["height"];
  label: string;
  category: string;
  icon: React.ElementType;
  appIconUrl?: string;
  tag: string;
  photo?: {
    src: string;
    alt: string;
    caption: string;
  };
  content: {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    details?: { key: string; val: string }[];
  };
}

// --- DRAGGABLE WINDOW COMPONENT ---
interface DraggableWindowProps {
  item: InteractiveItem;
  itemIndex: number;
  zIndex: number;
  isClosing: boolean;
  onClose: () => void;
  onFocus: () => void;
  children?: ReactNode;
}

export function DraggableWindow({
  item,
  itemIndex,
  zIndex,
  isClosing,
  onClose,
  onFocus,
  children,
}: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  useGSAP(
    () => {
      if (!windowRef.current) return;
      if (isClosing) {
        gsap.to(windowRef.current, {
          autoAlpha: 0,
          scale: 0.94,
          y: 18,
          duration: 0.24,
          ease: "power2.in",
          overwrite: "auto",
        });
        return;
      }

      gsap.fromTo(
        windowRef.current,
        { autoAlpha: 0, scale: 0.92, y: 18 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.42,
          ease: "back.out(1.35)",
          clearProps: "transform,opacity,visibility",
        },
      );
    },
    { scope: windowRef, dependencies: [isClosing] },
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(maxWidth("sm"));
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  useLayoutEffect(() => {
    const updatePosition = () => {
      const windowElement = windowRef.current;
      if (!windowElement) return;

      const maxX = Math.max(12, window.innerWidth - windowElement.offsetWidth - 12);
      const maxY = Math.max(12, window.innerHeight - windowElement.offsetHeight - 12);
      const offset = itemIndex * 28;
      const centeredX = (window.innerWidth - windowElement.offsetWidth) / 2 + offset;
      const centeredY = (window.innerHeight - windowElement.offsetHeight) / 2 + offset;
      setPosition({
        x: Math.min(Math.max(12, centeredX), maxX),
        y: Math.min(Math.max(12, centeredY), maxY),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [itemIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (isMobile) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const windowElement = windowRef.current;
      if (!windowElement) return;
      const maxX = Math.max(0, window.innerWidth - windowElement.offsetWidth);
      const maxY = Math.max(0, window.innerHeight - windowElement.offsetHeight);
      setPosition({
        x: Math.min(Math.max(0, dragRef.current.initialX + dx), maxX),
        y: Math.min(Math.max(0, dragRef.current.initialY + dy), maxY),
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const ItemIcon = item.icon;

  return createPortal(
    <>
      <InstrumentModalStyles />
    <div
      ref={windowRef}
      className="instrument-window-frame"
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: item.windowWidth ?? "clamp(320px, 76vw, 520px)",
        height: item.windowHeight,
        maxHeight: item.windowHeight ?? undefined,
        maxWidth: "calc(100vw - 24px)",
        zIndex,
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      <Paper
        className={`instrument-window instrument-window--active${item.id === "footer" ? " instrument-window--footer" : ""}${item.photo ? " instrument-window--archive" : ""}`}
        shadow="xl"
        onMouseDown={onFocus}
        style={{
          height: item.windowHeight ? "100%" : undefined,
          minHeight: item.windowHeight ? 0 : undefined,
        }}
      >
        {/* Draggable Title Bar */}
        <Group
          className="instrument-window__titlebar"
          data-cursor={isDragging ? "grabbing" : "grab"}
          justify="space-between"
          px="md"
          onMouseDown={handleMouseDown}
        >
          <Group gap="xs">
            <span className="instrument-window__signal" />
            <IconTerminal size={16} color="#FF7700" />
            <Text className="instrument-window__title">
              // WIN_{item.id.toUpperCase()}.EXE
            </Text>
          </Group>

          <Group gap="xs">
            <IconGripHorizontal size={16} color="#525252" />
            <ActionIcon
              className="instrument-window__close"
              size="sm"
              variant="subtle"
              color="gray"
              onClick={onClose}
              aria-label="Close window"
            >
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Group>

        <div className="instrument-window__ruler" aria-hidden="true" />

        {/* Window Body Content */}
        <Stack
          className="instrument-window__body"
          p={item.photo || item.id === "story" || item.id === "techonology" ? 0 : "md"}
          gap={item.photo ? 0 : "md"}
          data-lenis-prevent={item.id === "story" ? "" : undefined}
          style={item.id === "story" || item.id === "techonology" ? {
            flex: "1 1 auto",
            minHeight: 0,
            overflowX: "hidden",
            overflowY: "auto",
            overscrollBehavior: "contain",
          } : undefined}
        >
          {item.photo ? (
            <EditorialFileModal item={item} />
          ) : children ?? (
            <>
          {/* Header Badge & Title */}
          <Group
            className="instrument-detail__heading"
            justify="space-between"
            align="flex-start"
          >
            <Stack gap={2}>
              <Group gap="xs">
                <ItemIcon size={20} color="#FF7700" />
                <Text
                  fz="xl"
                  fw={800}
                  style={{
                    fontFamily: "DotGothic16",
                    color: "var(--folio-text)",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {item.content.title}
                </Text>
              </Group>
              <Text
                fz="xs"
                style={{ color: "var(--folio-muted)", fontFamily: "DotGothic16" }}
              >
                {item.content.subtitle}
              </Text>
            </Stack>
            <Badge
              variant="outline"
              color="orange"
              size="xs"
              style={{ fontFamily: "DotGothic16" }}
            >
              {item.tag}
            </Badge>
          </Group>

          <Text className="instrument-detail__description" fz="sm">
            {item.content.description}
          </Text>
          {/* Highlights List */}
          <Box
            className="instrument-detail__features"
            p="xs"
            style={{
              borderLeft: "2px solid #FF7700",
            }}
          >
            <Text
              fz="xs"
              fw={700}
              mb={6}
              style={{ fontFamily: "DotGothic16", color: "#FF7700" }}
            >
              // KEY_FEATURES
            </Text>
            <Stack gap={4}>
              {item.content.highlights.map((h, idx) => (
                <Group key={idx} gap="xs" wrap="nowrap" align="flex-start">
                  <IconCheck
                    size={14}
                    color="#FF7700"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <Text fz="xs" style={{ color: "var(--folio-muted)" }}>
                    {h}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Box>

          {/* System Metadata Table */}
          {item.content.details && (
            <Grid gap="xs">
              {item.content.details.map((d, i) => (
                <Grid.Col
                  className="instrument-detail__datum"
                  span={4}
                  key={i}
                  p="xs"
                  style={{}}
                >
                  <Text
                    fz="9px"
                    style={{
                      fontFamily: "DotGothic16",
                      color: "var(--folio-muted)",
                    }}
                  >
                    {d.key}
                  </Text>
                  <Text
                    fz="11px"
                    fw={700}
                    style={{
                      fontFamily: "DotGothic16",
                      color: "var(--folio-text)",
                    }}
                  >
                    {d.val}
                  </Text>
                </Grid.Col>
              ))}
            </Grid>
          )}

          <Group
            className="instrument-detail__footer"
            justify="flex-end"
            pt="xs"
          >
            <Badge
              size="sm"
              variant="filled"
              color="orange"
              data-cursor="pointer"
              onClick={onClose}
              style={{ fontFamily: "DotGothic16" }}
            >
              CLOSE_WINDOW [ESC]
            </Badge>
          </Group>
            </>
          )}
        </Stack>
      </Paper>
    </div>
    </>,
    document.body,
  );
}
