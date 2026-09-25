import { useRef, useState } from "react";
import { Container, Stack, Badge, Grid, Box, Text, Title } from "@mantine/core";

const STORY_PANELS = [
  {
    index: "01",
    label: "CORE_ROLE",
    title: "FULL-STACK ENGINEER",
    body: "Building reliable products from data layer to interface, with a bias for clear systems and considered details.",
    meta: "[COMPANY] // SYSTEMS / PRODUCT",
  },
  {
    index: "02",
    label: "MOTION_LOG",
    title: "VIDEOGRAPHY",
    body: "Following movement, rhythm, and atmosphere to turn everyday sequences into visual stories with a pulse.",
    meta: "CAMERA // EDIT // SEQUENCE",
  },
  {
    index: "03",
    label: "FRAME_ARCHIVE",
    title: "PHOTOGRAPHY",
    body: "Collecting geometry, light, and human traces through deliberate framing and a patient eye.",
    meta: "LIGHT // FORM // PERSPECTIVE",
  },
  {
    index: "04",
    label: "OPEN_SIGNAL",
    title: "VISUAL EXPLORATION",
    body: "Exploring the space between technology and feeling, where interfaces become places to pause, look, and wonder.",
    meta: "RESEARCH // EXPERIMENT // PLAY",
  },
];

const GALAXY_PLANETS = [
  {
    name: "FULL-STACK ENGINEER",
    orbit: 1,
    panel: 0,
    moons: ["REACT", "TYPESCRIPT", "APIs", "SIMULATION"],
  },
  {
    name: "VIDEOGRAPHY",
    orbit: 2,
    panel: 1,
    moons: ["CAMERA", "MOTION", "EDITING", "STORY"],
  },
  {
    name: "PHOTOGRAPHY",
    orbit: 3,
    panel: 2,
    moons: ["LIGHT", "FRAMING", "ARCHITECTURE", "DETAIL"],
  },
  {
    name: "VISUAL EXPLORATION",
    orbit: 4,
    panel: 3,
    moons: ["MOVIES", "CAT LOVER", "VISUALS", "CURIOSITY"],
  },
];

const MOON_ORBIT_DURATIONS = [32, 42, 52, 64];

export default function StorySection() {
  const [activePanel, setActivePanel] = useState(0);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [moonStartDelays, setMoonStartDelays] = useState<number[]>([]);

  const openPlanetSystem = (planetIndex: number) => {
    setActivePanel(GALAXY_PLANETS[planetIndex].panel);
    setSelectedPlanet(planetIndex);
    setMoonStartDelays(
      GALAXY_PLANETS[planetIndex].moons.map(
        (_, moonIndex) => Math.random() * MOON_ORBIT_DURATIONS[moonIndex],
      ),
    );
  };

  return (
    <Container
      fluid
      className="homepage-story-section"
      style={{ overflow: "visible" }}
    >
      <Stack gap="sm" pt={50} className="homepage-story-stack">
        <Badge
          size="lg"
          variant="dot"
          color="primaryOrange"
          style={{ width: "fit-content" }}
        >
          I. Story
        </Badge>
        <Grid align="stretch" gap={0} className="homepage-story-grid">
          <Grid.Col span={{ base: 12 }}>
            <Stack mb="md" gap={0} className="homepage-capability-copy">
              <Text
                size="xl"
                c="var(--folio-text)"
                style={{
                   fontSize: 64,
                   lineHeight: '60px',
                }}
              >
                {`Full-stack software engineer at Toshiba Software Development Vietnam. Specialized in simulation software development, transforming industrial concepts into accessible web platforms.`.toUpperCase()}
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Box
              className={`homepage-story-signal${selectedPlanet !== null ? " is-expanded" : ""}`}
            >
              <Box
                className="homepage-story-signal-orbit"
                style={{
                  left: "50%",
                  top: "50%",
                }}
              >
                <Box className="homepage-story-signal-star" />
                {GALAXY_PLANETS.map((planet, index) => (
                  <Box
                    key={planet.name}
                    className={`homepage-story-signal-planet-orbit homepage-story-signal-planet-orbit--${planet.orbit}`}
                  >
                    <Box
                      className={`homepage-story-signal-planet-marker homepage-story-signal-planet-marker--${planet.orbit}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${planet.name} system`}
                      aria-pressed={selectedPlanet === index}
                      onClick={() => openPlanetSystem(index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openPlanetSystem(index);
                        }
                      }}
                    >
                      <Box
                        className={`homepage-story-signal-planet homepage-story-signal-planet--${planet.orbit}`}
                        role="img"
                        aria-label={planet.name}
                      />
                      <span className="homepage-story-signal-planet-label-anchor">
                        <span className="homepage-story-signal-planet-label">
                          {planet.name}
                        </span>
                      </span>
                    </Box>
                  </Box>
                ))}
              </Box>
              {selectedPlanet !== null && (
                <Box
                  className="homepage-story-galaxy-focus"
                  role="dialog"
                  aria-label={`${GALAXY_PLANETS[selectedPlanet].name} planetary system`}
                >
                  <button
                    type="button"
                    className="homepage-story-galaxy-back"
                    onClick={() => setSelectedPlanet(null)}
                  >
                    ← GALAXY
                  </button>
                  <Text className="homepage-story-galaxy-focus-index" ff="monospace">
                    {STORY_PANELS[activePanel].index} // PERSONAL SYSTEM
                  </Text>
                  <Box className="homepage-story-galaxy-focus-system">
                    {GALAXY_PLANETS[selectedPlanet].moons.map((moon, index) => (
                      <Box
                        key={moon}
                        className={`homepage-story-galaxy-moon-orbit homepage-story-galaxy-moon-orbit--${index + 1}`}
                        style={{ animationDelay: `${-moonStartDelays[index]}s` }}
                      >
                        <span
                          className="homepage-story-galaxy-moon-marker"
                          style={{ animationDelay: `${-moonStartDelays[index]}s` }}
                        >
                          <span className="homepage-story-galaxy-moon" />
                          <span className="homepage-story-galaxy-moon-label">
                            {moon}
                          </span>
                        </span>
                      </Box>
                    ))}
                    <Box className="homepage-story-galaxy-main-planet">
                      <Text size="xs" ff="monospace" fw={700} ta="center">
                        {GALAXY_PLANETS[selectedPlanet].name}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
              <Stack gap={4} className="homepage-story-signal-readout">
                <Text size="xs" c="orange.4" ff="monospace" fw={700}>
                  LIVE_VIEW / {STORY_PANELS[activePanel].index}
                </Text>
                <Text size="xs" c="dimmed" ff="monospace">
                  ORBITAL SYSTEM / ACTIVE
                </Text>
                <Text
                  className="homepage-story-signal-speed"
                  size="xs"
                  c="orange.3"
                  ff="monospace"
                >
                  ROTATION // GALAXY 48s · MOONS 32–64s
                </Text>
              </Stack>
              <Text className="homepage-story-signal-mark" ff="monospace">
                26°
              </Text>
            </Box>
          </Grid.Col>

          <Grid.Col span={12} mt="xl">
            <Grid gap="xs" className="homepage-story-index">
          {STORY_PANELS.map((panel) => (
            <Grid.Col
              key={panel.index}
              span={{ base: 12, sm: 6, lg: 3 }}
            >
              <Box
                className="homepage-story-index-item"
                role="button"
                tabIndex={0}
                aria-label={`Open ${panel.title} galaxy`}
                onMouseEnter={() => setActivePanel(Number(panel.index) - 1)}
                onClick={() => {
                  const panelIndex = Number(panel.index) - 1;
                  openPlanetSystem(panelIndex);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const panelIndex = Number(panel.index) - 1;
                    openPlanetSystem(panelIndex);
                  }
                }}
                style={{
                  borderTopColor: activePanel === Number(panel.index) - 1 ? "#ff7700" : undefined,
                }}
              >
                <Text size="xs" ff="monospace" c="orange.4" fw={700}>
                  {panel.index}
                </Text>
                <Stack gap={2}>
                  <Text c="white" fw={700} ff="monospace" size="sm">
                    {panel.title}
                  </Text>
                  <Text size="xs" c="dimmed" ff="monospace">
                    {panel.meta}
                  </Text>
                </Stack>
              </Box>
            </Grid.Col>
          ))}
            </Grid>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
