import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconVolumeOff,
  IconX,
} from "@tabler/icons-react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Flip from "gsap/Flip";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";
import "./memories.layout.scss";
import Footer from "../../components/footer/footer";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import { maxWidth } from "../../styles/breakpoints";

gsap.registerPlugin(Flip);

const VIDEO_REELS = [
  {
    src: "/videos/1.mp4",
    title: "FIELD TAPE // 01",
    note: "A MOMENT IN MOTION",
  },
  {
    src: "/videos/2.mp4",
    title: "FIELD TAPE // 02",
    note: "FRAMES FROM THE ARCHIVE",
  },
  {
    src: "/videos/3.mp4",
    title: "FIELD TAPE // 03",
    note: "LIGHT, PLACE, MEMORY",
  },
] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function MemoriesLayout() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const screenFrameRef = useRef<HTMLDivElement>(null);
  const fullscreenFrameRef = useRef<HTMLDivElement>(null);
  const fullscreenBackdropRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<{
    state: ReturnType<typeof Flip.getState>;
    opening: boolean;
  } | null>(null);
  const fullscreenTimeRef = useRef(0);
  const wasPlayingRef = useRef(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenMounted, setIsFullscreenMounted] = useState(false);
  const [fullscreenCloseRect, setFullscreenCloseRect] =
    useState<DOMRect | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem("folio-sound-enabled") !== "true",
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const previousActiveIndexRef = useRef(activeIndex);

  useEffect(() => {
    const handleSoundChange = (event: Event) => {
      const enabled = (event as CustomEvent<{ enabled: boolean }>).detail
        .enabled;
      setIsMuted(!enabled);
    };

    document.addEventListener("folio-sound-change", handleSoundChange);
    return () =>
      document.removeEventListener("folio-sound-change", handleSoundChange);
  }, []);

  const previousIndex =
    (activeIndex - 1 + VIDEO_REELS.length) % VIDEO_REELS.length;
  const nextIndex = (activeIndex + 1) % VIDEO_REELS.length;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (previousActiveIndexRef.current !== activeIndex) {
      previousActiveIndexRef.current = activeIndex;
      video.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);
    }
    if (isFullscreen || isFullscreenMounted) {
      video.pause();
    } else if (isPlaying) {
      void video.play().catch(() => setIsPlaying(false));
    }
  }, [activeIndex, isFullscreen, isFullscreenMounted]);

  useLayoutEffect(() => {
    if (!isFullscreenMounted) return;

    const target = fullscreenFrameRef.current;
    const backdrop = fullscreenBackdropRef.current;
    const flip = flipStateRef.current;
    if (!target || !flip) return;

    const animation = Flip.from(flip.state, {
      targets: target,
      duration: flip.opening ? 0.72 : 0.58,
      ease: "power3.inOut",
      absolute: true,
      scale: true,
      onComplete: () => {
        flipStateRef.current = null;
        if (!flip.opening) {
          const video = videoRef.current;
          if (video) {
            video.currentTime = fullscreenTimeRef.current;
            if (wasPlayingRef.current) {
              void video.play().catch(() => setIsPlaying(false));
            }
          }
          if (document.fullscreenElement) {
            void document.exitFullscreen().catch(() => undefined);
          }
          window.screen.orientation.unlock?.();
          setIsFullscreenMounted(false);
          setFullscreenCloseRect(null);
        }
      },
    });

    if (backdrop) {
      gsap.fromTo(
        backdrop,
        { autoAlpha: flip.opening ? 0 : 1 },
        {
          autoAlpha: flip.opening ? 1 : 0,
          duration: flip.opening ? 0.32 : 0.58,
          ease: "power2.out",
        },
      );
    }

    return () => {
      animation.kill();
    };
  }, [isFullscreen, isFullscreenMounted]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFullscreen();
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) closeFullscreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen]);

  const openFullscreen = () => {
    const frame = screenFrameRef.current;
    const video = videoRef.current;
    if (!frame || !video || isFullscreenMounted) return;

    flipStateRef.current = { state: Flip.getState(frame), opening: true };
    fullscreenTimeRef.current = video.currentTime;
    wasPlayingRef.current = !video.paused;
    video.pause();
    setFullscreenCloseRect(null);
    setIsFullscreenMounted(true);
    setIsFullscreen(true);

    if (document.fullscreenEnabled && !document.fullscreenElement) {
      void document.documentElement
        .requestFullscreen()
        .then(() => {
          const orientation = window.matchMedia(maxWidth("sm")).matches
            ? "portrait"
            : "landscape";
          return window.screen.orientation
            .lock(orientation)
            .catch(() => undefined);
        })
        .catch(() => undefined);
    }
  };

  function closeFullscreen() {
    const frame = fullscreenFrameRef.current;
    const sourceFrame = screenFrameRef.current;
    const video = fullscreenVideoRef.current;
    if (!frame || !sourceFrame || !isFullscreen) return;

    flipStateRef.current = { state: Flip.getState(frame), opening: false };
    setFullscreenCloseRect(sourceFrame.getBoundingClientRect());
    if (video) {
      fullscreenTimeRef.current = video.currentTime;
      wasPlayingRef.current = !video.paused;
      video.pause();
    }
    setIsPlaying(wasPlayingRef.current);
    setIsFullscreen(false);
  }

  const togglePlayback = () => {
    const video = isFullscreen ? fullscreenVideoRef.current : videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    if (videoRef.current) videoRef.current.muted = nextMuted;
    if (fullscreenVideoRef.current)
      fullscreenVideoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const seekVideo = (time: number) => {
    const activeVideo = isFullscreen
      ? fullscreenVideoRef.current
      : videoRef.current;
    if (activeVideo) activeVideo.currentTime = time;
    fullscreenTimeRef.current = time;
    setCurrentTime(time);
  };

  const selectReel = (index: number) => {
    fullscreenTimeRef.current = 0;
    wasPlayingRef.current = true;
    setCurrentTime(0);
    setIsPlaying(true);
    setActiveIndex(index);
  };

  const renderPreview = (index: number, direction: "PREVIOUS" | "NEXT") => {
    const reel = VIDEO_REELS[index];
    return (
      <button
        className="memories-preview"
        key={direction}
        type="button"
        onClick={() => selectReel(index)}
        aria-label={`Play ${direction.toLowerCase()} video: ${reel.title}`}
      >
        <Box
          component="span"
          className="memories-preview__video-wrap"
          style={{
            position: "relative",
            display: "block",
            overflow: "hidden",
            aspectRatio: "16 / 9",
          }}
        >
          <video
            className="memories-preview__video"
            src={reel.src}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              filter: "grayscale(1) contrast(1.08)",
              objectFit: "cover",
              pointerEvents: "none",
            }}
            muted
            playsInline
            preload="auto"
            onLoadedData={(event) => {
              event.currentTarget.pause();
              event.currentTarget.currentTime = 0;
            }}
            aria-hidden="true"
          />
        </Box>
        <Box component="span">
          <Box component="span" className="memories-preview__label">
            {direction} // CH_{String(index + 1).padStart(2, "0")}
          </Box>
          <Box component="span" className="memories-preview__title">
            {reel.title}
          </Box>
        </Box>
      </button>
    );
  };

  return (
    <LayoutWrapper>
      <Box
        component="main"
        className="memories-page"
        style={{
          position: "relative",
          display: "flex",
          width: "calc(100dvw / var(--folio-viewport-scale, 1))",
          minHeight: 0,
          boxSizing: "border-box",
          flexDirection: "column",
        }}
      >
        <Flex
          component="header"
          className="memories-page__header"
          style={{
            marginTop: 20,
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          <Stack gap={0}>
            <Text className="memories-page__eyebrow">
              [ PERSONAL ARCHIVE // VIDEO ]
            </Text>
            <Title order={1} className="memories-page__title">
              <BilingualShuffle
                className="memories-page__title-shuffle"
                english="MOVING MEMORIES"
                japanese="動く記憶"
              />
            </Title>
          </Stack>
          <Text className="memories-page__status">ARCHIVE SIGNAL ONLINE</Text>
        </Flex>

        <Box
          component="section"
          className="memories-console"
          aria-label="Video archive player"
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            width: "100%",
            flex: "1 1 auto",
            minHeight: 0,
            gridTemplateColumns: "minmax(0, 1fr)",
            gridTemplateRows: "minmax(0, 1fr) auto",
            alignItems: "stretch",
          }}
        >
          <Box
            className="memories-deck"
            style={{
              display: "flex",
              minWidth: 0,
              minHeight: 0,
              alignSelf: "stretch",
            }}
          >
            <Flex
              className="memories-tv"
              direction="column"
              style={{
                position: "relative",
                boxSizing: "border-box",
                width: "100%",
                minHeight: 0,
              }}
            >
              <Box
                ref={screenFrameRef}
                className="memories-tv__screen-frame"
                style={{
                  position: "relative",
                  flex: "1 1 auto",
                  minHeight: 0,
                  overflow: "hidden",
                  aspectRatio: "16 / 9",
                }}
                data-flip-id="memories-video-screen"
                role="button"
                tabIndex={0}
                aria-label="Open video fullscreen in landscape mode"
                onClick={openFullscreen}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openFullscreen();
                  }
                }}
              >
                <video
                  ref={videoRef}
                  className="memories-tv__video"
                  src={VIDEO_REELS[activeIndex].src}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "#030303",
                  }}
                  autoPlay={!isFullscreenMounted}
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => selectReel(nextIndex)}
                  onTimeUpdate={(event) =>
                    setCurrentTime(event.currentTarget.currentTime)
                  }
                  onLoadedMetadata={(event) =>
                    setDuration(event.currentTarget.duration)
                  }
                />
                <Flex
                  className="memories-tv__screen-overlay"
                  align="center"
                  style={{
                    position: "absolute",
                    right: 12,
                    bottom: 10,
                    zIndex: 1,
                    gap: 7,
                    padding: "5px 8px",
                    border: "1px solid rgba(255, 119, 0, 0.25)",
                    borderRadius: 2,
                    background: "rgba(5, 5, 5, 0.72)",
                    color: "#ffd2a6",
                    font: "700 9px monospace",
                    letterSpacing: "0.08em",
                    pointerEvents: "none",
                  }}
                >
                  <Box
                    component="span"
                    className="memories-tv__screen-light"
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--memories-orange)",
                      boxShadow: "0 0 8px var(--memories-orange)",
                    }}
                  />
                  PLAYING // {String(activeIndex + 1).padStart(2, "0")}
                  <IconMaximize size={13} />
                </Flex>
              </Box>
              <Flex
                className="memories-tv__bezel"
                align="center"
                justify="space-between"
              >
                <Box component="span" className="memories-tv__brand">
                  FOLIO / CRT-26
                </Box>
                <Group className="memories-tv__bezel-right" gap={14} align="center">
                  <Box
                    component="span"
                    className="memories-tv__channel"
                    style={{ color: "#8f8980", fontSize: 8 }}
                  >
                    CH {String(activeIndex + 1).padStart(2, "0")}
                  </Box>
                  <Box
                    component="span"
                    className="memories-tv__led"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#40c057",
                      boxShadow: "0 0 7px rgba(64, 192, 87, 0.8)",
                    }}
                  />
                </Group>
              </Flex>
            </Flex>
          </Box>

          <Box
            component="aside"
            className="memories-controller"
            style={{
              boxSizing: "border-box",
              minHeight: 0,
              alignSelf: "stretch",
            }}
            aria-label="TV controller"
          >
            <Box
              className="memories-controller__station"
              style={{
                display: "grid",
                minWidth: 0,
                gridTemplateRows: "auto minmax(0, 1fr)",
                gap: 6,
              }}
            >
              <Flex className="memories-controller__heading" align="center">
                <Text className="memories-controller__eyebrow">REMOTE / 01</Text>
                <Text className="memories-controller__readout">POWER: ON</Text>
                <Group className="memories-controller__volume" gap={0}>
                  <button
                    className="memories-controller__button"
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <IconVolumeOff size={17} />
                    ) : (
                      <IconVolume size={17} />
                    )}
                  </button>
                </Group>
              </Flex>

              <Box
                className="memories-controller__current"
                style={{
                  display: "grid",
                  minWidth: 0,
                  alignContent: "center",
                }}
              >
                <Text className="memories-controller__eyebrow">NOW VIEWING</Text>
                <Text className="memories-controller__current-title">
                  {VIDEO_REELS[activeIndex].title}
                </Text>
                <input
                  className="memories-controller__scrubber"
                  aria-label="Seek video"
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={(event) => {
                    const time = Number(event.currentTarget.value);
                    seekVideo(time);
                  }}
                />
                <Flex
                  className="memories-controller__time"
                  justify="space-between"
                >
                  <Box component="span">{formatTime(currentTime)}</Box>
                  <Box component="span">{formatTime(duration)}</Box>
                </Flex>
              </Box>
            </Box>

            <Box
              className="memories-controller__navigation"
              aria-label="Video playback navigation"
            >
              {renderPreview(previousIndex, "PREVIOUS")}
              <button
                className="memories-controller__button memories-controller__button--play"
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <IconPlayerPause size={20} />
                ) : (
                  <IconPlayerPlay size={20} />
                )}
              </button>
              {renderPreview(nextIndex, "NEXT")}
            </Box>

            <Box
              className="memories-controller__channels"
              aria-label="Select a video"
            >
              {VIDEO_REELS.map((reel, index) => (
                <button
                  key={reel.src}
                  className="memories-controller__channel"
                  type="button"
                  aria-pressed={index === activeIndex}
                  onClick={() => selectReel(index)}
                >
                  CH_{String(index + 1).padStart(2, "0")}
                </button>
              ))}
            </Box>
          </Box>
        </Box>

        {isFullscreenMounted &&
          createPortal(
            <Box
              ref={fullscreenBackdropRef}
              className="memories-fullscreen"
              aria-label="Fullscreen video player"
            >
              <Flex
                className="memories-fullscreen__content"
                direction="column"
                align="center"
                justify="center"
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Box
                  ref={fullscreenFrameRef}
                  className={`memories-fullscreen__frame${!isFullscreen ? " memories-fullscreen__frame--closing" : ""}`}
                  data-flip-id="memories-video-screen"
                  style={
                    fullscreenCloseRect
                      ? {
                          left: fullscreenCloseRect.left,
                          top: fullscreenCloseRect.top,
                          width: fullscreenCloseRect.width,
                          height: fullscreenCloseRect.height,
                        }
                      : undefined
                  }
                >
                  <video
                    ref={fullscreenVideoRef}
                    className="memories-fullscreen__video"
                    src={VIDEO_REELS[activeIndex].src}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      background: "#020202",
                      pointerEvents: "none",
                    }}
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    autoPlay={wasPlayingRef.current}
                    onEnded={() => selectReel(nextIndex)}
                    onLoadedMetadata={(event) => {
                      event.currentTarget.currentTime =
                        fullscreenTimeRef.current;
                      setDuration(event.currentTarget.duration);
                      if (wasPlayingRef.current) {
                        void event.currentTarget
                          .play()
                          .catch(() => setIsPlaying(false));
                      }
                    }}
                    onTimeUpdate={(event) => {
                      fullscreenTimeRef.current =
                        event.currentTarget.currentTime;
                      setCurrentTime(event.currentTarget.currentTime);
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </Box>
                {isFullscreen && (
                  <Flex
                    className="memories-fullscreen__controls"
                    wrap="wrap"
                    align="center"
                    justify="center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      className="memories-fullscreen__scrubber"
                      aria-label="Seek fullscreen video"
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={Math.min(currentTime, duration || 0)}
                      onChange={(event) =>
                        seekVideo(Number(event.currentTarget.value))
                      }
                    />
                    <button
                      className="memories-controller__button"
                      type="button"
                      onClick={() => selectReel(previousIndex)}
                      aria-label="Previous video"
                    >
                      <IconChevronLeft size={20} />
                    </button>
                    <button
                      className="memories-controller__button memories-controller__button--play"
                      type="button"
                      onClick={() => {
                        togglePlayback();
                      }}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <IconPlayerPause size={20} />
                      ) : (
                        <IconPlayerPlay size={20} />
                      )}
                    </button>
                    <button
                      className="memories-controller__button"
                      type="button"
                      onClick={() => selectReel(nextIndex)}
                      aria-label="Next video"
                    >
                      <IconChevronRight size={20} />
                    </button>
                    <button
                      className="memories-controller__button"
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <IconVolumeOff size={18} />
                      ) : (
                        <IconVolume size={18} />
                      )}
                    </button>
                    <button
                      className="memories-controller__button memories-fullscreen__close"
                      type="button"
                      onClick={closeFullscreen}
                      aria-label="Close fullscreen video"
                    >
                      <IconX size={20} />
                    </button>
                  </Flex>
                )}
              </Flex>
            </Box>,
            document.body,
          )}
      </Box>
      <Footer />
    </LayoutWrapper>
  );
}
