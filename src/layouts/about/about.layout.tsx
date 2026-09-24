import { useState, useEffect, useRef } from "react";
import { Box, Group, Stack, Title, Text, Grid } from "@mantine/core";
import {
  type InteractiveItem,
  DraggableWindow,
} from "../../components/modals/draggableWindow.modal";
import {
  DraggableFormWindow,
  type FormWindowItem,
} from "../../components/modals/draggableForm.modal";
import AsciiWaveBackground from "./background/ascii.background";
import { FORM_TYPES, ITEMS } from "./about.type";
import TriggerCard from "../../components/card/trigger.card";
import "./about.layout.scss";

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
      setClosingWindowIds((prev) => prev.filter((closingId) => closingId !== id));
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
        borderRadius: 10,
      }}
    >
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
        }}
      >
        <AsciiWaveBackground />

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
                  [ Story ]
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
              </Stack>

              {/* Form Trigger Cards */}
              <Stack className="about-desktop-contacts" gap={5}>
                <Group justify="start" mr={5}>
                  <Text
                    style={{
                      fontFamily: "monospace",
                    }}
                  >
                    [ Contacts ]
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

            <section className="about-mobile-controls" aria-label="Contacts and information">
              <Text className="about-mobile-controls__heading">
                [ CONTACTS // PERSONAL INFO ]
              </Text>
              <div className="about-mobile-controls__grid">
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
                  const isOpen = openWindows.some((windowItem) => windowItem.id === item.id);
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
              </div>
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
            />
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
