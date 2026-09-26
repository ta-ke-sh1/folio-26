import { useRef } from "react";
import { Container, Stack, Badge, Grid, Text, Box } from "@mantine/core";
import { AsciiCanvas } from "../../components/animations/ascii/ascii";
import { AsciiTypes } from "../../components/animations/ascii/types";

// --- Main Component ---
export function CapabilitySection() {
  const storyTextRef = useRef<HTMLDivElement | null>(null);
  const strategyTextRef = useRef<HTMLDivElement | null>(null);

  return (
    <Container fluid mb="50px" className="homepage-capability-section">
      <Stack gap={60}>
        {/* Section Header */}
        <Stack gap="md" mt="60px">
          <Badge
            size="lg"
            variant="dot"
            color="primaryOrange"
            style={{ width: "fit-content" }}
          >
            III. Capability
          </Badge>

          <Grid align="flex-start">
            {/* Story Heading Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              className="homepage-capability-overview-heading"
              style={{
                position: "relative",
              }}
            >
              <Text
                size="xl"
                c="var(--folio-text)"
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
              className="homepage-capability-overview-content"
              style={{
                position: "relative",
              }}
            >
              <Box ref={storyTextRef} className="homepage-capability-copy">
                <Text
                  size="xl"
                  c="var(--folio-text)"
                  style={{
                    fontSize: 64,
                    maxWidth: "50dvw",
                    lineHeight: "60px",
                    textAlign: "left",
                  }}
                >
                  {`Mainly proficient in simulations, my development expertise focuses
              on replicating life events and interactions into the programming
              scene. `.toUpperCase()}
                </Text>
              </Box>
            </Grid.Col>

            {/* Strategy Content Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              mt="xl"
              className="homepage-capability-strategy-content"
            >
              <Box ref={strategyTextRef} className="homepage-capability-copy">
                <Text
                  size="xl"
                  c="var(--folio-text)"
                  style={{
                    fontSize: 64,
                    maxWidth: "50dvw",
                    lineHeight: "60px",
                    textAlign: "right",
                  }}
                >
                  {`I enjoy combining visual design with digital strategy. My works aims to serve its purposes while maintaining a certain degree
              of personal aesthetic preferenes.`.toUpperCase()}
                </Text>
              </Box>
            </Grid.Col>

            {/* Strategy Heading Column */}
            <Grid.Col
              span={{ base: 12, md: 6 }}
              mt="xl"
              className="homepage-capability-strategy-heading"
              style={{
                position: "relative",
              }}
            >
              <Text
                size="xl"
                c="var(--folio-text)"
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
