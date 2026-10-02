import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Container, Stack, Grid, Box, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import gsap from "gsap";

const SHUFFLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/アイウエオ";

function GsapShufflePrompt() {
  const promptRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = promptRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = "SELECT A PLANET";
      return;
    }

    const english = "SELECT A PLANET";
    const japanese = "惑星を選択してください";
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.8 });

    const addShuffle = (target: string) => {
      const progress = { value: 0 };
      timeline.to(progress, {
        value: target.length,
        duration: Math.max(0.65, target.length * 0.065),
        ease: "none",
        onUpdate: () => {
          const revealed = Math.floor(progress.value);
          element.textContent = target
            .split("")
            .map((character, index) =>
              index < revealed
                ? character
                : SHUFFLE_GLYPHS[Math.floor(Math.random() * SHUFFLE_GLYPHS.length)],
            )
            .join("");
        },
        onComplete: () => {
          element.textContent = target;
        },
      });
    };

    timeline.call(() => {
      element.textContent = english;
    });
    timeline.to({}, { duration: 2.2 });
    addShuffle(japanese);
    timeline.to({}, { duration: 2.2 });
    addShuffle(english);

    return () => {
      timeline.kill();
    };
  }, []);

  return <span ref={promptRef} />;
}

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

const MOON_ORBIT_DURATIONS = [48, 62, 76, 92];
const MOON_ORBIT_SIZES = ["48%", "66%", "84%", "100%"];
const PLANET_ORBIT_STYLES = [
  { width: "28%", angle: 32, markerSize: 12, radius: 6, color: "#ff8a3d" },
  { width: "48%", angle: 142, markerSize: 16.5, radius: 8.25, color: "#ffc078" },
  { width: "70%", angle: 238, markerSize: 21, radius: 10.5, color: "#ff6b35" },
  { width: "90%", angle: 62, markerSize: 27, radius: 13.5, color: "#d94801" },
];

const STORY_INLINE_STYLES = {
  section: { minWidth: 0, width: "100%" },
  stack: { minWidth: 0, width: "100%" },
  grid: { minWidth: 0, width: "100%" },
  gridColumn: { minWidth: 0, width: "100%" },
  signal: {
    position: "relative",
    minHeight: 500,
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#050505",
    backgroundImage:
      "radial-gradient(circle at center, rgba(255, 119, 0, 0.12), transparent 48%), linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(135deg, #171717, #050505 65%)",
    backgroundSize: "auto, 34px 34px, 34px 34px, auto",
    border: "1px solid rgba(255, 119, 0, 0.45)",
    borderRadius: 2,
    isolation: "isolate",
  },
  signalNoise: {
    position: "absolute",
    zIndex: 0,
    inset: 0,
    background:
      "repeating-linear-gradient(0deg, transparent 0, transparent 7px, rgba(255, 255, 255, 0.045) 8px)",
    mixBlendMode: "screen",
    pointerEvents: "none",
  },
  signalScanline: {
    position: "absolute",
    zIndex: 0,
    top: "50%",
    left: 0,
    width: "100%",
    borderTop: "1px solid rgba(255, 119, 0, 0.22)",
    pointerEvents: "none",
  },
  orbit: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "min(96%, 560px)",
    aspectRatio: 1.55,
    translate: "-50% -50%",
    border: "1px solid rgba(255, 119, 0, 0.7)",
    borderRadius: "50%",
    boxShadow: "0 0 40px rgba(255, 119, 0, 0.24), inset 0 0 30px rgba(255, 119, 0, 0.12)",
    pointerEvents: "none",
  },
  star: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#ffb35c",
    boxShadow: "0 0 12px #ff7700, 0 0 32px rgba(255, 119, 0, 0.95)",
    transform: "translate(-50%, -50%)",
  },
  planetOrbit: {
    position: "absolute",
    top: "50%",
    left: "50%",
    aspectRatio: 1.55,
    border: "1px solid rgba(255, 211, 174, 0.72)",
    borderRadius: "50%",
    boxShadow: "0 0 8px rgba(255, 173, 112, 0.2), inset 0 0 8px rgba(255, 173, 112, 0.07)",
    background: "rgba(255, 119, 0, 0.015)",
  },
  planetMarker: {
    position: "absolute",
    top: "calc(var(--planet-marker-size, 8px) / -2)",
    left: "50%",
    width: 8,
    height: 8,
    transform: "translateX(-50%)",
    pointerEvents: "auto",
    cursor: "pointer",
  },
  planetPulse: {
    position: "absolute",
    zIndex: 0,
    inset: -5,
    border: "1px solid rgba(255, 178, 106, 0.78)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  planet: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#ff8a3d",
    boxShadow: "0 0 8px rgba(255, 119, 0, 0.9)",
    pointerEvents: "auto",
  },
  planetLabelAnchor: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
    transformOrigin: "0 0",
    pointerEvents: "none",
  },
  planetLabel: {
    position: "absolute",
    left: 0,
    zIndex: 2,
    width: "max-content",
    maxWidth: 112,
    padding: "4px 7px",
    border: "1px solid rgba(255, 119, 0, 0.45)",
    background: "rgba(5, 5, 5, 0.88)",
    color: "#ffd2a6",
    font: "700 8px/1.2 monospace",
    letterSpacing: 0.4,
    textAlign: "center",
    whiteSpace: "normal",
    transform: "translateX(-50%)",
    pointerEvents: "none",
  },
  galaxyFocus: {
    position: "absolute",
    zIndex: 3,
    inset: 0,
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    backgroundColor: "#040404",
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px), radial-gradient(circle at center, rgba(26, 15, 7, 0.94), rgba(4, 4, 4, 0.97) 72%)",
    backgroundSize: "30px 30px, 30px 30px, auto",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: "8px 10px",
    border: "1px solid rgba(255, 119, 0, 0.45)",
    background: "rgba(5, 5, 5, 0.8)",
    color: "#ffb36b",
    font: "700 10px monospace",
    letterSpacing: 0.5,
    cursor: "pointer",
  },
  focusSystem: {
    position: "relative",
    width: "min(78vw, 350px)",
    aspectRatio: 1,
  },
  mainPlanet: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: "50%",
    display: "grid",
    placeItems: "center",
    width: "clamp(88px, 25%, 112px)",
    aspectRatio: 1,
    padding: 12,
    border: "1px solid rgba(255, 179, 92, 0.9)",
    borderRadius: "50%",
    background: "radial-gradient(circle at 32% 28%, #ffd6a0, #ff7700 38%, #431707 78%)",
    boxShadow: "0 0 22px rgba(255, 119, 0, 0.72), inset -10px -8px 20px rgba(0, 0, 0, 0.65)",
    color: "#fff4e6",
    transform: "translate(-50%, -50%)",
  },
  moonOrbit: {
    position: "absolute",
    top: "50%",
    left: "50%",
    aspectRatio: 1,
    translate: "-50% -50%",
    border: "1px solid rgba(255, 119, 0, 0.28)",
    borderRadius: "50%",
  },
  moon: {
    position: "absolute",
    inset: 0,
    border: "1px solid rgba(255, 191, 128, 0.75)",
    borderRadius: "50%",
    background: "radial-gradient(circle at 32% 28%, #ffd2a6, #ff7700 65%, #7a2e08)",
    boxShadow: "0 0 8px rgba(255, 119, 0, 0.65), inset -2px -2px 4px rgba(0, 0, 0, 0.65)",
  },
  moonMarker: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 8,
    height: 8,
    marginLeft: -4,
    transformOrigin: "0 0",
  },
  moonLabel: {
    position: "absolute",
    bottom: "calc(100% + 6px)",
    left: "50%",
    zIndex: 1,
    width: "max-content",
    maxWidth: 112,
    padding: "4px 7px",
    border: "1px solid rgba(255, 119, 0, 0.5)",
    borderRadius: 2,
    background: "rgba(5, 5, 5, 0.92)",
    color: "#ffd2a6",
    font: "700 8px/1.2 monospace",
    letterSpacing: 0.4,
    textAlign: "center",
    whiteSpace: "normal",
    transform: "translateX(-50%)",
    pointerEvents: "none",
  },
  preview: {
    position: "absolute",
    zIndex: 4,
    top: 18,
    left: 18,
    width: "min(280px, 34%)",
    maxWidth: "calc(100% - 36px)",
    boxSizing: "border-box",
    overflow: "hidden",
    padding: "12px 14px",
    border: "1px solid rgba(255, 119, 0, 0.4)",
    background: "linear-gradient(135deg, rgba(18, 12, 7, 0.94), rgba(5, 5, 5, 0.9))",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3), inset 2px 0 rgba(255, 119, 0, 0.72)",
    backdropFilter: "blur(5px)",
    pointerEvents: "none",
    opacity: 1,
    transform: "translateY(0)",
  },
  previewKicker: {
    display: "block",
    marginBottom: 5,
    color: "rgba(255, 177, 104, 0.7)",
    font: '700 8px/1.3 "DM Mono", monospace',
    letterSpacing: "0.1em",
  },
  previewCopy: {
    display: "block",
    minHeight: "2.9em",
    marginTop: 5,
    color: "rgba(226, 215, 201, 0.82)",
    font: '9px "DM Mono", monospace',
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  },
  instruction: {
    color: "rgba(255, 184, 120, 0.86)",
    fontFamily: "DotGothic16, sans-serif",
    fontSize: 10,
    letterSpacing: "0.06em",
    textShadow: "0 0 10px rgba(255, 119, 0, 0.4)",
  },
  statusTitle: {
    position: "absolute",
    top: 22,
    right: 16,
    margin: 0,
    color: "rgba(255, 184, 120, 0.7)",
    fontSize: 9,
    letterSpacing: "0.5px",
  },
  detailCard: {
    position: "absolute",
    zIndex: 2,
    right: 18,
    bottom: 18,
    width: "min(300px, 42%)",
    maxWidth: "calc(100% - 36px)",
    maxHeight: "min(42%, 220px)",
    boxSizing: "border-box",
    overflowY: "auto",
    padding: "12px 14px",
    border: "1px solid rgba(255, 119, 0, 0.48)",
    background: "linear-gradient(135deg, rgba(18, 12, 7, 0.94), rgba(5, 5, 5, 0.92))",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.32), inset 2px 0 rgba(255, 119, 0, 0.72)",
    backdropFilter: "blur(5px)",
  },
  detailKicker: {
    display: "block",
    marginBottom: 5,
    color: "rgba(255, 177, 104, 0.72)",
    font: '700 8px/1.3 "DM Mono", monospace',
    letterSpacing: "0.08em",
  },
  detailTitle: {
    display: "block",
    color: "#ffd2a6",
    font: '700 11px/1.35 "DotGothic16", sans-serif',
    letterSpacing: "0.02em",
  },
  detailBody: {
    margin: "6px 0 0",
    color: "rgba(226, 215, 201, 0.88)",
    font: '9px/1.5 "DM Mono", monospace',
    overflowWrap: "anywhere",
  },
  detailMeta: {
    display: "block",
    marginTop: 8,
    paddingTop: 6,
    borderTop: "1px solid rgba(255, 119, 0, 0.24)",
    color: "rgba(255, 190, 139, 0.78)",
    font: '700 7px/1.45 "DM Mono", monospace',
    letterSpacing: "0.04em",
    overflowWrap: "anywhere",
  },
  statusCorner: {
    position: "absolute",
    top: 18,
    right: 18,
    margin: 0,
    color: "rgba(255, 255, 255, 0.52)",
    fontSize: 12,
  },
  instructions: {
    position: "absolute",
    zIndex: 5,
    left: 18,
    bottom: 18,
    maxWidth: "calc(100% - 36px)",
  },
} satisfies Record<string, CSSProperties>;

function GalaxyFocus({
  planetIndex,
  activePanel,
  isMobile,
  onClose,
}: {
  planetIndex: number;
  activePanel: number;
  isMobile: boolean;
  onClose: () => void;
}) {
  const [backButtonActive, setBackButtonActive] = useState(false);
  const planet = GALAXY_PLANETS[planetIndex];
  const panel = STORY_PANELS[activePanel];

  return (
    <Box
      className="homepage-story-galaxy-focus"
      style={STORY_INLINE_STYLES.galaxyFocus}
      role="dialog"
      aria-label={`${planet.name} planetary system`}
    >
      <button
        type="button"
        className="homepage-story-galaxy-back"
        style={{
          ...STORY_INLINE_STYLES.backButton,
          ...(backButtonActive
            ? {
                borderColor: "#ff7700",
                background: "rgba(255, 119, 0, 0.14)",
              }
            : {}),
        }}
        onMouseEnter={() => setBackButtonActive(true)}
        onMouseLeave={() => setBackButtonActive(false)}
        onFocus={() => setBackButtonActive(true)}
        onBlur={() => setBackButtonActive(false)}
        onClick={onClose}
      >
        ← GALAXY
      </button>
      <Text ff="DotGothic16" style={STORY_INLINE_STYLES.statusTitle}>
        {panel.index} // PERSONAL SYSTEM
      </Text>
      <Box
        className="homepage-story-galaxy-focus-system"
        style={STORY_INLINE_STYLES.focusSystem}
      >
        {planet.moons.map((moon, index) => (
          <Box
            key={moon}
            className="homepage-story-galaxy-moon-orbit"
            style={{
              ...STORY_INLINE_STYLES.moonOrbit,
              width: MOON_ORBIT_SIZES[index],
            }}
            data-moon-index={index}
          >
            <span
              className="homepage-story-galaxy-moon-marker"
              aria-hidden="true"
              style={STORY_INLINE_STYLES.moonMarker}
            >
              <span
                className="homepage-story-galaxy-moon"
                style={STORY_INLINE_STYLES.moon}
              />
              <span
                className="homepage-story-galaxy-moon-label"
                style={STORY_INLINE_STYLES.moonLabel}
              >
                {moon}
              </span>
            </span>
          </Box>
        ))}
        <Box
          className="homepage-story-galaxy-main-planet"
          style={STORY_INLINE_STYLES.mainPlanet}
        >
          <Text
            size="xs"
            ff="DotGothic16"
            fw={700}
            ta="center"
            style={{
              maxWidth: "100%",
              fontSize: 9,
              lineHeight: 1.25,
            }}
          >
            {planet.name}
          </Text>
        </Box>
      </Box>
      <Box
        role="region"
        aria-label={`${panel.title} details`}
        style={{
          ...STORY_INLINE_STYLES.detailCard,
          ...(isMobile
            ? {
                right: 12,
                bottom: 12,
                width: "min(220px, 52%)",
                maxWidth: "calc(100% - 24px)",
                padding: "9px 10px",
              }
            : {}),
        }}
      >
        <span style={STORY_INLINE_STYLES.detailKicker}>
          {panel.label} // SYSTEM DATA
        </span>
        <span style={STORY_INLINE_STYLES.detailTitle}>{panel.title}</span>
        <p style={STORY_INLINE_STYLES.detailBody}>{panel.body}</p>
        <span style={STORY_INLINE_STYLES.detailMeta}>{panel.meta}</span>
      </Box>
    </Box>
  );
}

export default function StorySection({ embedded = false }: { embedded?: boolean }) {
  const [activePanel, setActivePanel] = useState(GALAXY_PLANETS[0].panel);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<number | null>(null);
  const [focusedPlanet, setFocusedPlanet] = useState<number | null>(null);
  const [moonStartDelays, setMoonStartDelays] = useState<number[]>([]);
  const isMobile = useMediaQuery("(max-width: 48em)") ?? false;
  const activePreviewIndex = selectedPlanet === null ? hoveredPlanet : null;
  const previewTextRef = useRef("");
  const signalRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewText, setPreviewText] = useState("");

  useEffect(() => {
    const updatePreview = (value: string) => {
      previewTextRef.current = value;
      setPreviewText(value);
    };
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (activePreviewIndex === null) {
      if (!previewTextRef.current) return;
      if (reducedMotion) {
        updatePreview("");
        return;
      }

      const progress = { value: previewTextRef.current.length };
      const startingLength = previewTextRef.current.length;
      const timeline = gsap.to(progress, {
        value: 0,
        duration: Math.min(0.8, startingLength * 0.018),
        ease: "power2.in",
        onUpdate: () => {
          const remaining = Math.ceil(progress.value);
          updatePreview(
            Array.from({ length: remaining }, () =>
              SHUFFLE_GLYPHS[Math.floor(Math.random() * SHUFFLE_GLYPHS.length)],
            ).join(""),
          );
        },
        onComplete: () => updatePreview(""),
      });
      return () => {
        timeline.kill();
      };
    } else {
      const planet = GALAXY_PLANETS[activePreviewIndex];
      const panel = STORY_PANELS[planet.panel];
      const target = `${planet.name}\n${panel.body}\n${planet.moons.slice(0, 3).join("  /  ")}`;

      if (reducedMotion) {
        updatePreview(target);
        return;
      }

      updatePreview("");
      const progress = { value: 0 };
      const timeline = gsap.to(progress, {
        value: target.length,
        duration: Math.max(0.25, target.length * 0.012),
        ease: "none",
        onUpdate: () => updatePreview(target.slice(0, Math.floor(progress.value))),
        onComplete: () => updatePreview(target),
      });

      return () => {
        timeline.kill();
      };
    }
  }, [activePreviewIndex]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const context = gsap.context(() => {
      const orbit = orbitRef.current;
      if (!orbit) return;

      gsap.to(orbit, {
        rotation: 360,
        duration: 72,
        ease: "none",
        repeat: -1,
      });

      gsap.utils
        .toArray<HTMLElement>(
          ".homepage-story-signal-planet-label-anchor",
          signalRef.current,
        )
        .forEach((label) => {
          const angle = Number(label.dataset.planetAngle ?? 0);
          gsap.set(label, { rotation: -angle });
          gsap.to(label, {
            rotation: -angle - 360,
            duration: 72,
            ease: "none",
            repeat: -1,
          });
        });

      gsap.utils
        .toArray<HTMLElement>(
          ".homepage-story-signal-planet-marker",
          signalRef.current,
        )
        .forEach((marker) => {
          const pulse = marker.querySelector<HTMLElement>(
            ".homepage-story-signal-planet-pulse",
          );
          const planet = marker.querySelector<HTMLElement>(
            ".homepage-story-signal-planet",
          );
          if (pulse) {
            gsap.fromTo(
              pulse,
              { scale: 0.6, autoAlpha: 0.85 },
              {
                scale: 1.9,
                autoAlpha: 0,
                duration: 1.8,
                ease: "power1.out",
                repeat: -1,
              },
            );
          }
          if (planet) {
            gsap.to(planet, {
              scale: 1.12,
              duration: 0.9,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          }
        });
    }, signalRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!signalRef.current) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const context = gsap.context(() => {
      const focus = signalRef.current?.querySelector<HTMLElement>(
        ".homepage-story-galaxy-focus",
      );
      if (focus && reducedMotion) {
        gsap.set(focus, { autoAlpha: 1, scale: 1 });
      } else if (focus) {
        gsap.fromTo(
          focus,
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" },
        );
      }

      gsap.utils
        .toArray<HTMLElement>(
          ".homepage-story-galaxy-moon-orbit",
          signalRef.current,
        )
        .forEach((moonOrbit, index) => {
          const duration = MOON_ORBIT_DURATIONS[index];
          const direction = index % 2 === 1 ? -1 : 1;
          const phase = reducedMotion
            ? 0
            : direction * 360 * (moonStartDelays[index] / duration);
          const moonMarker = moonOrbit.querySelector<HTMLElement>(
            ".homepage-story-galaxy-moon-marker",
          );

          gsap.set(moonOrbit, { rotation: phase });
          if (!reducedMotion) {
            gsap.to(moonOrbit, {
              rotation: phase + direction * 360,
              duration,
              ease: "none",
              repeat: -1,
            });
          }

          if (moonMarker) {
            gsap.set(moonMarker, { rotation: -phase });
            if (!reducedMotion) {
              gsap.to(moonMarker, {
                rotation: -phase - direction * 360,
                duration,
                ease: "none",
                repeat: -1,
              });
            }
          }
        });
    }, signalRef);

    return () => context.revert();
  }, [selectedPlanet, moonStartDelays]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || activePreviewIndex === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      preview,
      { y: 5, autoAlpha: 0.8 },
      { y: 0, autoAlpha: 1, duration: 0.18, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [activePreviewIndex]);

  useEffect(() => {
    const markers = signalRef.current?.querySelectorAll<HTMLElement>(
      ".homepage-story-signal-planet-marker",
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tweens: gsap.core.Tween[] = [];
    markers?.forEach((marker, index) => {
      const planet = marker.querySelector<HTMLElement>(
        ".homepage-story-signal-planet",
      );
      if (!planet) return;

      const baseBoxShadow =
        planet.style.boxShadow || window.getComputedStyle(planet).boxShadow;
      const vars = {
        filter: hoveredPlanet === index ? "brightness(1.45)" : "brightness(1)",
        boxShadow:
          hoveredPlanet === index
            ? "0 0 15px rgba(255, 171, 92, 1)"
            : baseBoxShadow,
      };
      if (reducedMotion) gsap.set(planet, vars);
      else {
        tweens.push(
          gsap.to(planet, {
            ...vars,
            duration: 0.16,
            ease: "power2.out",
            overwrite: "auto",
          }),
        );
      }
    });
    return () => tweens.forEach((tween) => tween.kill());
  }, [hoveredPlanet]);

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
      p={0}
      className={`homepage-story-section${embedded ? " homepage-story-section--embedded" : ""}`}
      style={{
        ...STORY_INLINE_STYLES.section,
        overflow: embedded ? "hidden" : "visible",
      }}
    >
      <Stack
        gap="sm"
        style={{
          ...STORY_INLINE_STYLES.stack,
          minHeight: embedded ? "100%" : "100dvh",
        }}
      >
        <Grid
          align="stretch"
          gap={0}
          className="homepage-story-grid"
          style={{
            ...STORY_INLINE_STYLES.grid,
            display: isMobile ? "flex" : undefined,
          }}
        >
          <Grid.Col
            span={{ base: 12 }}
            p={0}
            style={STORY_INLINE_STYLES.gridColumn}
          >
            <Box
              ref={signalRef}
              className={`homepage-story-signal${selectedPlanet !== null ? " is-expanded" : ""}`}
              style={{
                ...STORY_INLINE_STYLES.signal,
                minHeight: isMobile ? 340 : 500,
                marginTop: isMobile && !embedded ? 42 : 0,
              }}
            >
              <Box
                aria-hidden="true"
                style={STORY_INLINE_STYLES.signalNoise}
              />
              <Box
                aria-hidden="true"
                style={STORY_INLINE_STYLES.signalScanline}
              />
              <Box
                ref={orbitRef}
                className="homepage-story-signal-orbit"
                style={{
                  ...STORY_INLINE_STYLES.orbit,
                  width: isMobile ? "min(96%, 440px)" : "min(96%, 560px)",
                  left: "50%",
                  top: "50%",
                }}
              >
                <Box
                  className="homepage-story-signal-star"
                  style={STORY_INLINE_STYLES.star}
                />
                {GALAXY_PLANETS.map((planet, index) => {
                  const orbitStyle = PLANET_ORBIT_STYLES[index];
                  return (
                    <Box
                      key={planet.name}
                      className="homepage-story-signal-planet-orbit"
                      style={{
                        ...STORY_INLINE_STYLES.planetOrbit,
                        width: orbitStyle.width,
                        ["--planet-orbit-angle" as string]: `${orbitStyle.angle}deg`,
                        transform: `translate(-50%, -50%) rotate(${orbitStyle.angle}deg)`,
                        borderStyle: index % 2 === 0 ? "dashed" : "dotted",
                      }}
                    >
                      <Box
                        className="homepage-story-signal-planet-marker"
                        style={{
                          ...STORY_INLINE_STYLES.planetMarker,
                          width: orbitStyle.markerSize,
                          height: orbitStyle.markerSize,
                          ["--planet-marker-size" as string]: `${orbitStyle.markerSize}px`,
                          pointerEvents:
                            selectedPlanet === null ? "auto" : "none",
                          outline:
                            focusedPlanet === index
                              ? "1px solid #ffd2a6"
                              : undefined,
                          outlineOffset: focusedPlanet === index ? 6 : undefined,
                          borderRadius:
                            focusedPlanet === index ? "50%" : undefined,
                        }}
                        data-planet-index={index}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open ${planet.name} system`}
                        aria-pressed={selectedPlanet === index}
                        onMouseEnter={() => {
                          setHoveredPlanet(index);
                          setActivePanel(planet.panel);
                        }}
                        onMouseLeave={() => setHoveredPlanet(null)}
                        onFocus={() => {
                          setFocusedPlanet(index);
                          setHoveredPlanet(index);
                          setActivePanel(planet.panel);
                        }}
                        onBlur={() => {
                          setFocusedPlanet(null);
                          setHoveredPlanet(null);
                        }}
                        onClick={() => openPlanetSystem(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openPlanetSystem(index);
                          }
                        }}
                      >
                        <span
                          className="homepage-story-signal-planet-pulse"
                          aria-hidden="true"
                          style={STORY_INLINE_STYLES.planetPulse}
                        />
                        <Box
                          className="homepage-story-signal-planet"
                          style={{
                            ...STORY_INLINE_STYLES.planet,
                            background: orbitStyle.color,
                            boxShadow:
                              index === 3
                                ? "0 0 10px rgba(255, 119, 0, 0.95)"
                                : undefined,
                          }}
                          role="img"
                          aria-label={planet.name}
                        />
                        <span
                          className="homepage-story-signal-planet-label-anchor"
                          data-planet-angle={orbitStyle.angle}
                          style={STORY_INLINE_STYLES.planetLabelAnchor}
                        >
                          <span
                            className="homepage-story-signal-planet-label"
                            style={{
                              ...STORY_INLINE_STYLES.planetLabel,
                              bottom: orbitStyle.radius + 6,
                            }}
                          >
                            {planet.name}
                          </span>
                        </span>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              {selectedPlanet === null && (
                <Box
                  ref={previewRef}
                  className="homepage-story-planet-preview"
                  style={{
                    ...STORY_INLINE_STYLES.preview,
                    ...(isMobile
                      ? {
                          top: 12,
                          left: 12,
                          width: "min(220px, 52%)",
                          maxWidth: "calc(100% - 24px)",
                          padding: "9px 10px",
                        }
                      : {}),
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span
                    className="homepage-story-planet-preview-kicker"
                    style={STORY_INLINE_STYLES.previewKicker}
                  >
                    PLANET PREVIEW / {activePreviewIndex === null ? "READY" : String(activePreviewIndex + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="homepage-story-planet-preview-copy"
                    style={{
                      ...STORY_INLINE_STYLES.previewCopy,
                      fontSize: 9,
                    }}
                  >
                    {previewText}
                  </span>
                </Box>
              )}
              {selectedPlanet !== null && (
                <GalaxyFocus
                  planetIndex={selectedPlanet}
                  activePanel={activePanel}
                  isMobile={isMobile}
                  onClose={() => {
                    setSelectedPlanet(null);
                    setHoveredPlanet(null);
                  }}
                />
              )}
              <Stack
                gap={4}
                style={STORY_INLINE_STYLES.instructions}
              >
                <Text
                  className="homepage-story-instruction"
                  style={STORY_INLINE_STYLES.instruction}
                >
                  <GsapShufflePrompt />
                </Text>
                <Text size="xs" c="dimmed" ff="DotGothic16">
                  ORBITAL SYSTEM / ACTIVE
                </Text>
                <Text
                  className="homepage-story-signal-speed"
                  size="xs"
                  c="orange.3"
                  ff="DotGothic16"
                >
                  ROTATION // GALAXY 72s · MOONS 48–92s
                </Text>
              </Stack>
              <Text
                ff="DotGothic16"
                style={STORY_INLINE_STYLES.statusCorner}
              >
                26°
              </Text>
            </Box>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
