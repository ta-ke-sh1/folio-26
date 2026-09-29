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
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./draggableWindow.modal.scss";

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
  containerRef: React.RefObject<HTMLDivElement | null>;
  isClosing: boolean;
  onClose: () => void;
  onFocus: () => void;
  children?: ReactNode;
}

function PolaroidStack({
  item,
  className,
  stageRef,
  style,
}: {
  item: InteractiveItem;
  className: string;
  stageRef?: React.Ref<HTMLDivElement>;
  style?: CSSProperties;
}) {
  if (!item.photo) return null;

  return (
    <div
      ref={stageRef}
      className={`instrument-detail__photo-stage ${className}`}
      style={style}
      role="group"
      aria-label={`Photo: ${item.photo.alt}`}
    >
      <div
        className="instrument-detail__postcard instrument-detail__postcard--back instrument-detail__postcard--back-one"
        aria-hidden="true"
      />
      <div
        className="instrument-detail__postcard instrument-detail__postcard--back instrument-detail__postcard--back-two"
        aria-hidden="true"
      />
      <figure className="instrument-detail__postcard instrument-detail__polaroid">
        <img src={item.photo.src} alt={item.photo.alt} />
        <figcaption>{item.photo.caption}</figcaption>
      </figure>
      <span className="instrument-detail__photo-hint" aria-hidden="true">
        HOVER TO REVEAL PHOTO
      </span>
    </div>
  );
}

export function DraggableWindow({
  item,
  itemIndex,
  zIndex,
  containerRef,
  isClosing,
  onClose,
  onFocus,
  children,
}: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const photoStageRef = useRef<HTMLDivElement>(null);
  const photoRevealedRef = useRef(false);
  const fanResetTweenRef = useRef<gsap.core.Tween | null>(null);
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
    const mediaQuery = window.matchMedia("(max-width: 48em)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      const container = containerRef.current;
      const windowElement = windowRef.current;
      if (!container || !windowElement) return;

      const maxX = Math.max(
        0,
        container.clientWidth - windowElement.offsetWidth,
      );
      const maxY = Math.max(
        0,
        container.clientHeight - windowElement.offsetHeight,
      );
      const offset = itemIndex * 28;
      const centeredX =
        (container.clientWidth - windowElement.offsetWidth) / 2 + offset;
      const centeredY =
        (container.clientHeight - windowElement.offsetHeight) / 2 + offset;
      setPosition({
        x: Math.min(Math.max(12, centeredX), maxX),
        y: Math.min(Math.max(12, centeredY), maxY),
      });
    };

    const frame = requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(frame);
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
      const container = containerRef.current;
      const windowElement = windowRef.current;
      if (!container || !windowElement) return;
      const maxX = Math.max(
        0,
        container.clientWidth - windowElement.offsetWidth,
      );
      const maxY = Math.max(
        0,
        container.clientHeight - windowElement.offsetHeight,
      );
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

  const ItemIcon = item.icon;

  useEffect(
    () => () => {
      fanResetTweenRef.current?.kill();
    },
    [],
  );

  const setPhotoRevealed = (isRevealed: boolean) => {
    const stage = photoStageRef.current;
    if (
      !stage ||
      isMobile ||
      !item.photo ||
      photoRevealedRef.current === isRevealed
    ) {
      return;
    }
    photoRevealedRef.current = isRevealed;
    stage.classList.toggle("is-revealed", isRevealed);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const fanCards = [
      {
        selector: ".instrument-detail__postcard--back-one",
        revealed: { x: 80, xPercent: 0, rotation: -11 },
        parked: { x: 0, xPercent: -28, rotation: -12 },
      },
      {
        selector: ".instrument-detail__postcard--back-two",
        revealed: { x: 60, xPercent: 0, rotation: 19 },
        parked: { x: 0, xPercent: -15, rotation: 10 },
      },
      {
        selector: ".instrument-detail__polaroid",
        revealed: { x: 70, xPercent: 0, rotation: 8 },
        parked: { x: 0, xPercent: -22, rotation: -5 },
      },
    ];

    if (isRevealed) {
      // Cancel any pending reset if the pointer re-enters while the stack is leaving.
      fanResetTweenRef.current?.kill();

      // GSAP targets each postcard separately to fan it open as the stage enters.
      fanCards.forEach(({ selector, revealed }) => {
        const card = stage.querySelector<HTMLElement>(selector);
        if (!card) return;

        gsap.to(card, {
          ...revealed,
          duration: reduceMotion ? 0 : 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
      });

      // MOUSE OVER: move from beyond the viewport's left edge to its fixed anchor.
      stage.style.transition = "none";
      stage.style.translate = "calc(-100% - 16px) 0px";
      stage.getBoundingClientRect();
      stage.style.transition = reduceMotion
        ? "none"
        : "translate 720ms cubic-bezier(0.16, 1, 0.3, 1)";
      stage.style.translate = "0px 0px";
      return;
    }

    // MOUSE OUT: slide back beyond the viewport's left edge, not relative to the modal.
    stage.style.transition = reduceMotion
      ? "none"
      : "translate 420ms cubic-bezier(0.65, 0, 0.35, 1)";
    stage.style.translate = "calc(-100% - 200px) 0px";

    // Keep the cards still while the whole stack exits, then silently reset them offscreen.
    fanResetTweenRef.current?.kill();
    fanResetTweenRef.current = gsap.delayedCall(reduceMotion ? 0 : 0.42, () => {
      fanCards.forEach(({ selector, parked }) => {
        const card = stage.querySelector<HTMLElement>(selector);
        if (card) gsap.set(card, parked);
      });
    });
  };

  return (
    <>
    {/* Pointer enter/exit triggers the reveal/park animation; focus/blur is its keyboard equivalent. */}
    <div
      ref={windowRef}
      className="instrument-window-frame"
      onMouseEnter={() => setPhotoRevealed(true)}
      onMouseLeave={() => setPhotoRevealed(false)}
      onFocusCapture={() => setPhotoRevealed(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPhotoRevealed(false);
        }
      }}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: item.windowWidth ?? "clamp(320px, 76vw, 520px)",
        height: item.windowHeight,
        maxHeight: item.windowHeight ?? undefined,
        maxWidth: item.id === "story" ? "calc(100% - 24px)" : undefined,
        zIndex,
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      <Paper
        className={`instrument-window instrument-window--active${item.id === "footer" ? " instrument-window--footer" : ""}`}
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
          justify="space-between"
          px="md"
          onMouseDown={handleMouseDown}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
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

        <div className="instrument-window__ruler" aria-hidden="true" />

        {/* Window Body Content */}
        <Stack
          className="instrument-window__body"
          p={item.id === "story" || item.id === "techonology" ? 0 : "md"}
          gap="md"
          data-lenis-prevent={item.id === "story" ? "" : undefined}
          style={item.id === "story" || item.id === "techonology" ? {
            flex: "1 1 auto",
            minHeight: 0,
            overflowX: "hidden",
            overflowY: "auto",
            overscrollBehavior: "contain",
          } : undefined}
        >
          {children ?? (
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
          <PolaroidStack
            item={item}
            className="instrument-detail__photo-stage--mobile"
          />

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
              onClick={onClose}
              style={{ cursor: "pointer", fontFamily: "DotGothic16" }}
            >
              CLOSE_WINDOW [ESC]
            </Badge>
          </Group>
            </>
          )}
        </Stack>
      </Paper>
    </div>

    {item.photo && createPortal(
      <PolaroidStack
        item={item}
        className="instrument-detail__photo-stage--desktop"
        stageRef={photoStageRef}
        style={{ zIndex: zIndex + 1, position: 'fixed' }}
      />,
      document.body,
    )}
    </>
  );
}
