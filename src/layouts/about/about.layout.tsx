import { useState, useEffect, useRef } from "react";
import { Box, Group, Stack, Title, Text, Grid } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import gsap from "gsap";
import {
  type InteractiveItem,
  DraggableWindow,
} from "../../components/modals/draggableWindow.modal";
import {
  DraggableFormWindow,
  type FormWindowItem,
} from "../../components/modals/draggableForm.modal";
import { FORM_TYPES, ITEMS } from "./about.type";
import TriggerCard from "../../components/card/trigger.card";
import "./about.layout.scss";
import GradientBlinds from "../../components/background/gradientBlinds";
import JapaneseSignal from "../../components/background/japanese.signal";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";
import { ShuffleButton } from "../../components/animations/shuffle.button";
import Footer from "../../components/footer/footer";
import LandingPage from "../homepage/main.layout";
import { TechnologySection } from "../homepage/technology.section";

const ABOUT_GRADIENT_COLORS = ["#F97316", "#EAB308"];

// --- MAIN PAGE COMPONENT ---
export default function AboutPage() {
  const [openForms, setOpenForms] = useState<FormWindowItem[]>([]);
  const [focusedFormId, setFocusedFormId] = useState<string | null>(null);

  const [openWindows, setOpenWindows] = useState<InteractiveItem[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [topZIndex, setTopZIndex] = useState<number>(1000);
  const [zIndices, setZIndices] = useState<Record<string, number>>({});
  const [closingWindowIds, setClosingWindowIds] = useState<string[]>([]);
  const [closingFormIds, setClosingFormIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeAllControlRef = useRef<HTMLDivElement>(null);
  const hasOpenItems = openWindows.length + openForms.length > 0;

  useEffect(
    () => () => {
      if (closeAllControlRef.current) {
        gsap.killTweensOf(closeAllControlRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const control = closeAllControlRef.current;
    if (!control) return;
    gsap.killTweensOf(control);

    if (hasOpenItems) {
      control.style.pointerEvents = "auto";
      gsap.set(control, { xPercent: -50, y: 88, autoAlpha: 0 });
      gsap.to(control, {
        xPercent: -50,
        y: 0,
        autoAlpha: 1,
        duration: 0.55,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    } else {
      gsap.to(control, {
        xPercent: -50,
        y: 88,
        autoAlpha: 0,
        duration: 0.36,
        ease: "power3.in",
        overwrite: "auto",
        onComplete: () => {
          control.style.pointerEvents = "none";
        },
      });
    }
  }, [hasOpenItems]);

  // Bring specified window to the front layer
  const bringToFront = (id: string) => {
    setFocusedWindowId(id);
    setFocusedFormId(id);
    setTopZIndex((prevZ) => {
      const nextZ = prevZ + 1;
      setZIndices((prevMap) => ({ ...prevMap, [id]: nextZ }));
      return nextZ;
    });
  };

  const handleToggleWindow = (item: InteractiveItem) => {
    const isOpen = openWindows.some((w) => w.id === item.id);

    if (isOpen) {
      if (focusedWindowId === item.id) {
        requestCloseWindow(item.id);
      } else {
        bringToFront(item.id);
      }
    } else {
      setOpenWindows((prev) => [...prev, item]);
      bringToFront(item.id);
    }
  };

  const requestCloseWindow = (id: string) => {
    setClosingWindowIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    window.setTimeout(() => {
      setOpenWindows((prev) => prev.filter((w) => w.id !== id));
      setClosingWindowIds((prev) =>
        prev.filter((closingId) => closingId !== id),
      );
      if (focusedWindowId === id) setFocusedWindowId(null);
    }, 260);
  };

  const handleToggleForm = (item: FormWindowItem) => {
    const isOpen = openForms.some((f) => f.id === item.id);

    if (isOpen) {
      if (focusedFormId === item.id) {
        requestCloseForm(item.id);
      } else {
        bringToFront(item.id);
      }
    } else {
      setOpenForms((prev) => [...prev, item]);
      bringToFront(item.id);
    }
  };

  const requestCloseForm = (id: string) => {
    setClosingFormIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    window.setTimeout(() => {
      setOpenForms((prev) => prev.filter((f) => f.id !== id));
      setClosingFormIds((prev) => prev.filter((closingId) => closingId !== id));
      if (focusedFormId === id) setFocusedFormId(null);
    }, 260);
  };

  const requestCloseAll = () => {
    openWindows.forEach((item) => {
      if (!closingWindowIds.includes(item.id)) requestCloseWindow(item.id);
    });
    openForms.forEach((item) => {
      if (!closingFormIds.includes(item.id)) requestCloseForm(item.id);
    });
  };

  // Keyboard shortcut listener: pressing Escape closes the currently focused top window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (focusedWindowId) {
          requestCloseWindow(focusedWindowId);
        } else if (focusedFormId) {
          requestCloseForm(focusedFormId);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedWindowId, focusedFormId]);

  return (
    <Stack
      className="about-page"
      pt={60}
      pb={60}
      style={{
        height: "100dvh",
        position: "relative",
        overflowX: "hidden",
        overflowY: "hidden",
        borderRadius: 10,
      }}
    >
      <div
        ref={closeAllControlRef}
        className="about-close-all-control"
        style={{
          position: "absolute",
          zIndex: 2_147_483_647,
          bottom: 56,
          left: "50%",
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden={!hasOpenItems}
      >
        <ShuffleButton
          style={{
            border: "1px solid rgba(255, 190, 135, 0.65)",
            background:
              "linear-gradient(135deg, rgba(255, 149, 64, 0.34), rgba(30, 24, 20, 0.58))",
            color: "#fff4e8",
            boxShadow:
              "0 8px 28px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
            backdropFilter: "blur(16px) saturate(145%)",
            WebkitBackdropFilter: "blur(16px) saturate(145%)",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
          leftSection={<IconX size={14} />}
          onClick={requestCloseAll}
          size="sm"
          variant="default"
          aria-label="Close all open windows and forms"
          disabled={!hasOpenItems}
          tabIndex={hasOpenItems ? 0 : -1}
        >
          CLOSE ALL
        </ShuffleButton>
      </div>
      <Stack
        className="about-page__stage"
        ref={containerRef}
        ml="lg"
        mr="lg"
        pl="xl"
        pr="xl"
        style={{
          border: "1px solid var(--folio-border)",
          height: "100%",
          position: "relative",
          backgroundColor: "var(--folio-page-bg)",
          overflowX: "hidden",
          borderRadius: 10,
          overflow: 'hidden'
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none", // Ensures the gradient blinds don't block interactions with underlying elements
            zIndex: 0, // Ensures the gradient blinds stay behind other content
          }}
        >
          <GradientBlinds
            gradientColors={ABOUT_GRADIENT_COLORS}
            angle={252}
            noise={0.78}
            blindCount={34}
            blindMinWidth={20}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.06}
            distortAmount={2}
            shineDirection="left"
            mixBlendMode="lighten"
            color1="#F97316"
            color2="#EAB308"
          />
        </Box>

        <Grid
          align="stretch"
          gap="xl"
          styles={{
            inner: {
              height: "100%", // Ensures Mantine's internal grid container takes full height
            },
          }}
          style={{
            marginTop: "0px",
            height: "100%",
            zIndex: 1,
            position: "relative",
          }}
        >
          {/* Left Column: Hero Headers & Interactive Form Cards */}
          <Grid.Col
            className="about-story-column"
            span={{ base: 12, md: 7, lg: 6 }}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Stack
              className="about-story-layout"
              justify="space-between"
              pb="25"
              style={{
                flex: 1,
                height: "100%",
              }}
            >
              <Stack pt="25" gap={5}>
                <Text
                  style={{
                    fontFamily: "monospace",
                  }}
                >
                  <BilingualShuffle english="[ Story ]" japanese="[ 物語 ]" />
                </Text>
                <Group justify="space-between">
                  <Box className="vhs-title-container">
                    <Title
                      className="vhs-title"
                      data-text="A back-end developer with a twist of artistic ideas running through his veins."
                      style={{
                        fontSize: "clamp(24px, 6vw, 44px)",
                        fontWeight: 400,
                        color: "var(--folio-text)",
                        letterSpacing: "-1.5px",
                        lineHeight: 1.1,
                        maxWidth: "600px",
                      }}
                    >
                      A back-end developer with a twist of artistic ideas
                      running through his veins.
                    </Title>
                  </Box>
                </Group>

                <Group justify="left" mt="md">
                  <Box className="vhs-title-container">
                    <Text
                      className="vhs-title"
                      data-text="Currently working full-time at Toshiba Software Development Vietnam"
                      style={{
                        fontSize: "clamp(12px, 3.5vw, 15px)",
                        fontWeight: 400,
                        color: "var(--folio-text)",
                        fontFamily: "monospace",
                        letterSpacing: "-1px",
                        lineHeight: 1.4,
                        textShadow: "0 0 12px rgba(255, 119, 0, 0.6)",
                        maxWidth: "340px",
                      }}
                    >
                      Currently working full-time at Toshiba Software
                      Development Vietnam.
                    </Text>
                  </Box>
                </Group>
                <JapaneseSignal
                  channel="about"
                  variant="minimal"
                  className="section-japanese-signal--center"
                />
              </Stack>

              {/* Form Trigger Cards */}
              <Stack className="about-desktop-contacts" gap={5}>
                <Group justify="start" mr={5}>
                  <Text
                    style={{
                      fontFamily: "monospace",
                    }}
                  >
                    <BilingualShuffle
                      english="[ Contacts ]"
                      japanese="[ 連絡先 ]"
                    />
                  </Text>
                </Group>
                <Group gap="md" wrap="wrap">
                  {FORM_TYPES.map((item) => {
                    const isOpen = openForms.some((f) => f.id === item.id);
                    const isFocused = focusedFormId === item.id;
                    const labelText =
                      item.id === "collaboration"
                        ? "COLLABORATION"
                        : item.id === "say-hi"
                          ? "SAY HI"
                          : "EMAIL ME";
                    return (
                      <TriggerCard
                        key={item.id}
                        category="SYS_FORM"
                        label={labelText}
                        icon={item.icon}
                        isOpen={isOpen}
                        isFocused={isFocused}
                        onClick={() => handleToggleForm(item)}
                        flex="1 1 180px"
                        maxWidth="240px"
                      />
                    );
                  })}
                </Group>
              </Stack>
            </Stack>

            <section
              className="about-mobile-controls"
              aria-label="Contacts and information"
            >
              <Text className="about-mobile-controls__heading">
                <BilingualShuffle
                  english="[ CONTACTS // PERSONAL INFO ]"
                  japanese="[ 連絡先 // 個人情報 ]"
                />
              </Text>
              <Box className="about-mobile-controls__grid">
                {FORM_TYPES.map((item) => {
                  const isOpen = openForms.some((form) => form.id === item.id);
                  return (
                    <TriggerCard
                      key={item.id}
                      className="about-mobile-controls__card"
                      category="SYS_FORM"
                      label={
                        item.id === "collaboration"
                          ? "COLLABORATION"
                          : item.id === "say-hi"
                            ? "SAY HI"
                            : "EMAIL ME"
                      }
                      icon={item.icon}
                      isOpen={isOpen}
                      isFocused={focusedFormId === item.id}
                      onClick={() => handleToggleForm(item)}
                    />
                  );
                })}
                {ITEMS.map((item) => {
                  const isOpen = openWindows.some(
                    (windowItem) => windowItem.id === item.id,
                  );
                  return (
                    <TriggerCard
                      key={item.id}
                      className="about-mobile-controls__card"
                      category={item.category}
                      label={item.label}
                      icon={item.icon}
                      appIconUrl={item.appIconUrl}
                      isOpen={isOpen}
                      isFocused={focusedWindowId === item.id}
                      onClick={() => handleToggleWindow(item)}
                    />
                  );
                })}
              </Box>
            </section>
          </Grid.Col>

          {/* Right Column: Interactive Deck Trigger Cards */}
          <Grid.Col
            className="about-information-column"
            span={{ base: 12, md: 5, lg: 6 }}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Stack
              gap={5}
              justify="flex-end"
              style={{
                flex: 1,
                height: "100%",
              }}
            >
              <Group justify="end" mr={5}>
                <Text
                  style={{
                    fontFamily: "monospace",
                  }}
                >
                  [ Personal Information ]
                </Text>
              </Group>

              <Grid gap="xs" mb="25">
                {ITEMS.map((item) => {
                  const isOpen = openWindows.some((w) => w.id === item.id);
                  const isFocused = focusedWindowId === item.id;
                  return (
                    <Grid.Col key={item.id}>
                      <Group justify="end">
                        <TriggerCard
                          category={item.category}
                          label={item.label}
                          icon={item.icon}
                          appIconUrl={item.appIconUrl}
                          isOpen={isOpen}
                          isFocused={isFocused}
                          onClick={() => handleToggleWindow(item)}
                          width="240px"
                        />
                      </Group>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Multi-Window Render Area */}
        {openWindows.map((item) => {
          const itemIndex = ITEMS.findIndex((i) => i.id === item.id);
          const zIndex = zIndices[item.id] || 1000;
          return (
            <DraggableWindow
              key={item.id}
              item={item}
              itemIndex={itemIndex}
              zIndex={zIndex}
              containerRef={containerRef}
              isClosing={closingWindowIds.includes(item.id)}
              onClose={() => requestCloseWindow(item.id)}
              onFocus={() => bringToFront(item.id)}
            >
              {item.id === "footer" ? (
                <Footer compact={true} />
              ) : item.id === "story" ? (
                <LandingPage embedded />
              ) : item.id === "techonology" ? (
                <TechnologySection embedded />
              ) : null}
            </DraggableWindow>
          );
        })}

        {/* Multi-Window Render Area for Forms */}
        {openForms.map((item, index) => {
          const zIndex = zIndices[item.id] || 1000;

          return (
            <DraggableFormWindow
              key={item.id}
              item={item}
              itemIndex={index}
              zIndex={zIndex}
              containerRef={containerRef}
              isClosing={closingFormIds.includes(item.id)}
              onClose={() => requestCloseForm(item.id)}
              onFocus={() => bringToFront(item.id)}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
