import { useMemo } from "react";
import { Stack, Group, Text } from "@mantine/core";
import CollectionCard from "../../../components/card/listItem.card";
import { type CollectionEntity } from "../../../models/entity/collection.model";
import BilingualShuffle from "../../../components/animations/bilingual.shuffle";

// --- Main Collection List View ---
export default function CollectionListView({
  data,
}: {
  data: CollectionEntity[];
}) {
  const collectionsData: CollectionEntity[] = data;
  const filteredCollections = useMemo(() => {
    return [...collectionsData].sort((a, b) => {
      const aDate = Date.parse(a.date) || Date.parse(a.created_at);
      const bDate = Date.parse(b.date) || Date.parse(b.created_at);
      return bDate - aDate;
    });
  }, [collectionsData]);

  return (
    <Stack gap="0" pr="md" pl="md" style={{ margin: "0 auto", width: "100%" }}>
      {/* List Header */}
      {/* Collection Cards */}
      <Stack
        gap="md"
        style={{
          minHeight: "70dvh",
        }}
      >
        {filteredCollections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </Stack>
      {filteredCollections.length === 0 && (
        <Stack
          justify="center"
          style={{
            height: "50dvh",
          }}
        >
          <Group justify="center">
            <Text ta="center" c="dimmed" py="xl">
              <BilingualShuffle
                english="No matching collections found!"
                japanese="検索に一致するコレクションはありません。"
              />
            </Text>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}
