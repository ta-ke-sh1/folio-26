import { useState, useEffect, useRef } from "react";
import {
  Container,
  Stack,
  Badge,
  Grid,
  Text,
  Box,
  Image,
  AspectRatio,
  Group,
} from "@mantine/core";

const STORY_SLIDES = [
  {
    id: "a",
    tag: "I.a // TSDV & CONFIDENTIALITY",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    alt: "System Architecture and Hardware Simulation",
    badgeText: "[ NDA CLASSIFIED ]",
    badgeColor: "orange.4",
    caption:
      "Enterprise simulation frameworks and proprietary codebases remain restricted under active NDA.",
    filter: "brightness(0.7) contrast(1.1)",
    borderColor: "rgba(255, 119, 0, 0.3)",
  },
  {
    id: "b",
    tag: "I.b // VISUAL MEDIA",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    alt: "Camera Lens Photography",
    badgeText: "50MM / FRAMING / MOTION",
    badgeColor: "white",
    caption:
      "Capturing architecture, lighting dynamics, and cinematic framing.",
    filter: "grayscale(0.6) brightness(0.8)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  {
    id: "c",
    tag: "I.c // COMPANIONS (2 CATS)",
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    alt: "Two Cats Workspace Companions",
    badgeText: "FELINE COMPANIONSHIP // 02 CATS",
    badgeColor: "orange.4",
    caption: "Creative studio co-pilots maintaining focus and energy.",
    filter: "brightness(0.85) contrast(1.05)",
    borderColor: "rgba(255, 119, 0, 0.3)",
  },
];

export default function StorySection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const blockRef0 = useRef<HTMLDivElement | null>(null);
  const blockRef1 = useRef<HTMLDivElement | null>(null);
  const blockRef2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const refs = [blockRef0, blockRef1, blockRef2];

    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -30% 0px",
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = refs.findIndex((ref) => ref.current === entry.target);
          if (index !== -1) {
            setActiveSlide(index);
          }
        }
      });
    }, observerOptions);

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const currentVisual = STORY_SLIDES[activeSlide];

  return (
    <Container fluid mt="100px" style={{ overflow: "visible" }}>
      <Stack gap={60}>
        <Badge
          size="lg"
          variant="dot"
          color="primaryOrange"
          style={{ width: "fit-content" }}
        >
          I. Story
        </Badge>

        <Grid align="stretch" gap="xl" style={{ position: "relative" }}>
          {/* ================= LEFT COLUMN: SCROLLABLE TEXT BLOCKS ================= */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap={100} style={{ paddingBottom: "30vh" }}>
              {/* Block I.a */}
              <Box
                ref={blockRef0}
                style={{
                  minHeight: "70vh",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Stack gap="md">
                  <Text size="xs" c="orange.4" ff="monospace" fw={700}>
                    // 01. SIMULATION & ENGINEERING
                  </Text>
                  <Text
                    size="xl"
                    c="white"
                    style={{
                      fontSize: "clamp(28px, 3.5vw, 44px)",
                      lineHeight: "1.2",
                      fontWeight: 300,
                    }}
                  >
                    {`Member at TSDV specializing in simulation engineering and web development. Bridging complex mathematical models with responsive digital interfaces.`.toUpperCase()}
                  </Text>
                </Stack>
              </Box>

              {/* Block I.b */}
              <Box
                ref={blockRef1}
                style={{
                  minHeight: "70vh",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Stack gap="md">
                  <Text size="xs" c="white" ff="monospace" fw={700}>
                    // 02. PHOTOGRAPHY & VISUAL MEDIA
                  </Text>
                  <Text
                    size="xl"
                    c="white"
                    style={{
                      fontSize: "clamp(28px, 3.5vw, 44px)",
                      lineHeight: "1.2",
                      fontWeight: 300,
                    }}
                  >
                    {`Outside software, I capture geometry, perspective, and lighting through photography and videography.`.toUpperCase()}
                  </Text>
                </Stack>
              </Box>

              {/* Block I.c */}
              <Box
                ref={blockRef2}
                style={{
                  minHeight: "70vh",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Stack gap="md">
                  <Text size="xs" c="orange.4" ff="monospace" fw={700}>
                    // 03. COMPANION LIFE
                  </Text>
                  <Text
                    size="xl"
                    c="white"
                    style={{
                      fontSize: "clamp(28px, 3.5vw, 44px)",
                      lineHeight: "1.2",
                      fontWeight: 300,
                    }}
                  >
                    {`Passionate cat lover sharing life with 2 feline companions who keep my workspace creative and grounded.`.toUpperCase()}
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </Grid.Col>

          {/* ================= RIGHT COLUMN: STICKY VISUAL ================= */}
          <Grid.Col span={{ base: 12, md: 6 }} style={{ position: "relative" }}>
            <Box
              style={{
                position: "sticky",
                top: "60px",
                height: "calc(100dvh - 120px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "position",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: `1px solid ${currentVisual.borderColor}`,
                  transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                  boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Tag */}
                <Text
                  size="xs"
                  c="white"
                  ff="monospace"
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 3,
                    background: "rgba(0,0,0,0.85)",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {currentVisual.tag}
                </Text>

                {/* Active Image */}
                <AspectRatio ratio={16 / 10}>
                  <Image
                    key={currentVisual.id}
                    src={currentVisual.src}
                    alt={currentVisual.alt}
                    fallbackSrc="https://placehold.co/1200x750?text=System+Visual"
                    style={{
                      filter: currentVisual.filter,
                      transition: "all 0.5s ease-in-out",
                    }}
                  />
                </AspectRatio>

                {/* Caption Overlay */}
                <Box
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px",
                    background:
                      "linear-gradient(transparent, rgba(0,0,0,0.95))",
                    zIndex: 2,
                  }}
                >
                  <Group justify="space-between" align="flex-end">
                    <Stack gap={4}>
                      <Text
                        size="xs"
                        c={currentVisual.badgeColor}
                        ff="monospace"
                        fw={700}
                      >
                        {currentVisual.badgeText}
                      </Text>
                      <Text size="xs" c="dimmed" style={{ maxWidth: "80%" }}>
                        {currentVisual.caption}
                      </Text>
                    </Stack>

                    <Text size="xs" c="dimmed" ff="monospace">
                      0{activeSlide + 1} / 0{STORY_SLIDES.length}
                    </Text>
                  </Group>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
