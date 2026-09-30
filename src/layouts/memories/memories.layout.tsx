import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Text } from "@mantine/core";
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
          const orientation = window.matchMedia("(max-width: 48em)").matches
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
        <span className="memories-preview__video-wrap">
          <video
            className="memories-preview__video"
            src={reel.src}
            muted
            playsInline
            preload="auto"
            onLoadedData={(event) => {
              event.currentTarget.pause();
              event.currentTarget.currentTime = 0;
            }}
            aria-hidden="true"
          />
        </span>
        <span>
          <span className="memories-preview__label">
            {direction} // CH_{String(index + 1).padStart(2, "0")}
          </span>
          <span className="memories-preview__title">{reel.title}</span>
        </span>
      </button>
    );
  };

  return (
    <LayoutWrapper>
      <main className="memories-page">
        <header className="memories-page__header" style={{
            marginTop: '20px'
        }}>
          <Box>
            <Text className="memories-page__eyebrow">
              [ PERSONAL ARCHIVE // VIDEO ]
            </Text>
            <h1 className="memories-page__title">
              <BilingualShuffle
                className="memories-page__title-shuffle"
                english="MOVING MEMORIES"
                japanese="動く記憶"
              />
            </h1>
          </Box>
          <Text className="memories-page__status">ARCHIVE SIGNAL ONLINE</Text>
        </header>

        <section className="memories-console" aria-label="Video archive player">
          <div
            className="memories-deck"
            style={{ display: "flex", minHeight: 0, alignSelf: "stretch" }}
          >
            <div
              className="memories-tv"
              style={{
                display: "flex",
                width: "100%",
                minHeight: 0,
                flexDirection: "column",
              }}
            >
              <div
                ref={screenFrameRef}
                className="memories-tv__screen-frame"
                style={{ flex: "1 1 auto", minHeight: 0 }}
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
                  autoPlay={!isFullscreenMounted}
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={(event) =>
                    setCurrentTime(event.currentTarget.currentTime)
                  }
                  onLoadedMetadata={(event) =>
                    setDuration(event.currentTarget.duration)
                  }
                />
                <div className="memories-tv__screen-overlay">
                  <span className="memories-tv__screen-light" />
                  PLAYING // {String(activeIndex + 1).padStart(2, "0")}
                  <IconMaximize size={13} />
                </div>
              </div>
              <div className="memories-tv__bezel">
                <span className="memories-tv__brand">FOLIO / CRT-26</span>
                <span className="memories-tv__bezel-right">
                  <span className="memories-tv__channel">
                    CH {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="memories-tv__led" />
                </span>
              </div>
            </div>
          </div>

          <aside
            className="memories-controller"
            style={{
              boxSizing: "border-box",
              display: "flex",
              minHeight: 0,
              flexDirection: "column",
              justifyContent: "center",
              alignSelf: "stretch",
            }}
            aria-label="TV controller"
          >
            <div
              className="memories-controller__previews"
              aria-label="Adjacent video previews"
            >
              {renderPreview(previousIndex, "PREVIOUS")}
              {renderPreview(nextIndex, "NEXT")}
            </div>
            <div className="memories-controller__heading">
              <Text className="memories-controller__eyebrow">REMOTE / 01</Text>
              <Text className="memories-controller__readout">POWER: ON</Text>
              <div className="memories-controller__volume">
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
              </div>
            </div>

            <div className="memories-controller__current">
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
              <div className="memories-controller__time">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="memories-controller__transport">
              <button
                className="memories-controller__button"
                type="button"
                onClick={() => selectReel(previousIndex)}
                aria-label="Previous video"
              >
                <IconChevronLeft size={18} />
              </button>
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
              <button
                className="memories-controller__button"
                type="button"
                onClick={() => selectReel(nextIndex)}
                aria-label="Next video"
              >
                <IconChevronRight size={18} />
              </button>
            </div>

            <div
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
            </div>
          </aside>
        </section>

        {isFullscreenMounted &&
          createPortal(
            <div
              ref={fullscreenBackdropRef}
              className="memories-fullscreen"
              aria-label="Fullscreen video player"
            >
              <div className="memories-fullscreen__content">
                <div
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
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    autoPlay={wasPlayingRef.current}
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
                </div>
                {isFullscreen && (
                  <div
                    className="memories-fullscreen__controls"
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
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )}
      </main>
      <Footer />
    </LayoutWrapper>
  );
}
