import { useEffect, useRef } from "react";
import {
  Title,
  Group,
  Stack,
  Box,
  Badge,
  Text,
  SimpleGrid,
  ThemeIcon,
  Container,
  Grid,
} from "@mantine/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/footer/footer";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import { Story } from "./story.section";

gsap.registerPlugin(ScrollTrigger);

const VIDEOS = ["/videos/1.mov", "/videos/2.mov", "/videos/3.mov"];
const WORDS = ["VISIONS", "DREAMS", "ESCAPES"];
const CHARS = "ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";

export default function AsciiLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dynamicWordRef = useRef<HTMLSpanElement>(null);
  const fixedTitleRef = useRef<HTMLDivElement>(null);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const videoElements = videoRefs.current.filter(Boolean);

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

      // 3. Section Triggers for Header Word Swaps
      ScrollTrigger.create({
        trigger: ".scroll-section-1",
        start: "top center",
        onEnter: () => scrambleText(WORDS[1]),
        onLeaveBack: () => scrambleText(WORDS[0]),
      });

      ScrollTrigger.create({
        trigger: ".scroll-section-2",
        start: "top center",
        onEnter: () => scrambleText(WORDS[2]),
        onLeaveBack: () => scrambleText(WORDS[1]),
      });

      // 4. Fade out pinned Hero Header when reaching Story section
      gsap.to(fixedTitleRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: storySectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
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

      // 7. Story Cards Reveal
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
  }, []);

  return (
    <Box
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#020202",
      }}
    >
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
            autoPlay
            loop
            muted
            playsInline
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
            style={{
              maxWidth: 850,
              textAlign: "center",
              lineHeight: "86px",
              fontWeight: 800,
              fontSize: 96,
              letterSpacing: -3,
              fontFamily: "Plus Jakarta Sans Variable",
              color: "#ffffff",
            }}
          >
            A DEVELOPER STASH OF <br />
            <span
              ref={dynamicWordRef}
              style={{
                display: "inline-block",
                color: "var(--mantine-color-primaryOrange-6, #ff5500)",
                minWidth: "350px",
                textAlign: "left",
              }}
            >
              {WORDS[0]}
            </span>
          </Title>
          <Badge
            size="xl"
            color="white"
            variant="outline"
            style={{ marginTop: 24 }}
          >
            Scroll down
          </Badge>
        </Stack>
      </Box>

      {/* Foreground Scrolling Content Layer */}
      <Box style={{ position: "relative", zIndex: 3, color: "#fff" }}>
        <LayoutWrapper>
          {/* Video Scroll Trigger Sections */}
          <Group className="scroll-section-0" style={{ minHeight: "100vh" }} />
          <Group className="scroll-section-1" style={{ minHeight: "100vh" }} />
          <Group className="scroll-section-2" style={{ minHeight: "100vh" }} />

          {/* New Story & Approach Section (Fades in over video with top gradient fade) */}
          <Box
            ref={storySectionRef}
            pt={160}
            pb={120}
            style={{
              backgroundColor: "#020202",
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
            <Story />
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
