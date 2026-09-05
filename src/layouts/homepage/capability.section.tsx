import { useRef } from "react";
import { Container, Stack, Badge, Grid, Text } from "@mantine/core";
import { AsciiCanvas } from "../../components/animations/ascii/ascii";
import { AsciiTypes } from "../../components/animations/ascii/types";

// --- Main Component ---
export function CapabilitySection() {
  const storyTextRef = useRef<HTMLDivElement | null>(null);
  const strategyTextRef = useRef<HTMLDivElement | null>(null);

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
            II. Capability
          </Badge>

          <Grid align="flex-start">
            {/* Story Heading Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              style={{
                position: "relative",
              }}
            >
              <Text
                size="xl"
                c="white"
                style={{
                  fontSize: 20,
                  fontWeight: 200,
                  letterSpacing: "-1px",
                  maxWidth: "50dvw",
                  position: "absolute",
                  left: 10,
                  top: 10,
                  zIndex: 2,
                }}
              >
                {"II.a. Overview"}
              </Text>
              {/* ASCII Wave Animation height matched to storyTextRef */}
              <AsciiCanvas
                type={AsciiTypes.NOISE_FIELD}
                targetRef={storyTextRef}
              />
            </Grid.Col>

            {/* Story Content Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              style={{
                position: "relative",
              }}
            >
              <div ref={storyTextRef}>
                <Text
                  size="xl"
                  c="white"
                  style={{
                    fontSize: 64,
                    maxWidth: "50dvw",
                    lineHeight: "60px",
                  }}
                >
                  {`Mainly proficient in simulations, my development expertise focuses
              on replicating life events and interactions into the programming
              scene. I enjoy combining visual design with digital strategy.`.toUpperCase()}
                </Text>
              </div>
            </Grid.Col>

            {/* Strategy Content Column */}
            <Grid.Col span={{ base: 12, md: 6 }} mt="xl">
              <div ref={strategyTextRef}>
                <Text
                  size="xl"
                  c="white"
                  style={{
                    fontSize: 64,
                    maxWidth: "50dvw",
                    lineHeight: "60px",
                  }}
                >
                  {`My works aims to serve its purposes while maintaining a certain degree
              of personal aesthetic preferenes.`.toUpperCase()}
                </Text>
              </div>
            </Grid.Col>

            {/* Strategy Heading Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              mt="xl"
              style={{
                position: "relative",
              }}
            >
              <Text
                size="xl"
                c="white"
                style={{
                  fontSize: 20,
                  fontWeight: 200,
                  letterSpacing: "-1px",
                  maxWidth: "50dvw",
                  position: "absolute",
                  left: 10,
                  top: 10,
                  zIndex: 2,
                }}
              >
                {"II.b. Strategy"}
              </Text>
              {/* ASCII Matrix Animation height matched to strategyTextRef */}
              <AsciiCanvas
                type={AsciiTypes.RADAR_SCAN}
                targetRef={strategyTextRef}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
}
