import { Badge, Box, Divider, Group, Stack, Text } from "@mantine/core";
import "./date.card.scss";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useState } from "react";

interface CollectionItemCardProps {
  data: any;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export function CollectionItemCard({ data }: CollectionItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  function handleNavigate() {
    window.open(data.url);
  }

  return (
    <Stack gap={0}>
      <Box
        onClick={handleNavigate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="date-card"
        style={{
          height: "24dvh",
          minHeight: "100px",
          borderRadius: "6px",
          border: isHovered
            ? "1px solid var(--folio-accent)"
            : "1px solid var(--folio-card-border)",
          boxShadow: isHovered ? "0 0 20px rgba(255, 119, 0, 0.2)" : "none",
          cursor: data?.id ? "pointer" : "default",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          padding: "16px 24px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          backgroundImage: `url("${supabaseUrl}/storage/v1/object/public/collection_items/collection-${data.collection_id}-${data.name}.jpg")`,
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
          <Group
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          ></Group>

          {/* Content Title & Navigation Indicator */}
          <Group
            justify="end"
            align="center"
            style={{ width: "100%", marginTop: "2px" }}
          >
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
      <Divider mt={5} />
      <Text
        style={{
          fontSize: 16,
        }}
        c={"dimmed"}
      >
        {data.name}
      </Text>
      <Text
        mb={6}
        style={{
          fontSize: 12,
        }}
        c={"dimmed"}
      >
        {data.author}
      </Text>
      <Group gap={3}>
        {data.tags.map((t: any, index: number) => (
          <Badge color="gray" key={`${data.name}-${index}-tag`}>
            {t}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
}
