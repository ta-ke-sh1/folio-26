import { useRef } from "react";
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

export default function StorySection() {
  const storyTextRef = useRef<HTMLDivElement | null>(null);
  const catTextRef = useRef<HTMLDivElement | null>(null);

  return (
    <Container fluid mt="100px">
      <Stack gap={60}>
        {/* Section Header */}
        <Stack gap="md" mt="60px">
          <Badge
            size="lg"
            variant="dot"
            color="primaryOrange"
            style={{ width: "fit-content" }}
          >
            I. Story
          </Badge>

          <Grid align="stretch" gap="xl">
            {/* --- Block I.a: TSDV & Simulation (Text Left, Visual Right) --- */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <div ref={storyTextRef}>
                <Text
                  size="xl"
                  c="white"
                  style={{
                    fontSize: 48,
                    maxWidth: "50dvw",
                    lineHeight: "52px",
                    fontWeight: 300,
                  }}
                >
                  {`Member at TSDV specializing in simulation engineering and web development. Bridging complex mathematical models with responsive digital interfaces.`.toUpperCase()}
                </Text>
              </div>
            </Grid.Col>

            {/* Visual Frame 1: Simulation / Tech Graphic with Hover Glow */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 119, 0, 0.3)",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#FF7700",
                    transform: "scale(1.01)",
                    boxShadow: "0 0 25px rgba(255, 119, 0, 0.25)",
                  },
                }}
              >
                <Text
                  size="xs"
                  c="white"
                  ff="monospace"
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 3,
                    background: "rgba(0,0,0,0.75)",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  I.a // TSDV & CONFIDENTIALITY
                </Text>

                <AspectRatio ratio={16 / 9}>
                  <Image
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                    alt="System Architecture and Hardware Simulation"
                    fallbackSrc="https://placehold.co/1200x675?text=System+Simulation"
                    style={{
                      filter: "brightness(0.7) contrast(1.1)",
                      transition: "filter 0.4s ease, transform 0.6s ease",
                    }}
                  />
                </AspectRatio>

                <Box
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
                    zIndex: 2,
                  }}
                >
                  <Text size="xs" c="orange.4" ff="monospace" fw={700}>
                    [ NDA CLASSIFIED ]
                  </Text>
                  <Text size="xs" c="dimmed">
                    Enterprise simulation frameworks and proprietary codebases
                    remain restricted under active NDA.
                  </Text>
                </Box>
              </Box>
            </Grid.Col>

            {/* --- Block I.b: Photography & Videography (Image Left, Text Right) --- */}
            <Grid.Col span={{ base: 12, md: 6 }} mt="xl">
              <Box
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    transform: "scale(1.01)",
                  },
                }}
              >
                <Text
                  size="xs"
                  c="white"
                  ff="monospace"
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 3,
                    background: "rgba(0,0,0,0.75)",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  I.b // VISUAL MEDIA
                </Text>

                <AspectRatio ratio={16 / 9}>
                  <Image
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
                    alt="Camera Lens Photography"
                    fallbackSrc="https://placehold.co/1200x675?text=Photography"
                    style={{
                      filter: "grayscale(0.6) brightness(0.8)",
                      transition: "filter 0.4s ease, transform 0.6s ease",
                    }}
                  />
                </AspectRatio>

                <Group
                  gap="xs"
                  style={{
                    position: "absolute",
                    bottom: 14,
                    right: 14,
                    zIndex: 2,
                    background: "rgba(0,0,0,0.7)",
                    padding: "6px 12px",
                    borderRadius: "20px",
                  }}
                >
                  <Text size="xs" c="white" ff="monospace">
                    50MM / FRAMING / MOTION
                  </Text>
                </Group>
              </Box>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }} mt="xl">
              <Text
                size="xl"
                c="white"
                style={{
                  fontSize: 48,
                  maxWidth: "50dvw",
                  lineHeight: "52px",
                  fontWeight: 300,
                }}
              >
                {`Outside software, I capture geometry, perspective, and lighting through photography and videography.`.toUpperCase()}
              </Text>
            </Grid.Col>

            {/* --- Block I.c: Companion Life / Cat Person (Text Left, Image Right) --- */}
            <Grid.Col span={{ base: 12, md: 6 }} mt="xl">
              <div ref={catTextRef}>
                <Text
                  size="xl"
                  c="white"
                  style={{
                    fontSize: 48,
                    maxWidth: "50dvw",
                    lineHeight: "52px",
                    fontWeight: 300,
                  }}
                >
                  {`Passionate cat lover sharing life with 2 feline companions who keep my workspace creative and grounded.`.toUpperCase()}
                </Text>
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }} mt="xl">
              <Box
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 119, 0, 0.3)",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#FF7700",
                    transform: "scale(1.01)",
                    boxShadow: "0 0 25px rgba(255, 119, 0, 0.2)",
                  },
                }}
              >
                <Text
                  size="xs"
                  c="white"
                  ff="monospace"
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 3,
                    background: "rgba(0,0,0,0.75)",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  I.c // COMPANIONS (2 CATS)
                </Text>

                <AspectRatio ratio={16 / 9}>
                  <Image
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80"
                    alt="Two Cats Workspace Companions"
                    fallbackSrc="https://placehold.co/1200x675?text=2+Cats"
                    style={{
                      filter: "brightness(0.85) contrast(1.05)",
                      transition: "filter 0.4s ease, transform 0.6s ease",
                    }}
                  />
                </AspectRatio>

                <Box
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "16px 20px",
                    background:
                      "linear-gradient(transparent, rgba(0,0,0,0.85))",
                    zIndex: 2,
                  }}
                >
                  <Text size="xs" c="orange.4" ff="monospace">
                    FELINE COMPANIONSHIP // 02 CATS
                  </Text>
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
}
