import { useState } from "react";
import { Container, Stack, Badge, Grid, Box, Text } from "@mantine/core";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";

const STORY_PANELS = [
  {
    index: "01",
    label: "CORE_ROLE",
    title: "CAREER OVERVIEW",
    body: "Building reliable products from data layer to interface, with a bias for clear systems and considered details.",
    meta: "TSDV // FULL-STACK DEVELOPER // 4 YEARS OF EXPERIENCE",
  },
  {
    index: "02",
    label: "MOTION_LOG",
    title: "MAIN EXPERTISE",
    body: "Following movement, rhythm, and atmosphere to turn everyday sequences into visual stories with a pulse.",
    meta: "SYSTEM DESIGN // WEB DEVELOPMENT",
  },
  {
    index: "03",
    label: "FRAME_ARCHIVE",
    title: "SIDE QUESTS",
    body: "Collecting geometry, light, and human traces through deliberate framing and a patient eye.",
    meta: "VIDEOGRAPHY // PHOTOGRAPHY // FAN OF BAD BUNNY",
  },
  {
    index: "04",
    label: "LANGUAGES",
    title: "COMMUNICATION",
    body: "Exploring the space between technology and feeling, where interfaces become places to pause, look, and wonder.",
    meta: "VIETNAMESE // ENGLISH // JAPANESE",
  },
];

const GALAXY_PLANETS = [
  {
    name: "CAREER OVERVIEW",
    orbit: 1,
    panel: 1,
    moons: [
      "4 YEARS OF EXPERIENCE",
      "BEST ENGINEER OF COMPANY",
      "LEAD A TEAM OF 3",
      "8+ PROJECTS WITH DIFFERENT SCALES",
    ],
  },
  {
    name: "MAIN EXPERTISE",
    orbit: 2,
    panel: 2,
    moons: [
      "PROTOCOLS SIMULATION",
      "WEB DEVELOPMENT",
      "SYSTEM DESIGN",
      "SECURITY ISSUES",
    ],
  },
  {
    name: "SIDE QUESTS",
    orbit: 3,
    panel: 3,
    moons: [
      "BAD BUNNY ENJOYER",
      "RANDOM PHOTOGRAPHER",
      "FILMMAKER FOR ONCE IN A WHILE",
      "I HAVE 2 CATS",
    ],
  },
  {
    name: "CERTIFICATES",
    orbit: 4,
    panel: 3,
    moons: [
      "8.0 IELTS",
      "N2 JAPANESE",
      "FIRST CLASS HONORS IN COMPUTING",
      "28 YEARS OF HONING VIETNAMESE",
    ],
  },
];

const MOON_ORBIT_DURATIONS = [32, 42, 52, 64];
const MOON_ORBIT_SIZES = ["48%", "66%", "84%", "100%"];
const PLANET_ORBIT_STYLES = [
  { width: "28%", angle: 32, markerSize: 8, radius: 4, color: "#ff8a3d" },
  { width: "48%", angle: 142, markerSize: 11, radius: 5.5, color: "#ffc078" },
  { width: "70%", angle: 238, markerSize: 14, radius: 7, color: "#ff6b35" },
  { width: "90%", angle: 62, markerSize: 18, radius: 9, color: "#d94801" },
];

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
      <Stack gap="sm" pt={20} style={{ minHeight: "100dvh" }}>
        <Badge
          size="lg"
          variant="dot"
          color="primaryOrange"
          style={{ width: "fit-content" }}
        >
          <BilingualShuffle english="I. Story" japanese="I. 物語" />
        </Badge>
        <Grid align="stretch" gap={0} className="homepage-story-grid">
          <Grid.Col span={{ base: 12 }}>
            <Stack mb="md" gap={0} className="homepage-capability-copy">
              <Text
                size="xl"
                c="var(--folio-text)"
                style={{
                  fontSize: 64,
                  lineHeight: "60px",
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
                {GALAXY_PLANETS.map((planet, index) => {
                  const orbitStyle = PLANET_ORBIT_STYLES[index];
                  return (
                    <Box
                      key={planet.name}
                      className="homepage-story-signal-planet-orbit"
                      style={{
                        width: orbitStyle.width,
                        ["--planet-orbit-angle" as string]: `${orbitStyle.angle}deg`,
                        transform: `translate(-50%, -50%) rotate(${orbitStyle.angle}deg)`,
                        borderStyle: index === 3 ? "dashed" : undefined,
                      }}
                    >
                      <Box
                        className="homepage-story-signal-planet-marker"
                        style={{
                          width: orbitStyle.markerSize,
                          height: orbitStyle.markerSize,
                        }}
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
                          className="homepage-story-signal-planet"
                          style={{
                            background: orbitStyle.color,
                            boxShadow:
                              index === 3
                                ? "0 0 10px rgba(255, 119, 0, 0.95)"
                                : undefined,
                          }}
                          role="img"
                          aria-label={planet.name}
                        />
                        <span className="homepage-story-signal-planet-label-anchor">
                          <span
                            className="homepage-story-signal-planet-label"
                            style={{ bottom: orbitStyle.radius + 6 }}
                          >
                            {planet.name}
                          </span>
                        </span>
                      </Box>
                    </Box>
                  );
                })}
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
                  <Text
                    ff="monospace"
                    style={{
                      position: "absolute",
                      top: 22,
                      right: 16,
                      margin: 0,
                      color: "rgba(255, 184, 120, 0.7)",
                      fontSize: 9,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {STORY_PANELS[activePanel].index} // PERSONAL SYSTEM
                  </Text>
                  <Box className="homepage-story-galaxy-focus-system">
                    {GALAXY_PLANETS[selectedPlanet].moons.map((moon, index) => {
                      const duration = MOON_ORBIT_DURATIONS[index];
                      const direction = index % 2 === 1 ? "reverse" : "normal";
                      return (
                        <Box
                          key={moon}
                          className="homepage-story-galaxy-moon-orbit"
                          style={{
                            width: MOON_ORBIT_SIZES[index],
                            animationDelay: `${-moonStartDelays[index]}s`,
                            animationDuration: `${duration}s`,
                            animationDirection: direction,
                          }}
                        >
                          <span
                            className="homepage-story-galaxy-moon-marker"
                            style={{
                              animationDelay: `${-moonStartDelays[index]}s`,
                              animationDuration: `${duration}s`,
                              animationDirection: direction,
                            }}
                          >
                            <span className="homepage-story-galaxy-moon" />
                            <span className="homepage-story-galaxy-moon-label">
                              {moon}
                            </span>
                          </span>
                        </Box>
                      );
                    })}
                    <Box className="homepage-story-galaxy-main-planet">
                      <Text
                        size="xs"
                        ff="monospace"
                        fw={700}
                        ta="center"
                        style={{
                          maxWidth: "100%",
                          fontSize: 9,
                          lineHeight: 1.25,
                        }}
                      >
                        {GALAXY_PLANETS[selectedPlanet].name}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
              <Stack
                gap={4}
                style={{
                  position: "absolute",
                  zIndex: 5,
                  left: 18,
                  bottom: 18,
                  maxWidth: "calc(100% - 36px)",
                }}
              >
                <Text size="xs" c="orange.4" ff="monospace" fw={700}>
                  CLICK TO VIEW / {STORY_PANELS[activePanel].index}
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
              <Text
                ff="monospace"
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  margin: 0,
                  color: "rgba(255, 255, 255, 0.52)",
                  fontSize: 12,
                }}
              >
                26°
              </Text>
            </Box>
          </Grid.Col>

          <Grid.Col span={12} mt="40">
            <Grid gap="xs" className="homepage-story-index">
              {STORY_PANELS.map((panel) => (
                <Grid.Col key={panel.index} span={{ base: 12, sm: 6, lg: 3 }}>
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
                      borderTopColor:
                        activePanel === Number(panel.index) - 1
                          ? "#ff7700"
                          : undefined,
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
