import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import Footer from "../../components/footer/footer";
import { ShuffleButton } from "../../components/animations/shuffle.button";
import { ShuffleText } from "../../components/animations/shuffle.text";
import type CannisterEntity from "../../models/entity/cannister.model";
import { DatabaseTables } from "../../enums/database.enums";
import { useAnimatedNavigate } from "../../components/transition/transition";
import CannisterService from "../../services/cannister.service";
import CannisterOrbitItem from "./cannisterOrbitItem.component";

const ITEMS_PER_ORBIT = 12;

export default function GalleryLayout() {
  const [cannisters, setCannisters] = useState<CannisterEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [page, setPage] = useState(0);
  const [hoveredCannisterId, setHoveredCannisterId] = useState<number | null>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const navigate = useAnimatedNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchCannisters() {
      try {
        const records = await CannisterService.getInstance().fetchCannisters();
        if (!isMounted) return;
        const sorted = [...(records as CannisterEntity[])].sort((first, second) => {
          const firstDate = new Date(first.created_at).getTime();
          const secondDate = new Date(second.created_at).getTime();
          return secondDate - firstDate || second.id - first.id;
        });
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
    () => cannisters.slice(page * ITEMS_PER_ORBIT, (page + 1) * ITEMS_PER_ORBIT),
    [cannisters, page],
  );

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit || isPaused || orbitItems.length < 2) return;
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
  }, [isPaused, orbitItems.length, page]);

  const goToPage = (nextPage: number) => {
    if (pageCount < 2) return;
    setPage((nextPage + pageCount) % pageCount);
  };

  return (
    <LayoutWrapper>
      <Box
        component="main"
        px="clamp(18px, 4vw, 64px)"
        pt="clamp(78px, 8vw, 112px)"
        pb={40}
        c="var(--folio-text)"
        bg="var(--folio-page-bg)"
        style={{
          minHeight: "100dvh",
          height: '100dvh',
          boxSizing: "border-box",
          overflow: "hidden",
          fontFamily: "DM Mono, monospace",
          backgroundImage:
            "linear-gradient(rgba(255,119,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,119,0,.035) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Group justify="space-between" align="flex-start" mb="md">
          <Stack gap={2}>
            <Text c="primaryOrange" size="xs" style={{ fontFamily: "DotGothic16, sans-serif", letterSpacing: ".16em" }}>
              ARCHIVE / 01
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase">
              A rotating index of collected studies
            </Text>
          </Stack>
          <Text c="dimmed" size="xs" style={{ fontFamily: "DotGothic16, sans-serif" }}>
            {String(cannisters.length).padStart(3, "0")} RECORDS
          </Text>
        </Group>

        <Box
          aria-label="Rotating cannister collections"
          style={{
            position: "relative",
            width: "100%",
            height: "max(220px, min(68vw, calc(100dvh - 340px), 680px))",
            isolation: "isolate",
          }}
        >
          <Box
            ref={orbitRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "min(100%, max(180px, min(68vw, calc(100dvh - 340px))), 680px)",
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -50%)",
              containerType: "size",
            }}
          >
            {orbitItems.map((cannister, index) => {
              const angle = (index / orbitItems.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 41;
              const y = 50 + Math.sin(angle) * 41;
              const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${DatabaseTables.Cannisters}/${cannister.name}/1.jpg`
              return (
                <CannisterOrbitItem
                  key={cannister.id}
                  cannister={cannister}
                  previewUrl={url}
                  onOpen={() => navigate(`/gallery/${cannister.id}`)}
                  isSelected={hoveredCannisterId === cannister.id}
                  isBlurred={hoveredCannisterId !== null && hoveredCannisterId !== cannister.id}
                  onHover={(isHovered) => setHoveredCannisterId(isHovered ? cannister.id : null)}
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
              width: "min(250px, max(100px, calc(min(68vw, 100dvh - 340px) * .34)))",
              height: "min(250px, max(100px, calc(min(68vw, 100dvh - 340px) * .34)))",
              padding: 18,
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            <Text size="xs" c="dimmed" tt="uppercase">
              Select a study to open
            </Text>
            <Text size="10px" c="dimmed" mt={6}>
              {pageCount > 1 ? `${page + 1} / ${pageCount} · ` : ""}
              {isLoading ? "SCANNING ARCHIVE" : `${cannisters.length} STUDIES`}
            </Text>
          </Stack>
        </Box>

        <Group justify="center" gap="sm" mt="md">
          {pageCount > 1 && (
            <ShuffleButton
              onClick={() => goToPage(page - 1)}
              leftSection={<IconChevronLeft size={14} />}
              variant="outline"
              color="primaryOrange"
              size="xs"
              styles={{ root: { borderRadius: 0, fontFamily: "DotGothic16, sans-serif" } }}
            >
              PREVIOUS SET
            </ShuffleButton>
          )}
          {pageCount > 1 && (
            <ShuffleButton
              onClick={() => goToPage(page + 1)}
              rightSection={<IconChevronRight size={14} />}
              variant="outline"
              color="primaryOrange"
              size="xs"
              styles={{ root: { borderRadius: 0, fontFamily: "DotGothic16, sans-serif" } }}
            >
              NEXT SET
            </ShuffleButton>
          )}
        </Group>
      </Box>
      <Footer />
    </LayoutWrapper>
  );
}