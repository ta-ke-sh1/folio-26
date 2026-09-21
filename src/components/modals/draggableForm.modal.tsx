import { Text, Paper, Group, ActionIcon, Box } from "@mantine/core";
import { IconGripHorizontal, IconX } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import CollaborationForm from "../../layouts/about/forms/collaboration.form";
import EmailDirectForm from "../../layouts/about/forms/email.form";
import TalkContactsForm from "../../layouts/about/forms/talk.form";

export interface FormWindowItem {
  id: "collaboration" | "say-hi" | "email-me";
  title: string;
  icon: React.ElementType;
}

interface DraggableFormWindowProps {
  item: FormWindowItem;
  itemIndex: number;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
}

export function DraggableFormWindow({
  item,
  itemIndex,
  zIndex,
  onClose,
  onFocus,
}: DraggableFormWindowProps) {
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

  const width = 800;

  // Calculate random initial position constrained to viewport bounds on mount
  useEffect(() => {
    const padding = 20;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Computed rendered width accounting for CSS clamp(320px, 90vw, 800px)
    const computedWidth = Math.min(Math.max(320, windowWidth * 0.9), width);
    const estimatedHeight = 520; // Estimated height of form window

    // Available bounds inside screen padding
    const maxX = Math.max(padding, windowWidth - computedWidth - padding);
    const maxY = Math.max(padding, windowHeight - estimatedHeight - padding);

    const randomX = Math.floor(
      padding + Math.random() * Math.max(1, maxX - padding),
    );
    const randomY = Math.floor(
      padding + Math.random() * Math.max(1, maxY - padding),
    );

    setPosition({ x: randomX, y: randomY });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
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

  const HeaderIcon = item.icon;

  return (
    <Paper
      shadow="xl"
      onMouseDown={onFocus}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: `clamp(320px, 90vw, ${width}px)`,
        backgroundColor: "#0d0d0d",
        border: "1px solid #FF7700",
        boxShadow:
          "0 0 25px rgba(255, 119, 0, 0.25), 0 10px 40px rgba(0,0,0,0.85)",
        borderRadius: "8px",
        zIndex: zIndex,
        overflow: "hidden",
        userSelect: isDragging ? "none" : "auto",
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
          <HeaderIcon size={16} color="#FF7700" />
          <Text
            fz="xs"
            fw={700}
            style={{
              fontFamily: "monospace",
              color: "#e5e5e5",
              letterSpacing: "1px",
            }}
          >
            {item.title}
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
          >
            <IconX size={14} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Render Specific Form Component Based On ID */}
      <Box p="md">
        {item.id === "collaboration" && <CollaborationForm />}
        {item.id === "say-hi" && <TalkContactsForm />}
        {item.id === "email-me" && <EmailDirectForm />}
      </Box>
    </Paper>
  );
}
