import { useEffect, useState, useMemo } from "react";
import { Group, Text, Box, Badge, Stack } from "@mantine/core";
import { IconTerminal, IconArrowUpRight } from "@tabler/icons-react";

import "./date.card.scss";
import { useAnimatedNavigate } from "../transition/transition";

interface DateCardProps {
  data?: any;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

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

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % itemCount);
    }, 600);

    return () => clearInterval(interval);
  }, [itemCount, isPreloaded]);

  const currentItem = items[currentImageIndex];
  const bgImageUrl = getImageUrl(currentItem);

  return (
    <Box
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="date-card"
      style={{
        height: "18dvh",
        minHeight: "100px",
        borderRadius: "6px",
        backgroundColor: isHovered ? "#121212" : "#0a0a0a",
        border: isHovered ? "1px solid #FF7700" : "1px solid #262626",
        boxShadow: isHovered ? "0 0 20px rgba(255, 119, 0, 0.2)" : "none",
        cursor: data?.id ? "pointer" : "default",
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
          <Group gap={6}>
            <IconTerminal
              size={14}
              color={isHovered ? "#FF7700" : "#666666"}
              style={{ transition: "color 0.2s ease" }}
            />
            <Text
              fz="10px"
              fw={700}
              style={{
                fontFamily: "monospace",
                color: isHovered ? "#FF7700" : "#737373",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {hasData ? `// COLLECTION_${cardData.name}` : "// N0 DATA"}
            </Text>
          </Group>

          {hasData && (
            <Badge
              size="xs"
              variant="outline"
              style={{
                fontFamily: "monospace",
                borderColor: isHovered ? "#FF7700" : "#333333",
                color: isHovered ? "#FF7700" : "#a3a3a3",
                backgroundColor: isHovered
                  ? "rgba(255, 119, 0, 0.08)"
                  : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
            </Badge>
          )}
        </Group>

        {/* Content Title & Navigation Indicator */}
        <Group
          justify="space-between"
          align="center"
          style={{ width: "100%", marginTop: "2px" }}
        >
          <Text
            fw={800}
            fz="lg"
            style={{
              fontFamily: "monospace",
              color: isHovered ? "#ffffff" : "#d4d4d4",
              transition: "color 0.2s ease",
              letterSpacing: "-0.5px",
            }}
          >
            {data?.value}
          </Text>

          <IconArrowUpRight
            size={20}
            color={isHovered ? "#FF7700" : "#525252"}
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
