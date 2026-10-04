import { useMemo, useState } from "react";
import { Stack, Group, Select, Text, TextInput } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import CollectionCard from "../../../components/card/listItem.card";
import { type CollectionEntity } from "../../../models/entity/collection.model";
import BilingualShuffle from "../../../components/animations/bilingual.shuffle";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

// --- Main Collection List View ---
export default function CollectionListView({
  data,
}: {
  data: CollectionEntity[];
}) {
  const collectionsData: CollectionEntity[] = data;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<string | null>("newest");

  const filteredCollections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const filtered = collectionsData.filter((collection) => {
      const itemSearchText = (collection.collection_items ?? [])
        .flatMap((item) => [
          item.name,
          item.author,
          item.year,
          ...(item.tags ?? []),
        ])
        .filter(Boolean)
        .join(" ");
      const searchableText =
        `${collection.name} ${collection.date} ${itemSearchText}`.toLocaleLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "oldest": {
          const aDate = Date.parse(a.date) || Date.parse(a.created_at);
          const bDate = Date.parse(b.date) || Date.parse(b.created_at);
          return aDate - bDate;
        }
        case "newest":
        default: {
          const aDate = Date.parse(a.date) || Date.parse(a.created_at);
          const bDate = Date.parse(b.date) || Date.parse(b.created_at);
          return bDate - aDate;
        }
      }
    });
  }, [collectionsData, searchQuery, sortOrder]);

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
