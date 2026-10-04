import { Text, Paper, Group, ActionIcon, Box } from "@mantine/core";
import { IconGripHorizontal, IconX } from "@tabler/icons-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CollaborationForm from "../../layouts/about/forms/collaboration.form";
import EmailDirectForm from "../../layouts/about/forms/email.form";
import TalkContactsForm from "../../layouts/about/forms/talk.form";
import { maxWidth } from "../../styles/breakpoints";
import { InstrumentModalStyles } from "./instrumentModal.styles";
import { FORM_ID } from "../../layouts/about/about.type";

export interface FormWindowItem {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface DraggableFormWindowProps {
  item: FormWindowItem;
  itemIndex: number;
  zIndex: number;
  isClosing: boolean;
  onClose: () => void;
  onFocus: () => void;
}

export function DraggableFormWindow({
  item,
  itemIndex,
  zIndex,
  isClosing,
  onClose,
  onFocus,
}: DraggableFormWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
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

  const width = 1200;

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

      const maxX = Math.max(
        12,
        window.innerWidth - windowElement.offsetWidth - 12,
      );
      const maxY = Math.max(
        12,
        window.innerHeight - windowElement.offsetHeight - 12,
      );
      const offset = itemIndex * 28;
      const centeredX =
        (window.innerWidth - windowElement.offsetWidth) / 2 + offset;
      const centeredY =
        (window.innerHeight - windowElement.offsetHeight) / 2 + offset;
      setPosition({
        x: Math.min(Math.max(12, centeredX), maxX),
        y: Math.min(Math.max(12, centeredY), maxY),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
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

  return createPortal(
    <>
      <InstrumentModalStyles />
      <Paper
        ref={windowRef}
        className="instrument-window instrument-window--active"
        shadow="xl"
        onMouseDown={onFocus}
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: `clamp(320px, 42vw, ${width}px)`,
          maxWidth: "calc(100vw - 24px)",
          zIndex: zIndex,
          userSelect: isDragging ? "none" : "auto",
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
            <HeaderIcon size={16} color="#FF7700" />
            <Text className="instrument-window__title">{item.title}</Text>
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

        {/* Render Specific Form Component Based On ID */}
        <Box className="instrument-window__body" p={0}>
          {item.id === FORM_ID.CONNECT && <CollaborationForm />}
          {item.id === FORM_ID.SAY_HI && <TalkContactsForm />}
        </Box>
      </Paper>
    </>,
    document.body,
  );
}
