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
import { useState, useRef, useEffect } from "react";

export interface InteractiveItem {
  id: string;
  label: string;
  category: string;
  icon: React.ElementType;
  appIconUrl?: string;
  tag: string;
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
  onClose: () => void;
  onFocus: () => void;
}

export function DraggableWindow({
  item,
  itemIndex,
  zIndex,
  onClose,
  onFocus,
}: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Stagger window position on initial mount based on module index
  useEffect(() => {
    const offset = itemIndex * 28;
    const defaultX = Math.max(20, window.innerWidth / 2 - 250 + offset);
    const defaultY = Math.max(80, window.innerHeight / 2 - 220 + offset);
    setPosition({ x: defaultX, y: defaultY });
  }, [itemIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus(); // Focus window on header drag start
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
      setPosition({
        x: Math.max(10, dragRef.current.initialX + dx),
        y: Math.max(10, dragRef.current.initialY + dy),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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

  return (
    <>
      <style>{`
        @keyframes windowEntrance {
          0% {
            opacity: 0;
            transform: scale(0.94) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      <Paper
        shadow="xl"
        onMouseDown={onFocus}
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: "clamp(320px, 90vw, 520px)",
          backgroundColor: "#0d0d0d",
          border: "1px solid #FF7700",
          boxShadow:
            "0 0 30px rgba(255, 119, 0, 0.25), 0 10px 40px rgba(0,0,0,0.8)",
          borderRadius: "8px",
          zIndex: zIndex,
          overflow: "hidden",
          userSelect: isDragging ? "none" : "auto",
          animation:
            "windowEntrance 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          willChange: "transform, opacity",
        }}
      >
        {/* Draggable Title Bar */}
        <Group
          justify="space-between"
          px="md"
          py="xs"
          onMouseDown={handleMouseDown}
          style={{
            backgroundColor: "#171717",
            borderBottom: "1px solid #262626",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <Group gap="xs">
            <IconTerminal size={16} color="#FF7700" />
            <Text
              fz="xs"
              fw={700}
              style={{
                fontFamily: "monospace",
                color: "#e5e5e5",
                letterSpacing: "1px",
              }}
            >
              // WIN_{item.id.toUpperCase()}.EXE
            </Text>
          </Group>

          <Group gap="xs">
            <IconGripHorizontal size={16} color="#525252" />
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              onClick={onClose}
              aria-label="Close window"
              style={{
                "&:hover": {
                  backgroundColor: "#FF7700",
                  color: "#000",
                },
              }}
            >
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Window Body Content */}
        <Stack p="md" gap="md">
          {/* Header Badge & Title */}
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Group gap="xs">
                <ItemIcon size={20} color="#FF7700" />
                <Text
                  fz="xl"
                  fw={800}
                  style={{
                    fontFamily: "monospace",
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {item.content.title}
                </Text>
              </Group>
              <Text
                fz="xs"
                style={{ color: "#a3a3a3", fontFamily: "monospace" }}
              >
                {item.content.subtitle}
              </Text>
            </Stack>
            <Badge
              variant="outline"
              color="orange"
              size="xs"
              style={{ fontFamily: "monospace" }}
            >
              {item.tag}
            </Badge>
          </Group>

          <Text fz="sm" style={{ color: "#d4d4d4", lineHeight: "1.5" }}>
            {item.content.description}
          </Text>

          {/* Highlights List */}
          <Box
            p="xs"
            style={{
              backgroundColor: "#141414",
              borderLeft: "2px solid #FF7700",
              borderRadius: "0 4px 4px 0",
            }}
          >
            <Text
              fz="xs"
              fw={700}
              mb={6}
              style={{ fontFamily: "monospace", color: "#FF7700" }}
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
                  <Text fz="xs" style={{ color: "#a3a3a3" }}>
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
                  span={4}
                  key={i}
                  p="xs"
                  style={{
                    backgroundColor: "#050505",
                    border: "1px solid #262626",
                    borderRadius: "4px",
                  }}
                >
                  <Text
                    fz="9px"
                    style={{ fontFamily: "monospace", color: "#737373" }}
                  >
                    {d.key}
                  </Text>
                  <Text
                    fz="11px"
                    fw={700}
                    style={{ fontFamily: "monospace", color: "#e5e5e5" }}
                  >
                    {d.val}
                  </Text>
                </Grid.Col>
              ))}
            </Grid>
          )}

          <Group justify="flex-end" pt="xs">
            <Badge
              size="sm"
              variant="filled"
              color="orange"
              onClick={onClose}
              style={{ cursor: "pointer", fontFamily: "monospace" }}
            >
              CLOSE_WINDOW [ESC]
            </Badge>
          </Group>
        </Stack>
      </Paper>
    </>
  );
}
