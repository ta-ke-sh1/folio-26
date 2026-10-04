import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Anchor, Box, Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
import { useParams } from "react-router";
import { useLenis } from "lenis/react";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import Footer from "../../components/footer/footer";
import { ShuffleButton } from "../../components/animations/shuffle.button";
import { ShuffleText } from "../../components/animations/shuffle.text";
import { useAnimatedNavigate } from "../../components/transition/transition";
import { DatabaseTables } from "../../enums/database.enums";
import type CannisterEntity from "../../models/entity/cannister.model";
import CannisterService from "../../services/cannister.service";
import DatabaseService from "../../services/database.service";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";
import CyberpunkBackdrop from "../../components/background/cyberpunk.backdrop";
import CatchphraseCard from "../../components/card/catchphrase.card";

interface CannisterFile {
  name: string;
  metadata?: Record<string, unknown> | null;
}

const IMAGE_EXTENSION = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

// Safety net: if an image is extremely slow, don't keep the loader up forever.
const IMAGE_PRELOAD_TIMEOUT_MS = 20000;

const getPublicUrl = (cannisterName: string, fileName: string) => {
  const bucket = DatabaseService.getInstance()
    .getDatabase()
    .storage.from(DatabaseTables.Cannisters);
  return bucket.getPublicUrl(`${cannisterName}/${fileName}`).data.publicUrl;
};

const compareFileNames = (first: CannisterFile, second: CannisterFile) =>
  first.name.localeCompare(second.name, undefined, { numeric: true });

/** Resolves once the image has loaded (or failed, so one bad file can't block). */
const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    // `Image` is shadowed by Mantine's component, so use the DOM constructor.
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

/** Waits for every image (or the timeout), reporting progress as they finish. */
const preloadImages = async (
  urls: string[],
  onProgress: (loaded: number) => void,
) => {
  let loaded = 0;
  const all = Promise.all(
    urls.map((url) =>
      preloadImage(url).then(() => {
        loaded += 1;
        onProgress(loaded);
      }),
    ),
  );

  let timer: number | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = window.setTimeout(resolve, IMAGE_PRELOAD_TIMEOUT_MS);
  });

  try {
    await Promise.race([all, timeout]);
  } finally {
    window.clearTimeout(timer);
  }
};

export default function CannisterDetailsLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useAnimatedNavigate();
  const lenis = useLenis();
  const [cannister, setCannister] = useState<CannisterEntity | null>(null);
  const [files, setFiles] = useState<CannisterFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState({
    loaded: 0,
    total: 0,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCannister() {
      setIsLoading(true);
      setPreloadProgress({ loaded: 0, total: 0 });
      try {
        const service = CannisterService.getInstance();
        const records = (await service.fetchCannisters()) as CannisterEntity[];
        const found =
          records.find((record) => String(record.id) === id) ?? null;
        if (!isMounted) return;

        setCannister(found);
        setFiles([]);
        setActiveImageIndex(0);
        setScrollProgress(0);
        if (found) {
          const storageItems = await service.fetchCannisterItems(found.name);
          if (isMounted && Array.isArray(storageItems)) {
            const nextFiles: CannisterFile[] = storageItems.map((file) => ({
              name: file.name,
              metadata: file.metadata as Record<string, unknown> | null,
            }));
            setFiles(nextFiles);

            // Keep the loading state up until every image has finished
            // loading, so the page appears fully ready instead of images
            // popping in one by one afterwards.
            const imageUrls = nextFiles
              .filter((file) => IMAGE_EXTENSION.test(file.name))
              .sort(compareFileNames)
              .map((file) => getPublicUrl(found.name, file.name));

            setPreloadProgress({ loaded: 0, total: imageUrls.length });
            await preloadImages(imageUrls, (loaded) => {
              if (isMounted) {
                setPreloadProgress({ loaded, total: imageUrls.length });
              }
            });
          }
        }
      } catch (error) {
        console.error("Unable to load cannister details:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCannister();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const publicUrl = useCallback(
    (fileName: string) => {
      if (!cannister) return "";
      return getPublicUrl(cannister.name, fileName);
    },
    [cannister],
  );

  const imageFiles = useMemo(
    () =>
      files
        .filter((file) => IMAGE_EXTENSION.test(file.name))
        .sort(compareFileNames),
    [files],
  );
  const otherFiles = files.filter((file) => !IMAGE_EXTENSION.test(file.name));

  const updateScrollPosition = useCallback(() => {
    const story = storyRef.current;
    if (!story) return;

    const frames = Array.from(
      story.querySelectorAll<HTMLElement>("[data-image-frame]"),
    );
    if (frames.length === 0) return;

    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    frames.forEach((frame, index) => {
      const frameRect = frame.getBoundingClientRect();
      const distance = Math.abs(
        frameRect.top + frameRect.height / 2 - viewportCenter,
      );
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    setActiveImageIndex(closestIndex);
    const firstFrameTop =
      frames[0].getBoundingClientRect().top + window.scrollY;
    const lastFrameBottom =
      frames[frames.length - 1].getBoundingClientRect().bottom + window.scrollY;
    const start = Math.max(0, firstFrameTop - 80);
    const end = Math.max(start, lastFrameBottom - window.innerHeight + 80);
    const distance = end - start;
    setScrollProgress(
      distance > 0
        ? Math.max(0, Math.min(1, (window.scrollY - start) / distance))
        : 0,
    );
  }, []);

  useEffect(() => {
    updateScrollPosition();
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    window.addEventListener("resize", updateScrollPosition);
    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
      window.removeEventListener("resize", updateScrollPosition);
    };
  }, [imageFiles.length, updateScrollPosition]);

  const scrollToImage = (index: number) => {
    const frame = storyRef.current?.querySelector<HTMLElement>(
      `[data-image-frame="${index}"]`,
    );
    if (!frame) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (lenis) {
      lenis.scrollTo(frame, {
        offset: -48,
        duration: reduceMotion ? 0 : 0.8,
        immediate: reduceMotion,
      });
    } else {
      window.scrollTo({
        top: frame.getBoundingClientRect().top + window.scrollY - 48,
        behavior: reduceMotion ? "instant" : "smooth",
      });
    }
  };

  return (
    <LayoutWrapper>
      <Box
        component="main"
        c="var(--folio-text)"
        bg="var(--folio-page-bg)"
        style={{
          minHeight: "100dvh",
          position: "relative",
          isolation: "isolate",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          padding:
            "calc(76px / var(--folio-viewport-scale, 1)) clamp(18px, 4vw, 64px) calc(60px / var(--folio-viewport-scale, 1))",
          fontFamily: "DM Mono, monospace",
          backgroundImage:
            "linear-gradient(rgba(255,119,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,119,0,.035) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <CyberpunkBackdrop variant="cannister" />
        <style>{`
          .cannister-story-layout {
            display: grid;
            grid-template-columns: minmax(220px, 27%) minmax(0, 1fr) 76px;
            align-items: start;
            gap: clamp(20px, 4vw, 64px);
          }
          .cannister-story-details {
            position: sticky;
            top: 56px;
            align-self: start;
            display: flex;
            height: calc(100dvh - 72px);
            box-sizing: border-box;
            justify-content: flex-start;
            min-width: 0;
            padding: clamp(12px, 2vw, 30px) 0;
          }
          .cannister-story-content {
            min-width: 0;
            border-left: 1px solid var(--folio-border);
            border-right: 1px solid var(--folio-border);
            background: rgba(255, 119, 0, .018);
            padding-bottom: 20px;
          }
          .cannister-story-content > .mantine-Group-root {
            position: sticky;
            top: 40px;
            z-index: 4;
            background: var(--folio-page-bg);
          }
          .cannister-story-scroll {
            display: block;
          }
          .cannister-story-frame {
            position: relative;
            display: grid;
            width: 100%;
            height: fit-content;
            place-items: center;
            isolation: isolate;
            background: var(--folio-page-bg);
            scroll-margin-top: 48px;
            border-bottom: 1px solid var(--folio-border);
          }
          .cannister-story-frame::after {
            position: absolute;
            z-index: 1;
            inset: 0;
            border: 1px solid rgba(255, 119, 0, .22);
            background: linear-gradient(180deg, rgba(0,0,0,.4), transparent 18%, transparent 78%, rgba(0,0,0,.68));
            content: "";
            pointer-events: none;
          }
          .cannister-story-frame img {
            width: 100%;
            height: auto;
            object-fit: contain;
          }
          .cannister-story-rail {
            position: sticky;
            top: 48px;
            align-self: start;
            display: flex;
            height: calc(100dvh - 72px);
            min-height: 0;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 7px;
            overflow-y: auto;
            scrollbar-width: none;
          }
          .cannister-story-rail::-webkit-scrollbar { display: none; }
          .cannister-story-rail-track {
            position: absolute;
            top: 10%;
            right: 2px;
            bottom: 10%;
            width: 2px;
            background: rgba(255, 119, 0, .2);
            pointer-events: none;
          }
          .cannister-story-rail-progress {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: var(--folio-accent);
            box-shadow: 0 0 8px rgba(255, 119, 0, .75);
            transform-origin: top;
            transition: transform 120ms linear;
          }
          .cannister-story-thumb {
            position: relative;
            z-index: 1;
            display: block;
            width: 54px;
            height: 54px;
            flex: 0 0 54px;
            padding: 0;
            border: 1px solid rgba(255, 119, 0, .28);
            background: var(--folio-card);
            opacity: .62;
            cursor: pointer;
            transition: opacity 180ms ease, border-color 180ms ease, transform 180ms ease;
          }
          .cannister-story-thumb:hover,
          .cannister-story-thumb[aria-current="true"] {
            z-index: 2;
            border-color: var(--folio-accent);
            opacity: 1;
            transform: translateX(-3px);
          }
          .cannister-story-thumb img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          @media (max-width: 48em) {
            .cannister-story-layout {
              grid-template-columns: minmax(0, 1fr) 62px;
              gap: 10px 12px;
            }
            .cannister-story-details {
              position: static;
              grid-column: 1 / -1;
              grid-row: 1;
              height: auto;
              padding: 8px 0 12px;
              border-bottom: 1px solid var(--folio-border);
            }
            .cannister-story-content {
              grid-column: 1;
              grid-row: 2;
            }
            .cannister-story-rail { grid-column: 2; grid-row: 2; }
            .cannister-story-thumb {
              width: 46px;
              height: 46px;
              flex-basis: 46px;
            }
          }
          @media (max-width: 30em) {
            .cannister-story-layout { grid-template-columns: minmax(0, 1fr) 48px; gap: 8px; }
            .cannister-story-thumb { width: 38px; height: 38px; flex-basis: 38px; }
          }
          @media (prefers-reduced-motion: reduce) {
            .cannister-story-thumb { transition: none; }
            .cannister-loading-overlay { transition: none !important; }
          }
        `}</style>

        {/* Loading overlay: stays up until every image has finished loading */}
        <Box
          className="cannister-loading-overlay"
          role="status"
          aria-live="polite"
          aria-hidden={!isLoading}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--folio-page-bg)",
            opacity: isLoading ? 1 : 0,
            visibility: isLoading ? "visible" : "hidden",
            pointerEvents: isLoading ? "auto" : "none",
            transition: "opacity 600ms ease, visibility 0s linear 600ms",
          }}
        >
          <Stack gap={6} align="center">
            <Text
              c="primaryOrange"
              style={{
                fontFamily: "DotGothic16, sans-serif",
                letterSpacing: ".12em",
              }}
            >
              <ShuffleText text="LOADING COLLECTION..." />
            </Text>
            <Text
              size="xs"
              c="dimmed"
              style={{
                fontFamily: "DotGothic16, sans-serif",
                letterSpacing: ".1em",
              }}
            >
              FRAMES {String(preloadProgress.loaded).padStart(2, "0")} /{" "}
              {String(preloadProgress.total).padStart(2, "0")}
            </Text>
          </Stack>
        </Box>

        <Box style={{ flex: "0 0 auto", marginBottom: 14 }}>
          <ShuffleButton
            variant="outline"
            color="primaryOrange"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/gallery")}
            w="fit-content"
            styles={{
              root: {
                borderRadius: 0,
                fontFamily: "DotGothic16, sans-serif",
                boxShadow: "3px 3px 0 rgba(255,119,0,.25)",
              },
            }}
          >
            Back to index
          </ShuffleButton>
        </Box>

        {isLoading ? null : !cannister ? (
          <Stack gap="sm">
            <Title
              order={1}
              size="h2"
              c="primaryOrange"
              style={{ fontFamily: "DotGothic16, sans-serif" }}
            >
              <ShuffleText text="COLLECTION NOT FOUND" />
            </Title>
            <Text c="dimmed">
              This cannister is not present in the archive.
            </Text>
          </Stack>
        ) : (
          <Box className="cannister-story-layout">
            <Stack className="cannister-story-details" gap="md">
              <Stack gap={6}>
                <Text
                  c="var(--folio-accent)"
                  size="sm"
                  fw={600}
                  tt="uppercase"
                  style={{ letterSpacing: ".12em" }}
                >
                  <BilingualShuffle
                    english="COLLECTION"
                    japanese="コレクション"
                  />{" "}
                  / {String(cannister.id).padStart(3, "0")}
                </Text>
                <Title
                  order={1}
                  aria-label={cannister.name}
                  style={{
                    fontSize: "clamp(32px, 5vw, 76px)",
                    lineHeight: 1.02,
                    letterSpacing: "-.045em",
                    overflowWrap: "anywhere",
                    fontFamily: "DotGothic16, sans-serif",
                    color: "var(--folio-accent)",
                    textShadow: "0 0 18px rgba(255,119,0,.28)",
                  }}
                >
                  <ShuffleText text={cannister.name} />
                </Title>
              </Stack>

              <Stack gap={4}>
                <Text
                  size="xs"
                  c="primaryOrange"
                  tt="uppercase"
                  style={{ fontFamily: "DotGothic16, sans-serif" }}
                >
                  <Text
                    size="xs"
                    c="primaryOrange"
                    tt="uppercase"
                    style={{
                      fontFamily: "DotGothic16, sans-serif",
                      letterSpacing: ".1em",
                    }}
                  >
                    CREATED AT / 作成日
                  </Text>
                </Text>
                <Text size="sm">
                  {new Date(cannister.created_at).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </Text>
              </Stack>

              <Stack gap={6}>
                <Text
                  size="xs"
                  c="primaryOrange"
                  tt="uppercase"
                  style={{
                    fontFamily: "DotGothic16, sans-serif",
                    letterSpacing: ".1em",
                  }}
                >
                  FIELD TAGS / 分類
                </Text>
                <Group gap="xs">
                  {(cannister.tags ?? []).length > 0 ? (
                    cannister.tags.map((tag) => (
                      <Text
                        key={tag}
                        size="xs"
                        c="primaryOrange"
                        style={{
                          border: "1px solid var(--folio-border)",
                          padding: "5px 8px",
                          background: "var(--folio-card)",
                        }}
                      >
                        {tag}
                      </Text>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No fields assigned
                    </Text>
                  )}
                </Group>
              </Stack>

              <Stack gap={6}>
                <Text
                  size="xs"
                  c="primaryOrange"
                  tt="uppercase"
                  style={{
                    fontFamily: "DotGothic16, sans-serif",
                    letterSpacing: ".1em",
                  }}
                >
                  DESCRIPTION / 説明
                </Text>
                <Group gap="xs">
                  {cannister.description ? (
                    <Text size="sm">{cannister.description}</Text>
                  ) : (
                    <Text size="sm" c="dimmed">
                      No description available
                    </Text>
                  )}
                </Group>
              </Stack>

              <Text
                size="10px"
                c="dimmed"
                style={{
                  marginTop: "auto",
                  fontFamily: "DotGothic16, sans-serif",
                  letterSpacing: ".1em",
                  marginBottom: 10,
                }}
              >
                SCROLL TO EXPLORE / {String(imageFiles.length).padStart(2, "0")}{" "}
                FRAMES
              </Text>
            </Stack>

            <Stack className="cannister-story-content" gap={0}>
              <Group
                justify="space-between"
                align="center"
                px="md"
                py="sm"
                style={{
                  flex: "0 0 auto",
                  borderBottom: "1px solid var(--folio-border)",
                }}
              >
                <Text
                  size="xs"
                  c="primaryOrange"
                  tt="uppercase"
                  style={{
                    letterSpacing: ".12em",
                    fontFamily: "DotGothic16, sans-serif",
                  }}
                >
                  <ShuffleText text="ARCHIVE CONTENTS" />
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  style={{
                    fontFamily: "DotGothic16, sans-serif",
                    letterSpacing: ".08em",
                  }}
                >
                  {String(activeImageIndex + 1).padStart(2, "0")} /{" "}
                  {String(imageFiles.length).padStart(2, "0")}
                </Text>
              </Group>

              <Box
                ref={storyRef}
                className="cannister-story-scroll"
                aria-label={`Image story for ${cannister.name}`}
              >
                {imageFiles.map((file, index) => {
                  return (
                    <Box
                      key={file.name}
                      className="cannister-story-frame"
                      data-image-frame={index}
                      aria-label={`Frame ${index + 1} of ${imageFiles.length}`}
                    >
                      <Image
                        src={publicUrl(file.name)}
                        alt={`${cannister.name} — ${file.name}`}
                        fit="contain"
                        w="100%"
                        h="auto"
                      />
                      <Group
                        justify="space-between"
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          top: 14,
                          left: 16,
                          right: 16,
                          pointerEvents: "none",
                        }}
                      >
                        <Text
                          size="xs"
                          c="white"
                          style={{
                            fontFamily: "DotGothic16, sans-serif",
                            letterSpacing: ".1em",
                            textShadow: "0 1px 8px #000",
                          }}
                        >
                          FRAME {String(index + 1).padStart(2, "0")}
                        </Text>
                      </Group>
                      <Text
                        size="xs"
                        c="white"
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          bottom: 14,
                          left: 16,
                          fontFamily: "DM Mono, monospace",
                          textShadow: "0 1px 8px #000",
                        }}
                      >
                        {file.name}
                      </Text>
                    </Box>
                  );
                })}
                {imageFiles.length === 0 && (
                  <Text
                    c="dimmed"
                    p="xl"
                    style={{ fontFamily: "DotGothic16, sans-serif" }}
                  >
                    NO IMAGE DATA // THIS COLLECTION IS EMPTY
                  </Text>
                )}
                {otherFiles.length > 0 && (
                  <Stack gap={0} p="md">
                    {otherFiles.map((file) => (
                      <Anchor
                        key={file.name}
                        href={publicUrl(file.name)}
                        target="_blank"
                        rel="noreferrer"
                        c="var(--folio-accent)"
                        py="sm"
                        style={{
                          borderTop: "1px solid var(--folio-card-border)",
                          fontFamily: "DotGothic16, sans-serif",
                        }}
                      >
                        <Group justify="space-between">
                          <Text size="sm">{file.name}</Text>
                          <IconExternalLink size={16} />
                        </Group>
                      </Anchor>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>

            {imageFiles.length > 0 && (
              <Box
                className="cannister-story-rail"
                aria-label="Image navigation"
              >
                <Box className="cannister-story-rail-track">
                  <Box
                    className="cannister-story-rail-progress"
                    style={{
                      height: "100%",
                      transform: `scaleY(${Math.max(scrollProgress, 0.025)})`,
                    }}
                  />
                </Box>
                {imageFiles.map((file, index) => (
                  <button
                    key={file.name}
                    type="button"
                    className="cannister-story-thumb"
                    aria-label={`Scroll to image ${index + 1}: ${file.name}`}
                    aria-current={activeImageIndex === index}
                    onClick={() => scrollToImage(index)}
                  >
                    <Image
                      src={publicUrl(file.name)}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box style={{ position: "relative", zIndex: 6 }}>
        <CatchphraseCard
          embedded={true}
          contents={
            <Text
              size="lg"
              c="white"
              style={{
                fontFamily: "DM Mono, monospace",
                letterSpacing: ".1em",
              }}
            >
              <BilingualShuffle
                english="A STASH OF VISONS"
                japanese="隠された幻影"
              />
            </Text>
          }
        />
      </Box>
      <Footer />
    </LayoutWrapper>
  );
}
