import {
  Badge,
  Box,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconTerminal, IconArrowUpRight } from "@tabler/icons-react";
import { useState, useMemo, useEffect } from "react";
import { useAnimatedNavigate } from "../transition/transition";
import type {
  CollectionItemEntity,
  CollectionEntity,
} from "../../models/entity/collection.model";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";

/** Helper function to generate Supabase storage image URL or fallback */
function getImageUrl(item: CollectionItemEntity, collectionId: number): string {
  if (!item) return "";
  if (item.name && collectionId) {
    const encodedName = encodeURIComponent(item.name);
    return `${supabaseUrl}/storage/v1/object/public/collection_items/collection-${collectionId}-${encodedName}.jpg`;
  }
  return "";
}

// --- Individual Collection Card with 30% Image Loop Box ---
export default function CollectionCard({
  collection,
}: {
  collection: CollectionEntity;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const animatedNavigate = useAnimatedNavigate();

  // Memoize items to maintain reference stability across renders
  const items = useMemo(
    () => collection.collection_items || [],
    [collection.collection_items],
  );
  const itemCount = items.length;

  // Generate array of all image URLs for preloading
  const imageUrls = useMemo(() => {
    return items
      .map((item: CollectionItemEntity) => getImageUrl(item, collection.id))
      .filter(Boolean);
  }, [items, collection.id]);

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
        img.onerror = () => resolve(); // Don't let broken images block preloading
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
  const bgImageUrl = currentItem ? getImageUrl(currentItem, collection.id) : "";

  function handleNavigate() {
    animatedNavigate(`/collections/${collection.name}`);
  }

  return (
    <Paper
      onClick={handleNavigate}
      p="lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? "rgba(255, 119, 0, 0.04)" : "#0A0A0A",
        border: isHovered ? "1px solid #FF7700" : "1px solid #262626",
        borderRadius: "8px",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isHovered
          ? "0 0 20px rgba(255, 119, 0, 0.2)"
          : "0 2px 8px rgba(0, 0, 0, 0.4)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <Flex direction={{ base: "column", sm: "row" }} gap="lg" align="stretch">
        {/* 70% Width: Collection Metadata & Overview */}
        <Stack justify="space-between" style={{ flex: "1 1 70%", minWidth: 0 }}>
          <Stack gap="xs">
            {/* Header Terminal Tag */}
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <IconTerminal
                  size={16}
                  color={isHovered ? "#FF7700" : "#737373"}
                />
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: isHovered ? "#FF7700" : "#737373",
                    letterSpacing: "1px",
                  }}
                >
                  // COLLECTION_{collection.name}
                </Text>
              </Group>

              <Badge
                size="sm"
                variant="outline"
                style={{
                  fontFamily: "monospace",
                  borderColor: isHovered ? "#FF7700" : "#333333",
                  color: isHovered ? "#FF7700" : "#A3A3A3",
                  backgroundColor: isHovered
                    ? "rgba(255, 119, 0, 0.08)"
                    : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
              </Badge>
            </Group>

            {/* Main Collection Title */}
            <Title
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 900,
                color: isHovered ? "#FFFFFF" : "#E5E5E5",
                fontFamily: "monospace",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                textShadow: isHovered
                  ? "0 0 10px rgba(255, 119, 0, 0.4)"
                  : "none",
                transition: "color 0.2s ease, text-shadow 0.2s ease",
              }}
            >
              COLLECTION #{collection.name}
            </Title>
          </Stack>

          {/* Footer Metadata */}
          <Group justify="space-between" align="center" mt="md">
            <Text
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#737373",
              }}
            >
              DATE: {collection.date}
            </Text>

            <Group gap={4}>
              <Text
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: isHovered ? "#FF7700" : "#525252",
                  letterSpacing: "0.5px",
                  transition: "color 0.2s ease",
                }}
              >
                OPEN
              </Text>
              <IconArrowUpRight
                size={18}
                color={isHovered ? "#FF7700" : "#525252"}
                style={{
                  transform: isHovered ? "translate(2px, -2px)" : "none",
                  transition: "transform 0.2s ease, color 0.2s ease",
                }}
              />
            </Group>
          </Group>
        </Stack>

        {/* 30% Width: Background Image Loop Box */}
        <Box
          style={{
            flex: "0 0 30%",
            width: "30%",
            minHeight: "130px",
            borderRadius: "6px",
            border: isHovered ? "1px solid #FF7700" : "1px solid #262626",
            backgroundImage: bgImageUrl
              ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.75)), url("${bgImageUrl}")`
              : "none",
            backgroundColor: "#121212",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "all 0.3s ease",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px",
            overflow: "hidden",
          }}
        >
          {/* Top Indicator */}
          <Group justify="space-between" align="center">
            <Badge
              size="xs"
              style={{
                fontFamily: "monospace",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "#FF7700",
                border: "1px solid rgba(255, 119, 0, 0.4)",
              }}
            >
              PREVIEW
            </Badge>

            {itemCount > 1 && (
              <Text
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#FF7700",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontWeight: 700,
                }}
              >
                {currentImageIndex + 1}/{itemCount}
              </Text>
            )}
          </Group>
        </Box>
      </Flex>
    </Paper>
  );
}
