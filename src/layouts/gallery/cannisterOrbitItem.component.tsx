import { useEffect, useState } from "react";
import { Box, Image } from "@mantine/core";
import { ShuffleButton } from "../../components/animations/shuffle.button";
import type CannisterEntity from "../../models/entity/cannister.model";

const FALLBACK_PREVIEW =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23090909'/%3E%3Cpath d='M0 72 24 48l14 14 22-29 36 39v24H0z' fill='%23241a12'/%3E%3Cpath d='M0 82 30 60l15 12 22-20 29 26v18H0z' fill='%23ff7700' fill-opacity='.42'/%3E%3Ccircle cx='68' cy='25' r='8' fill='%23ff7700' fill-opacity='.8'/%3E%3C/svg%3E";
const PREVIEW_CACHE = "folio-gallery-previews-v1";

interface CannisterOrbitItemProps {
  cannister: CannisterEntity;
  previewUrl?: string;
  onOpen: () => void;
  isSelected?: boolean;
  isBlurred?: boolean;
  onHover?: (isHovered: boolean) => void;
  position: { left: string; top: string };
}

export default function CannisterOrbitItem({
  cannister,
  previewUrl,
  onOpen,
  isSelected = false,
  isBlurred = false,
  onHover,
  position,
}: CannisterOrbitItemProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [cachedPreview, setCachedPreview] = useState<string>();
  const imageUrl = imageFailed ? FALLBACK_PREVIEW : cachedPreview ?? previewUrl ?? FALLBACK_PREVIEW;
  const archiveId = `S-${String(cannister.id).padStart(3, "0")}`;

  useEffect(() => {
    const sourceUrl = previewUrl ?? "";
    if (sourceUrl.length === 0) {
      setCachedPreview(undefined);
      return;
    }

    let isActive = true;
    let objectUrl: string | undefined;

    async function loadCachedPreview() {
      try {
        if (!("caches" in window)) {
          if (isActive) setCachedPreview(sourceUrl);
          return;
        }

        const cache = await window.caches.open(PREVIEW_CACHE);
        let response = await cache.match(sourceUrl);

        if (!response) {
          response = await fetch(sourceUrl, { mode: "cors", cache: "force-cache" });
          if (!response.ok) throw new Error(`Preview request failed: ${response.status}`);
          try {
            await cache.put(sourceUrl, response.clone());
          } catch {
            // Continue with the image if persistent browser storage is unavailable.
          }
        }

        objectUrl = URL.createObjectURL(await response.blob());
        if (isActive) {
          setImageFailed(false);
          setCachedPreview(objectUrl);
        }
      } catch {
        // Let the browser's normal image cache handle environments that block Cache Storage/CORS.
        if (isActive) setCachedPreview(sourceUrl);
      }
    }

    setCachedPreview(undefined);
    setImageFailed(false);
    void loadCachedPreview();

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [previewUrl]);

  return (
    <Box
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <Box data-orbit-counter style={{ width: "min(156px, max(56px, 24cqw))" }}>
        <ShuffleButton
          onClick={onOpen}
          aria-label={`Open ${cannister.name}`}
          title={`${archiveId} · ${cannister.name}`}
          onFocus={() => onHover?.(true)}
          onBlur={() => onHover?.(false)}
          variant="default"
          color="primaryOrange"
          styles={{
            root: {
              display: "grid",
              width: "100%",
              height: "min(156px, max(56px, 24cqw))",
              minHeight: 0,
              padding: 0,
              placeItems: "center",
              border: 0,
              outline: "none",
              background: "transparent",
              boxShadow: "none",
              transition: "transform 160ms ease",
            },
            section: { display: "block", width: "100%", height: "100%", margin: 0 },
            label: { display: "block", width: "100%", height: "100%" },
          }}
        >
          <Image
            src={imageUrl}
            alt=""
            aria-hidden="true"
            w="100%"
            h="100%"
            fit="cover"
            onError={() => setImageFailed(true)}
            style={{
              display: "block",
              overflow: "hidden",
              border: 0,
              borderRadius: 5,
              imageRendering: "pixelated",
              filter: `grayscale(${isSelected ? 0 : 1}) blur(${isBlurred ? 3 : 0}px)`,
              opacity: isBlurred ? 0.55 : 1,
              transition: "filter 220ms ease, opacity 220ms ease",
            }}
          />
        </ShuffleButton>
      </Box>
    </Box>
  );
}
