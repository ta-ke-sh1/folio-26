import { useEffect, useState, useMemo } from "react";
import { Group, Text, Box, Badge, Stack } from "@mantine/core";
import { IconTerminal, IconArrowUpRight } from "@tabler/icons-react";

import { useAnimatedNavigate } from "../transition/transition";
import { getRandomNumber } from "../../services/utils.service";

interface DateCardProps {
  data?: any;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";

export function DateCard({ data }: DateCardProps) {
  const animatedNavigate = useAnimatedNavigate();

  const hasData = Boolean(data?.data);
  const cardData = data?.data;
  const items = cardData?.collection_items || [];
  const itemCount = items.length;

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);

  function handleNavigate() {
    if (hasData) {
      animatedNavigate(`/collections/${cardData.name}`);
    }
  }

  function getImageUrl(item: any) {
    if (!item) return "";
    if (item.image_url) return item.image_url;

    if (item.name && cardData?.id) {
      const encodedName = encodeURIComponent(item.name);
      return `${supabaseUrl}/storage/v1/object/public/collection_items/collection-${cardData.id}-${encodedName}.jpg`;
    }
    return "";
  }

  // Generate array of all image URLs for preloading
  const imageUrls = useMemo(() => {
    return items.map((item: any) => getImageUrl(item)).filter(Boolean);
  }, [items, cardData?.id]);

  // Preload all images into browser cache
  useEffect(() => {
    if (!imageUrls.length) return;

    let isMounted = true;
    setIsPreloaded(false);

    const loadPromises = imageUrls.map((url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve anyway so broken images don't block the rest
      });
    });

    Promise.all(loadPromises).then(() => {
      if (isMounted) {
        setIsPreloaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imageUrls]);

  // Cycle through collection items only after preloading finishes
  useEffect(() => {
    if (itemCount <= 1 || !isPreloaded) return;

    const interval = setInterval(
      () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % itemCount);
      },
      getRandomNumber(50, 70) * 10,
    );

    return () => clearInterval(interval);
  }, [itemCount, isPreloaded]);

  const currentItem = items[currentImageIndex];
  const bgImageUrl = getImageUrl(currentItem);

  return (
    <Box
      data-cursor={data?.id ? "pointer" : "default"}
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: "18dvh",
        minHeight: "100px",
        borderRadius: "6px",
        backgroundColor: isHovered
          ? "var(--folio-card-hover)"
          : "var(--folio-card)",
        border: isHovered
          ? "1px solid #FF7700"
          : "1px solid var(--folio-card-border)",
        boxShadow: isHovered ? "0 0 20px rgba(255, 119, 0, 0.2)" : "none",
        // filter: isHovered ? "grayscale(0)" : "grayscale(1)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: "16px 24px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        backgroundImage: bgImageUrl
          ? `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)), url("${bgImageUrl}")`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Stack
        gap={6}
        style={{
          width: "100%",
          height: "100%",
        }}
        justify="space-between"
      >
        {/* Terminal Header Row */}
        <Group justify="space-between" align="center" style={{ width: "100%" }}>
          <Group
            gap={6}
            style={{
              borderRadius: "4px",
              backgroundColor: hasData ? "#FF7700" : "transparent",
              padding: hasData ? (isHovered ? "4px 8px" : "2px 4px") : 0,
              transition: "padding 0.2s ease",
            }}
          >
            <IconTerminal
              size={14}
              color={hasData ? "black" : "var(--folio-muted)"}
              style={{ transition: "color 0.2s ease" }}
            />
            <Text
              fz="10px"
              fw={700}
              style={{
                fontFamily: "DotGothic16",
                color: hasData ? "black" : "var(--folio-muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {hasData ? `COLLECTION_${cardData.name}` : "N0 DATA"}
            </Text>
          </Group>

          {hasData && (
            <Group
              style={{
                padding: hasData ? (isHovered ? "4px 8px" : "2px 4px") : 0,
                transition: "padding 0.2s ease",
                borderRadius: "4px",
                backgroundColor: hasData ? "#FF7700" : "transparent",
              }}
            >
              <Text
                fz="10px"
                fw={700}
                style={{
                  fontFamily: "DotGothic16",
                  color: hasData ? "black" : "var(--folio-muted)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
              </Text>
            </Group>
          )}
        </Group>

        {/* Content Title & Navigation Indicator */}
        <Group
          justify="space-between"
          align="center"
          style={{ width: "100%", marginTop: "2px" }}
        >
          <Group
            style={{
              padding: hasData ? (isHovered ? "4px 8px" : "2px 4px") : 0,
              transition: "padding 0.2s ease",
              borderRadius: "4px",
              backgroundColor: hasData ? "#FF7700" : "transparent",
            }}
          >
            <Text
              fw={800}
              fz="md"
              style={{
                fontFamily: "DotGothic16",
                color: hasData ? "black" : "var(--folio-muted)",
                transition: "color 0.2s ease",
                letterSpacing: "-0.5px",
              }}
            >
              {data?.value}
            </Text>
          </Group>

          <IconArrowUpRight
            size={20}
            color={isHovered ? "var(--folio-accent)" : "var(--folio-muted)"}
            style={{
              transform: isHovered ? "translate(3px, -3px)" : "none",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
          />
        </Group>
      </Stack>
    </Box>
  );
}
