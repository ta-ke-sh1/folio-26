import { useEffect, useRef, useState } from "react";
import { Title, Group, Stack, Box, Badge, Text, Loader } from "@mantine/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/footer/footer";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import { CapabilitySection } from "./capability.section";
import StorySection from "./story.section";
import MemoriesSection from "./memories.section";
import { useAnimatedNavigate } from "../../components/transition/transition";
import "./main.layout.scss";

gsap.registerPlugin(ScrollTrigger);

const VIDEOS = ["/videos/1.mp4", "/videos/2.mp4", "/videos/3.mp4"];
const WORDS = ["VISIONS", "DREAMS", "ESCAPES"];
const CHARS = "ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";

export default function AsciiLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dynamicWordRef = useRef<HTMLSpanElement>(null);
  const fixedTitleRef = useRef<HTMLDivElement>(null);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const animatedNavigate = useAnimatedNavigate();

  // Active section tracker (0, 1, or 2)
  const [activeSection, setActiveSection] = useState<number>(0);
  // Controls visibility of the indicator HUD (hides when scrolling into Story Section)
  const [showIndicator, setShowIndicator] = useState<boolean>(true);

  // Asset preloading state
  const [loadedVideosCount, setLoadedVideosCount] = useState<number>(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState<boolean>(false);

  useEffect(() => {
    animatedNavigate("/");
  }, []);

  // Track video loading progress
  const handleVideoLoaded = () => {
    setLoadedVideosCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= VIDEOS.length) {
        setIsFullyLoaded(true);
      }
      return nextCount;
    });
  };

  // Initialize GSAP & start video playback ONLY after all videos are ready
  useEffect(() => {
    if (!isFullyLoaded) return;

    // Trigger video playback for preloaded elements
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {
          // Fallback if browser restricts autoplay
        });
      }
    });

    const ctx = gsap.context(() => {
      const videoElements = videoRefs.current.filter(Boolean);

      // Fade out preloader overlay
      gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = "none";
          }
        },
      });

      // 1. Cross-fade Background Videos
      videoElements.forEach((video, index) => {
        if (index === 0) return;

        const prevVideo = videoElements[index - 1];
        const sectionSelector = `.scroll-section-${index}`;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionSelector,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          })
          .to(prevVideo, { opacity: 0, ease: "none" })
          .to(video, { opacity: 1, ease: "none" }, "<");
      });

      // 2. Text Shuffle / Scramble Effect
      const scrambleText = (targetWord: string) => {
        if (!dynamicWordRef.current) return;

        const element = dynamicWordRef.current;
        const targetLength = targetWord.length;
        let iteration = 0;
        const maxIterations = 12;

        gsap.killTweensOf(element);

        const interval = setInterval(() => {
          element.innerText = targetWord
            .split("")
            .map((char, index) => {
              if (index < (iteration / maxIterations) * targetLength) {
                return targetWord[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("");

          iteration++;

          if (iteration >= maxIterations) {
            element.innerText = targetWord;
            clearInterval(interval);
          }
        }, 30);
      };

      // 3. Section Triggers for Active State & Header Word Swaps
      ScrollTrigger.create({
        trigger: ".scroll-section-0",
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(0);
            scrambleText(WORDS[0]);
          }
        },
      });

      ScrollTrigger.create({
        trigger: ".scroll-section-1",
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(1);
            scrambleText(WORDS[1]);
          }
        },
      });

      ScrollTrigger.create({
        trigger: ".scroll-section-2",
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(2);
            scrambleText(WORDS[2]);
          }
        },
      });

      // 4. Fade out pinned Hero Header & HUD when reaching Story section
      gsap.to(fixedTitleRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: storySectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
          onUpdate: (self) => {
            setShowIndicator(self.progress < 0.5);
          },
        },
      });

      // 5. Fade IN Story Section
      gsap.fromTo(
        storySectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: storySectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        },
      );

      // 6. Story Cards Reveal
      gsap.from(".story-card", {
        scrollTrigger: {
          trigger: storySectionRef.current,
          start: "top 50%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isFullyLoaded]);

  // Smooth scroll click handler for section navigation
  const scrollToSection = (index: number) => {
    const targetSection = document.querySelector(`.scroll-section-${index}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const progressPercentage = Math.round(
    (loadedVideosCount / VIDEOS.length) * 100,
  );

  return (
    <Box
      ref={containerRef}
      className="ascii-landing-page"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "var(--folio-page-bg)",
      }}
    >
      {/* --- PRELOADER OVERLAY --- */}
      <Box
        ref={preloaderRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "var(--folio-page-bg)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Stack align="center" gap="md">
          <Loader size="md" color="orange" type="dots" />
          <Text
            fz="xs"
            fw={700}
            c="orange.5"
            style={{ fontFamily: "monospace", letterSpacing: 2 }}
          >
            BUFFERING_ASSETS // {progressPercentage}%
          </Text>
          <Box
            style={{
              width: 200,
              height: 2,
              backgroundColor: "var(--mantine-color-dark-6)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              style={{
                height: "100%",
                width: `${progressPercentage}%`,
                backgroundColor: "var(--mantine-color-orange-5)",
                transition: "width 0.2s ease",
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* --- HUD SIDE NAV / SECTION INDICATOR --- */}
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
        {WORDS.map((word, idx) => {
          const isActive = activeSection === idx;
          return (
            <Group
              key={word}
              gap="xs"
              onClick={() => scrollToSection(idx)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.3s ease",
              }}
            >
              {/* Word label - appears expanded on active */}
              <Text
                fz="xs"
                fw={700}
                style={{
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                  color: isActive
                    ? "var(--mantine-color-orange-5, #ff5500)"
                    : "rgba(255, 255, 255, 0.3)",
                  transition: "color 0.3s ease, transform 0.3s ease",
                  transform: isActive ? "translateX(0)" : "translateX(8px)",
                }}
              >
                0{idx + 1} // {word}
              </Text>

              {/* Indicator Dot / Line */}
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

      {/* Background Videos Stack */}
      <Box
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
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        />

        {VIDEOS.map((src, idx) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            loop
            muted
            playsInline
            onCanPlayThrough={handleVideoLoaded}
            onLoadedData={handleVideoLoaded}
            src={src}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100dvw",
              height: "100dvh",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              opacity: idx === 0 ? 1 : 0,
              willChange: "opacity",
            }}
          />
        ))}
      </Box>

      {/* Fixed Sticky Dynamic Title */}
      <Box
        ref={fixedTitleRef}
        className="homepage-fixed-title"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          willChange: "opacity",
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
                color: "var(--mantine-color-orange-5, #ff5500)",
                minWidth: "350px",
                textAlign: "left",
              }}
            >
              {WORDS[0]}
            </span>
          </Title>
          <Badge
            size="xl"
            variant="outline"
            style={{
              marginTop: 24,
              color: "var(--folio-media-text)",
              borderColor: "var(--folio-media-line)",
              fontFamily: "monospace",
              fontWeight: 200,
            }}
          >
            SCROLL DOWN
          </Badge>
        </Stack>
      </Box>

      {/* Foreground Scrolling Content Layer */}
      <Box style={{ position: "relative", zIndex: 3, color: "var(--folio-text)" }}>
        <LayoutWrapper>
          {/* Video Scroll Trigger Sections */}
          <Group className="scroll-section-0" style={{ minHeight: "100vh" }} />
          <Group className="scroll-section-1" style={{ minHeight: "100vh" }} />
          <Group className="scroll-section-2" style={{ minHeight: "100vh" }} />

          {/* New Story & Approach Section (Fades in over video with top gradient fade) */}
          <Box
            ref={storySectionRef}
            className="homepage-content"
            pt={160}
            pb={120}
            style={{
              backgroundColor: "var(--folio-page-bg)",
              position: "relative",
              zIndex: 10,
              pointerEvents: "auto",
              opacity: 0,
              willChange: "opacity",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%)",
            }}
          >
            <StorySection />
            <CapabilitySection />
            <MemoriesSection />
          </Box>

          {/* Footer (Fades in seamlessly on top of the Story section) */}
          <Box
            ref={footerRef}
            style={{
              pointerEvents: "auto",
              position: "relative",
              zIndex: 11,
            }}
          >
            <Footer />
          </Box>
        </LayoutWrapper>
      </Box>
    </Box>
  );
}
