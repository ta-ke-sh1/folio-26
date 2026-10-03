import { useEffect, useMemo, useRef, useState } from "react";
import { ActionIcon, Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import Footer from "../../components/footer/footer";
import type CannisterEntity from "../../models/entity/cannister.model";
import { DatabaseTables } from "../../enums/database.enums";
import { useAnimatedNavigate } from "../../components/transition/transition";
import CannisterService from "../../services/cannister.service";
import CannisterOrbitItem from "./cannisterOrbitItem.component";
import GalleryHud from "./gallery.hud.component";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";
import CatchphraseCard from "../../components/card/catchphrase.card";
import CyberpunkBackdrop from "../../components/background/cyberpunk.backdrop";

const ITEMS_PER_ORBIT = 12;

export default function GalleryLayout() {
  const [cannisters, setCannisters] = useState<CannisterEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isStageHovered, setIsStageHovered] = useState(false);
  const [hoveredCannisterId, setHoveredCannisterId] = useState<number | null>(
    null,
  );
  const orbitRef = useRef<HTMLDivElement>(null);
  const navigate = useAnimatedNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchCannisters() {
      try {
        const records = await CannisterService.getInstance().fetchCannisters();
        if (!isMounted) return;
        const sorted = [...(records as CannisterEntity[])].sort(
          (first, second) => {
            const firstDate = new Date(first.created_at).getTime();
            const secondDate = new Date(second.created_at).getTime();
            return secondDate - firstDate || second.id - first.id;
          },
        );
        setCannisters(sorted);
      } catch (error) {
        console.error("Unable to load the cannister index:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void fetchCannisters();
    return () => {
      isMounted = false;
    };
  }, []);

  const pageCount = Math.ceil(cannisters.length / ITEMS_PER_ORBIT);
  const orbitItems = useMemo(
    () =>
      cannisters.slice(page * ITEMS_PER_ORBIT, (page + 1) * ITEMS_PER_ORBIT),
    [cannisters, page],
  );

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit || orbitItems.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const orbitAnimation = orbit.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg)" },
        { transform: "translate(-50%, -50%) rotate(360deg)" },
      ],
      { duration: 72000, iterations: Infinity, easing: "linear" },
    );
    const counterAnimations = Array.from(
      orbit.querySelectorAll<HTMLElement>("[data-orbit-counter]"),
      (element) =>
        element.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(-360deg)" }],
          { duration: 72000, iterations: Infinity, easing: "linear" },
        ),
    );

    return () => {
      orbitAnimation.cancel();
      counterAnimations.forEach((animation) => animation.cancel());
    };
  }, [orbitItems.length, page]);

  const goToPage = (nextPage: number) => {
    if (pageCount < 2) return;
    setPage((nextPage + pageCount) % pageCount);
  };

  return (
    <LayoutWrapper>
      <Stack
        component="main"
        className="gallery-page"
        style={{
          height: "calc(100dvh / var(--folio-viewport-scale, 1))",
          boxSizing: "border-box",
          paddingTop: "calc(60px / var(--folio-viewport-scale, 1))",
          paddingBottom: "calc(60px / var(--folio-viewport-scale, 1))",
          gap: 0,
          position: "relative",
          overflowX: "hidden",
          overflowY: "hidden",
          borderRadius: 10,
        }}
      >
        <style>{`
          @media (max-width: 62em) {
            .gallery-page {
              height: calc(100dvh / var(--folio-viewport-scale, 1)) !important;
              min-height: 0 !important;
              overflow: hidden !important;
            }
            .gallery-page__stage {
              height: calc((100dvh - 120px) / var(--folio-viewport-scale, 1)) !important;
              flex: 0 0 calc((100dvh - 120px) / var(--folio-viewport-scale, 1)) !important;
              min-height: 0 !important;
              margin-inline: 12px !important;
              padding: 8px 12px !important;
              overflow: hidden !important;
            }
            .gallery-page__content {
              height: 100% !important;
              min-height: 0 !important;
              flex: 1 1 auto !important;
              overflow: hidden !important;
              padding: 18px 0 24px !important;
            }
          }
        `}</style>
        <Stack
          className="gallery-page__stage"
          ml="lg"
          mr="lg"
          pl="xl"
          pr="xl"
          style={{
            border: `1px solid ${isStageHovered ? "rgba(255, 119, 0, .95)" : "rgba(255, 119, 0, .38)"}`,
            height: "calc((100dvh - 120px) / var(--folio-viewport-scale, 1))",
            boxSizing: "border-box",
            flex: "0 0 calc((100dvh - 120px) / var(--folio-viewport-scale, 1))",
            position: "relative",
            backgroundColor: "var(--folio-page-bg)",
            backgroundImage:
              "linear-gradient(rgba(255,119,0,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,119,0,.045) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            boxShadow: isStageHovered
              ? "0 0 24px rgba(255, 119, 0, .17), inset 0 0 26px rgba(255, 119, 0, .06)"
              : "inset 0 0 24px rgba(255, 119, 0, .025)",
            transition: "border-color 220ms ease, box-shadow 220ms ease",
            overflow: "hidden",
            borderRadius: 10,
          }}
          onMouseEnter={() => setIsStageHovered(true)}
          onMouseLeave={() => setIsStageHovered(false)}
        >
          <Box
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 50% 48%, rgba(255, 119, 0, .2), transparent 62%)",
              opacity: isStageHovered ? 1 : 0,
              transition: "opacity 260ms ease",
            }}
          />
          <CyberpunkBackdrop variant="gallery" layer={0} />
          <GalleryHud />
          <Box
            className="gallery-page__content"
            c="var(--folio-text)"
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
              width: "100%",
              height: "100%",
              minHeight: 0,
              boxSizing: "border-box",
              overflow: "hidden",
              paddingLeft: "clamp(18px, 4vw, 64px)",
              paddingRight: "clamp(18px, 4vw, 64px)",
              paddingTop:
                "calc(clamp(78px, 8vw, 112px) - 60px / var(--folio-viewport-scale, 1))",
              paddingBottom: 40,
              fontFamily: "DM Mono, monospace",
            }}
          >
            <Box
              aria-label="Rotating cannister collections"
              style={{
                position: "relative",
                width: "100%",
                flex: "1 1 auto",
                minHeight: 0,
                isolation: "isolate",
              }}
            >
              <Box
                ref={orbitRef}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width:
                    "min(100%, max(220px, min(76vw, calc((100dvh - 340px) / var(--folio-viewport-scale, 1)))), 820px)",
                  aspectRatio: "1 / 1",
                  transform: "translate(-50%, -50%)",
                  containerType: "size",
                }}
              >
                {orbitItems.map((cannister, index) => {
                  const angle =
                    (index / orbitItems.length) * Math.PI * 2 - Math.PI / 2;
                  const x = 50 + Math.cos(angle) * 41;
                  const y = 50 + Math.sin(angle) * 41;
                  const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${DatabaseTables.Cannisters}/${cannister.name}/1.jpg`;
                  return (
                    <CannisterOrbitItem
                      key={cannister.id}
                      cannister={cannister}
                      previewUrl={url}
                      onOpen={() => navigate(`/gallery/${cannister.id}`)}
                      isSelected={hoveredCannisterId === cannister.id}
                      isBlurred={
                        hoveredCannisterId !== null &&
                        hoveredCannisterId !== cannister.id
                      }
                      onHover={(isHovered) =>
                        setHoveredCannisterId(isHovered ? cannister.id : null)
                      }
                      position={{ left: `${x}%`, top: `${y}%` }}
                    />
                  );
                })}
              </Box>

              <Stack
                align="center"
                justify="center"
                gap={5}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width:
                    "min(290px, max(220px, calc(min(76vw, (100dvh - 340px) / var(--folio-viewport-scale, 1)) * .38)))",
                  height:
                    "min(290px, max(220px, calc(min(76vw, (100dvh - 340px) / var(--folio-viewport-scale, 1)) * .38)))",
                  padding: 18,
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                <BilingualShuffle
                  english="[ SELECT ONE ]"
                  japanese="[ 1つ選択して ]"
                />
                <Text size="10px" c="dimmed" mt={6}>
                  {pageCount > 1 ? `${page + 1} / ${pageCount} · ` : ""}
                  {isLoading
                    ? "SCANNING ARCHIVE"
                    : `${cannisters.length} COLLECTIONS`}
                </Text>
              </Stack>
            </Box>

            <Group
              justify="center"
              gap="sm"
              mt="md"
              style={{ flex: "0 0 auto" }}
            >
              {pageCount > 1 && (
                <Tooltip label="Previous set" withArrow>
                  <ActionIcon
                    onClick={() => goToPage(page - 1)}
                    variant="outline"
                    color="primaryOrange"
                    size="lg"
                    radius={0}
                    aria-label="Previous set"
                  >
                    <IconChevronLeft size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
              {pageCount > 1 && (
                <Tooltip label="Next set" withArrow>
                  <ActionIcon
                    onClick={() => goToPage(page + 1)}
                    variant="outline"
                    color="primaryOrange"
                    size="lg"
                    radius={0}
                    aria-label="Next set"
                  >
                    <IconChevronRight size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Box>
        </Stack>
      </Stack>
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
