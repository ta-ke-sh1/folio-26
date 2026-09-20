import { Stack, Group, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import CollectionCard from "../../../components/card/listItem.card";
import { type CollectionEntity } from "../../../models/entity/collection.model";
// --- Main Collection List View ---
export default function CollectionListView({
  data,
}: {
  data: CollectionEntity[];
}) {
  const collectionsData: CollectionEntity[] = data;

  return (
    <Stack gap="md" pr="md" pl="md" style={{ margin: "0 auto", width: "100%" }}>
      {/* List Header */}
      <Group justify="space-between" align="center" mb="xs">
        <Group gap="xs">
          <IconFolder size={18} color="#FF7700" />
          <Text
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: 700,
              color: "#FF7700",
              letterSpacing: "1px",
            }}
          >
            // COLLECTIONS_LIST
          </Text>
        </Group>

        <Text
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#737373",
          }}
        >
          TOTAL: {collectionsData.length}
        </Text>
      </Group>

      {/* Collection Cards */}
      <Stack gap="md">
        {collectionsData.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </Stack>
    </Stack>
  );
}
