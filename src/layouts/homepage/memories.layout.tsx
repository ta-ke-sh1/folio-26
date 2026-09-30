import type { RefObject } from "react";
import { Badge, Box, Group, Stack, Text, Title } from "@mantine/core";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";

type MemoriesLayoutProps = {
  videos: readonly string[];
  words: readonly string[];
  activeSection: number;
  showIndicator: boolean;
  dynamicWordRef: RefObject<HTMLSpanElement | null>;
  fixedTitleRef: RefObject<HTMLDivElement | null>;
  setVideoRef: (index: number, element: HTMLVideoElement | null) => void;
  onVideoLoaded: (index: number) => void;
};

export default function MemoriesLayout({
  videos,
  words,
  activeSection,
  showIndicator,
  dynamicWordRef,
  fixedTitleRef,
  setVideoRef,
  onVideoLoaded,
}: MemoriesLayoutProps) {
  const scrollToSection = (index: number) => {
    document
      .querySelector(`.scroll-section-${index}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Box
        className="homepage-hud"
        style={{
          position: "fixed",
          right: "32px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "16px",
          pointerEvents: showIndicator ? "auto" : "none",
          opacity: showIndicator ? 1 : 0,
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {words.map((word, index) => {
          const isActive = activeSection === index;
          return (
            <Group
              key={word}
              gap="xs"
              data-cursor="pointer"
              onClick={() => scrollToSection(index)}
              style={{
                userSelect: "none",
                transition: "all 0.3s ease",
              }}
            >
              <Text
                fz="xs"
                fw={700}
                style={{
                  fontFamily: "DotGothic16",
                  letterSpacing: "1px",
                  color: isActive
                    ? "var(--mantine-color-orange-5, #ff5500)"
                    : "rgba(255, 255, 255, 0.3)",
                  transition: "color 0.3s ease, transform 0.3s ease",
                  transform: isActive ? "translateX(0)" : "translateX(8px)",
                }}
              >
                0{index + 1} // {word}
              </Text>
              <Box
                style={{
                  width: isActive ? "28px" : "12px",
                  height: "2px",
                  backgroundColor: isActive
                    ? "var(--mantine-color-orange-5, #ff5500)"
                    : "rgba(255, 255, 255, 0.2)",
                  boxShadow: isActive
                    ? "0 0 8px rgba(255, 85, 0, 0.8)"
                    : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </Group>
          );
        })}
      </Box>

      <Box
        className="homepage-video-stack"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: videos.length + 1,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        />
        {videos.map((src, index) => (
          <video
            key={src}
            ref={(element) => setVideoRef(index, element)}
            loop
            muted
            playsInline
            onLoadedData={() => onVideoLoaded(index)}
            src={src}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100dvw",
              height: "100dvh",
              objectFit: "cover",
              zIndex: index + 1,
              opacity: 1,
              willChange: "transform",
            }}
          />
        ))}
      </Box>

      <Box
        ref={fixedTitleRef}
        className="homepage-fixed-title"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <Stack justify="center" align="center">
          <Title
            className="homepage-hero-title"
            style={{
              maxWidth: 850,
              textAlign: "center",
              lineHeight: "86px",
              fontWeight: 800,
              fontSize: 96,
              letterSpacing: -3,
              fontFamily: "Plus Jakarta Sans Variable",
              color: "var(--folio-media-text)",
            }}
          >
            A DEVELOPER STASH OF <br />
            <span
              ref={dynamicWordRef}
              style={{
                display: "inline-block",
                fontFamily: '"DotGothic16", sans-serif',
                color: "var(--mantine-color-orange-5, #ff5500)",
                minWidth: "350px",
                textAlign: "left",
              }}
            >
              {words[0]}
            </span>
          </Title>
          <Badge
            size="xl"
            variant="outline"
            style={{
              marginTop: 24,
              color: "var(--folio-media-text)",
              borderColor: "var(--folio-media-line)",
              fontFamily: "DotGothic16",
              fontWeight: 200,
            }}
          >
            <BilingualShuffle english="SCROLL DOWN" japanese="下へスクロール" />
          </Badge>
        </Stack>
      </Box>

      <Box style={{ position: "relative", zIndex: 3 }}>
        <LayoutWrapper>
          {words.map((_, index) => (
            <Group
              key={index}
              className={`scroll-section-${index} homepage-embedded-scroll-section`}
              style={{ minHeight: "100vh" }}
            />
          ))}
        </LayoutWrapper>
      </Box>
    </>
  );
}
