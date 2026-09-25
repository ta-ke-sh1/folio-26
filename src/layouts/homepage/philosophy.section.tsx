import { Badge, Container, Stack, Text } from "@mantine/core";
import Dither from "../../components/background/dither.background";

export default function PhilosophySection() {
  return (
    <Container
      fluid
      className="homepage-philosophy-section"
      style={{ overflow: "visible" }}
      p={0}
      mb={50}
    >
      <Stack
        gap="sm"
        pt={50}
        className="homepage-philosophy-stack"
        style={{
          height: "100dvh",
          width: "100%",
          position: "relative",
        }}
      >
        <Badge
          size="lg"
          variant="dot"
          color="primaryOrange"
          style={{ position: "absolute", top: '55px', left: '15px', zIndex: 10 }}
        >
          II. Philosophy
        </Badge>
        <div style={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, }}>
            <Stack gap="5" style={{
              textAlign: "center",
            }}>
                <Text>YOUR VISIONS</Text>
                <Text>+</Text>
                <Text>MY VISUALIZATION</Text>
            </Stack>
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100dvw", height: "calc(100dvh + 50px)", opacity: 0.7, }}>
          <Dither
            waveColor={[0, 0, 0]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
            backgroundColor={[
              0.9764705882352941, 0.45098039215686275, 0.08627450980392157,
            ]}
          />
        </div>
      </Stack>
    </Container>
  );
}
