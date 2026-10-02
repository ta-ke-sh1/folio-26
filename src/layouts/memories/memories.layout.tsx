import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ActionIcon, Box, Flex, Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { IconArrowDown, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { useTextShuffle } from "../../components/animations/use-text-shuffle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Footer from "../../components/footer/footer";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import CatchphraseCard from "../../components/card/catchphrase.card";
import CyberpunkBackdrop from "../../components/background/cyberpunk.backdrop";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_REELS = [
  { src: "/videos/1.mp4", title: "FIELD TAPE", number: "01", note: "A MOMENT IN MOTION", location: "TOKYO, JAPAN" },
  { src: "/videos/2.mp4", title: "AFTERIMAGE", number: "02", note: "FRAMES FROM THE ARCHIVE", location: "ON THE ROAD" },
  { src: "/videos/3.mp4", title: "LIGHT / PLACE", number: "03", note: "A STUDY IN REMEMBERING", location: "SOMEWHERE, ALWAYS" },
] as const;

function ShuffleValue({ text }: { text: string }) {
  const { displayText, start, stop } = useTextShuffle(text);
  const previousText = useRef(text);

  useLayoutEffect(() => {
    if (previousText.current === text) return;
    previousText.current = text;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    start();
    return stop;
  }, [start, stop, text]);

  return <span aria-hidden="true">{displayText}</span>;
}

export default function MemoriesLayout() {
  const theme = useMantineTheme();
  const lenisSyncRef = useRef<(scrollPosition: number) => void>(() => undefined);
  useLenis((instance) => lenisSyncRef.current(instance.scroll), []);
  const pageRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const hudContentRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [isMetadataVisible, setIsMetadataVisible] = useState(true);
  const currentReel = VIDEO_REELS[activeIndex] ?? VIDEO_REELS[0];

  const activateReel = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    videoRefs.current.forEach((video, videoIndex) => {
      if (!video) return;
      if (videoIndex === index) void video.play().catch(() => undefined);
      else video.pause();
    });
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const context = gsap.context(() => {
      const reels = reelRefs.current.filter((reel): reel is HTMLElement => Boolean(reel));
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      reels.forEach((reel, index) => {
        const video = videoRefs.current[index];

        if (!reduceMotion && index > 0 && video) {
          gsap.fromTo(
            video,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: reel,
                start: "top bottom",
                end: "top top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        ScrollTrigger.create({
          trigger: reel,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => activateReel(index),
          onEnterBack: () => activateReel(index),
        });
      });

    }, page);

    const syncPagePosition = (scrollPosition = window.scrollY) => {
      ScrollTrigger.update();
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableDistance > 0 ? scrollPosition / scrollableDistance : 0;
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleY: Math.max(progress, 0.012) });
      }
      if (progressLabelRef.current) {
        progressLabelRef.current.textContent = `${Math.round(progress * 100).toString().padStart(2, "0")}%`;
      }
      const lastReel = reelRefs.current[VIDEO_REELS.length - 1];
      if (lastReel) setIsHudVisible(lastReel.getBoundingClientRect().bottom > 120);

      const viewportCenter = window.innerHeight * 0.55;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      reelRefs.current.forEach((reel, index) => {
        if (!reel) return;
        const rect = reel.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      if (activeIndexRef.current !== closestIndex) activateReel(closestIndex);
    };
    lenisSyncRef.current = syncPagePosition;
    const refresh = () => {
      ScrollTrigger.refresh();
      syncPagePosition();
    };
    const onWindowScroll = () => syncPagePosition();

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("resize", refresh);
    requestAnimationFrame(refresh);
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("resize", refresh);
      lenisSyncRef.current = () => undefined;
      context.revert();
    };
  }, [activateReel]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = nextMuted;
    });
    document.dispatchEvent(
      new CustomEvent("folio-sound-change", { detail: { enabled: !nextMuted } }),
    );
  };

  return (
    <LayoutWrapper>
      <Box ref={pageRef} style={{ position: "relative", background: "var(--folio-page-bg)" }}>
        <Box
          component="main"
          aria-label="Memories video archive"
          style={{
            paddingTop: "calc(40px / var(--folio-viewport-scale, 1))",
            background: "var(--folio-page-bg)",
          }}
        >
          <style>{`
            .memories-current-title { font-size: clamp(34px, 10vw, 56px); }
            @media (min-width: ${theme.breakpoints.xs}) {
              .memories-current-title { font-size: clamp(48px, 10vw, 78px); }
            }
            @media (min-width: ${theme.breakpoints.sm}) {
              .memories-current-title { font-size: clamp(68px, 9vw, 112px); }
            }
            @media (min-width: ${theme.breakpoints.md}) {
              .memories-current-title { font-size: clamp(84px, 10vw, 148px); }
            }
          `}</style>
          <Box
            aria-hidden="true"
            style={{
              position: "fixed",
              top: "calc(40px / var(--folio-viewport-scale, 1))",
              left: 0,
              right: 0,
              height: "calc((100dvh - 40px) / var(--folio-viewport-scale, 1))",
              minHeight: 480,
              zIndex: 0,
              overflow: "hidden",
              background: "#050505",
              visibility: "visible",
              opacity: 1,
              transition: "opacity 200ms ease",
            }}
          >
            {VIDEO_REELS.map((reel, index) => (
              <Box
                key={reel.src}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: activeIndex === index ? 1 : 0,
                  transition: "opacity 700ms ease",
                }}
              >
                <video
                  ref={(node) => { videoRefs.current[index] = node; }}
                  src={reel.src}
                  muted={isMuted}
                  playsInline
                  loop
                  preload={index === 0 ? "auto" : "metadata"}
                  autoPlay={index === 0}
                  aria-label={`${reel.title}: ${reel.note}`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "saturate(.82) contrast(1.04)",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: "linear-gradient(180deg, rgba(0,0,0,.26), transparent 28%, rgba(0,0,0,.08) 55%, rgba(0,0,0,.72))",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.045)",
                  }}
                />
              </Box>
            ))}
            <CyberpunkBackdrop variant="memories" layer={1} />
          </Box>
          <Box
            component="aside"
            aria-label="Current memory"
            style={{
              position: "fixed",
              top: "calc(40px / var(--folio-viewport-scale, 1))",
              left: 0,
              right: 0,
              zIndex: 5,
              height: "calc((100dvh - 40px) / var(--folio-viewport-scale, 1))",
              pointerEvents: "none",
              color: "white",
              visibility: isHudVisible && isMetadataVisible ? "visible" : "hidden",
              opacity: isHudVisible && isMetadataVisible ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          >
            <Flex
              justify="space-between"
              align="center"
              style={{ position: "absolute", inset: "22px 26px auto" }}
            >
              <Text aria-label={currentReel.location} size="9px" fw={700} c="white" style={{ fontFamily: "DM Mono, monospace", letterSpacing: ".14em" }}>
                <ShuffleValue text={currentReel.location} />
              </Text>
              <Group gap="sm">
                <Text aria-label={`${currentReel.number} / ${String(VIDEO_REELS.length).padStart(2, "0")}`} size="9px" fw={700} c="white" style={{ fontFamily: "DM Mono, monospace", letterSpacing: ".14em" }}>
                  <ShuffleValue text={`${currentReel.number} / ${String(VIDEO_REELS.length).padStart(2, "0")}`} />
                </Text>
                <ActionIcon
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute videos" : "Mute videos"}
                  variant="outline"
                  color="white"
                  radius={2}
                  size="md"
                  style={{ pointerEvents: "auto" }}
                >
                  {isMuted ? <IconVolumeOff size={16} /> : <IconVolume size={16} />}
                </ActionIcon>
              </Group>
            </Flex>

            <Stack
              ref={hudContentRef}
              gap={8}
              style={{
                position: "absolute",
                left: "clamp(28px, 5vw, 76px)",
                right: "clamp(28px, 5vw, 76px)",
                bottom: "clamp(68px, 9vh, 96px)",
              }}
            >
              <Text aria-label={currentReel.note} size="10px" fw={700} c="white" style={{ fontFamily: "DM Mono, monospace", letterSpacing: ".16em" }}>
                <ShuffleValue text={currentReel.note} />
              </Text>
              <Flex justify="space-between" align="flex-end" gap="md" wrap="wrap">
                <Title
                  order={2}
                  className="memories-current-title"
                  aria-label={currentReel.title}
                  style={{
                    maxWidth: "100%",
                    margin: 0,
                    color: "#fff",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-.085em",
                    lineHeight: .76,
                    textTransform: "uppercase",
                    textShadow: "0 2px 26px rgba(0,0,0,.18)",
                  }}
                >
                  <ShuffleValue text={currentReel.title} />
                </Title>
              </Flex>
              <Flex
                aria-hidden="true"
                align="center"
                gap={8}
                style={{ color: "rgba(255,255,255,.72)" }}
              >
                <Text size="9px" c="white" style={{ fontFamily: "DM Mono, monospace", letterSpacing: ".1em" }}>
                  SCROLL TO EXPLORE
                </Text>
                <IconArrowDown size={13} />
              </Flex>
            </Stack>
          </Box>

          {VIDEO_REELS.map((reel, index) => (
            <Box
              key={reel.src}
              ref={(node) => { reelRefs.current[index] = node; }}
              component="section"
              aria-label={`${reel.title}, ${reel.note}`}
              style={{
                position: "relative",
                width: "100%",
                height: index < VIDEO_REELS.length - 1
                  ? "calc((100dvh - 40px) / var(--folio-viewport-scale, 1) + 100px)"
                  : "calc((100dvh - 40px) / var(--folio-viewport-scale, 1))",
                minHeight: index < VIDEO_REELS.length - 1 ? 580 : 480,
                isolation: "isolate",
                pointerEvents: "none",
              }}
            />
          ))}
        </Box>
        <Box ref={nextSectionRef} style={{ position: "relative", zIndex: 6 }}>
          <CatchphraseCard embedded={true} contents={
            <Text size="lg" c="white" style={{ fontFamily: "DM Mono, monospace", letterSpacing: ".1em" }}>
              A STASH OF DREAMS
            </Text>
          } />
        </Box>
        <Footer />

        <Flex
          component="aside"
          aria-label="Page scroll position"
          direction="column"
          align="center"
          gap={8}
          style={{
            position: "fixed",
            zIndex: 2,
            top: "50%",
            right: 12,
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "white",
            mixBlendMode: "difference",
          }}
        >
          <Text size="8px" fw={700} style={{ fontFamily: "DM Mono, monospace", writingMode: "vertical-rl", letterSpacing: ".12em" }}>
            <span ref={progressLabelRef}>00%</span>
          </Text>
          <Box style={{ position: "relative", width: 2, height: 128, overflow: "hidden", background: "rgba(255,255,255,.3)" }}>
            <Box ref={progressRef} style={{ position: "absolute", inset: 0, transform: "scaleY(.012)", transformOrigin: "top", background: "white" }} />
          </Box>
          <Text size="8px" fw={700} style={{ fontFamily: "DM Mono, monospace", writingMode: "vertical-rl", letterSpacing: ".12em" }}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(VIDEO_REELS.length).padStart(2, "0")}
          </Text>
        </Flex>
      </Box>
    </LayoutWrapper>
  );
}
