import { useRef } from "react";
import {
  Container,
  Stack,
  Badge,
  Box,
  Card,
  Text,
  AspectRatio,
} from "@mantine/core";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export interface MemoryItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  date?: string;
  link: string;
}

const MEMORIES_DATA: MemoryItem[] = [
  {
    id: "1",
    type: "image",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    title: "System Architecture Lab",
    date: "2025.11",
    link: "/memories/system-architecture",
  },
  {
    id: "2",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    title: "Cinematic Framing & Motion Test",
    date: "2026.02",
    link: "/memories/motion-framing",
  },
  {
    id: "3",
    type: "image",
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    title: "Workspace Co-Pilots",
    date: "2026.04",
    link: "/memories/workspace-companions",
  },
  {
    id: "4",
    type: "image",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    title: "Frontend Interface Deployment",
    date: "2026.06",
    link: "/memories/frontend-deploy",
  },
];

const ROTATIONS = [-3.2, 2.5, -1.8, 3.0, -2.4, 1.9, -3.0, 2.2];

export default function MemoriesSection() {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const marqueeItems = [...MEMORIES_DATA, ...MEMORIES_DATA];

  // GSAP Marquee Loop Setup
  useGSAP(
    () => {
      if (!trackRef.current) return;

      // Animate track to xPercent: -50 for infinite loop
      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 35,
        repeat: -1,
      });
    },
    { scope: trackRef },
  );

  // GSAP Card Hover Handlers
  const handleMouseEnterCard = (e: React.MouseEvent<HTMLDivElement>) => {
    // Pause marquee track movement
    tweenRef.current?.pause();

    // Smoothly straighten, scale up, and elevate card
    gsap.to(e.currentTarget, {
      rotation: 0,
      y: -12,
      scale: 1.04,
      borderColor: "rgba(255, 119, 0, 0.6)",
      boxShadow:
        "0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 119, 0, 0.25)",
      duration: 0.35,
      ease: "power2.out",
      zIndex: 10,
    });
  };

  const handleMouseLeaveCard = (
    e: React.MouseEvent<HTMLDivElement>,
    baseRotation: number,
  ) => {
    // Resume marquee track movement
    tweenRef.current?.play();

    // Restore original rotation and position
    gsap.to(e.currentTarget, {
      rotation: baseRotation,
      y: 0,
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.12)",
      boxShadow: "none",
      duration: 0.35,
      ease: "power2.out",
      zIndex: 1,
    });
  };

  return (
    <Container fluid mt="100px" p={0}>
      <Stack gap={60}>
        {/* Section Header */}
        <Stack gap="md" mt="60px" px="var(--mantine-spacing-md)">
          <Badge
            size="lg"
            variant="dot"
            color="primaryOrange"
            style={{ width: "fit-content" }}
          >
            III. Memories
          </Badge>
        </Stack>

        {/* Marquee Wrapper Container */}
        <Box
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            padding: "40px 0",
          }}
        >
          {/* Edge Gradient Mask */}
          <Box
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              pointerEvents: "none",
              zIndex: 3,
              background:
                "linear-gradient(90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 8%, rgba(10,10,10,0) 92%, rgba(10,10,10,1) 100%)",
            }}
          />

          {/* GSAP Animated Track */}
          <Box
            ref={trackRef}
            style={{
              display: "flex",
              gap: "32px",
              width: "max-content",
              alignItems: "center",
              willChange: "transform",
            }}
          >
            {marqueeItems.map((item, idx) => {
              const baseRotation = ROTATIONS[idx % ROTATIONS.length];

              return (
                <Card
                  key={`${item.id}-${idx}`}
                  onClick={() => navigate(item.link)}
                  onMouseEnter={handleMouseEnterCard}
                  onMouseLeave={(e) => handleMouseLeaveCard(e, baseRotation)}
                  style={{
                    minWidth: "300px",
                    maxWidth: "300px",
                    minHeight: "440px",
                    cursor: "pointer",
                    backgroundColor: "rgba(20, 20, 20, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    flexShrink: 0,
                    transform: `rotate(${baseRotation}deg)`,
                    willChange: "transform, box-shadow",
                  }}
                >
                  <Card.Section>
                    <AspectRatio ratio={4 / 5} style={{ height: "350px" }}>
                      {item.type === "video" ? (
                        <video
                          src={item.src}
                          poster={item.poster}
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </AspectRatio>
                  </Card.Section>

                  <Box p="md">
                    <Text size="xs" c="orange.4" ff="monospace" fw={700} mb={4}>
                      {item.date || "// MEMORY"}
                    </Text>
                    <Text size="sm" c="white" fw={500} lineClamp={1}>
                      {item.title}
                    </Text>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}
