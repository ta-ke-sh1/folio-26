import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import CollectionService from "../../services/collection.service.ts";
import { useNavigate, useParams } from "react-router";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper.tsx";
import { CollectionItemCard } from "../../components/card/collectionItem.card.tsx";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";
import Footer from "../../components/footer/footer.tsx";
import type { CollectionItemEntity } from "../../models/entity/collection.model";
import { IconChevronLeft, IconFile } from "@tabler/icons-react";
import { ShuffleText } from "../../components/animations/shuffle.text.tsx";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "author-asc", label: "Author (A–Z)" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export default function CollectionDetailsLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<CollectionItemEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<string | null>("name-asc");
  const [isPrevHovered, setIsPrevHovered] = useState(false);

  const filteredData = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const filtered = data.filter((item) => {
      const searchableText = [
        item.name,
        item.author,
        item.year,
        ...(item.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "author-asc":
          return a.author.localeCompare(b.author);
        case "newest":
          return Date.parse(b.created_at) - Date.parse(a.created_at);
        case "oldest":
          return Date.parse(a.created_at) - Date.parse(b.created_at);
        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [data, searchQuery, sortOrder]);

  useEffect(() => {
    async function fetchData() {
      const response =
        await CollectionService.getInstance().getCollectionItemsById(
          Number(id),
        );
      if (response.success) {
        setData((response.data ?? []) as CollectionItemEntity[]);
      } else {
        console.error(response.error);
      }
    }

    (async () => await fetchData())();
  }, [id]);

  const handleReturn = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/collections");
    }
  };

  return (
    <LayoutWrapper>
      <Stack mb={100} pl={"md"} pr={"md"}>
        <Group pt={"60"} justify={"center"}>
          <Stack justify="center">
            <Title
              style={{
                fontSize: "clamp(36px, 7vw, 84px)",
                fontWeight: 900,
                color: "#FF7700",
                fontFamily: "DotGothic16",
                letterSpacing: "-2px",
                lineHeight: 1,
                textShadow: "0 0 12px rgba(255, 119, 0, 0.6)",
                textAlign: "center",
              }}
            >
              <BilingualShuffle
                english={`COLLECTIONS`}
                japanese={`コレクション`}
              />
              <br/>
              <BilingualShuffle
                english={`${id}`}
                japanese={`${id}`}
              />
            </Title>
          </Stack>
        </Group>
        <Stack
          gap={0}
          style={{
            minHeight: "100dvh",
          }}
        >
          <Group className="collections-toolbar__previous" mb={"16"}>
            <Button
              className="collections-toolbar__button"
              size="md"
              leftSection={<IconChevronLeft size={18} color="#FF7700" />}
              onClick={handleReturn}
              onMouseEnter={() => setIsPrevHovered(true)}
              onMouseLeave={() => setIsPrevHovered(false)}
              style={{
                backgroundColor: isPrevHovered
                  ? "rgba(255, 119, 0, 0.15)"
                  : "var(--folio-card)",
                border: isPrevHovered
                  ? "1px solid #FF9933"
                  : "1px solid #FF7700",
                borderRadius: "6px",
                boxShadow: isPrevHovered
                  ? "0 0 18px rgba(255, 119, 0, 0.5)"
                  : "none",
                transform: isPrevHovered ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                padding: "8px 18px",
                cursor: "pointer",
              }}
            >
              <Text
                style={{
                  fontFamily: "DotGothic16",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#FF7700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                <ShuffleText text={`Return`} />
              </Text>
            </Button>
          </Group>
          
          <Group gap="xs">
              <IconFile size={18} color="#FF7700" />
              <Text
                style={{
                  fontFamily: "DotGothic16",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#FF7700",
                  letterSpacing: "1px",
                }}
              >
                // COLLECTIONS_ITEMS
              </Text>
            </Group>
          <Group align="end" mt={5}>
            <TextInput
              aria-label="Search collection items"
              label="Search items"
              placeholder="Search name, author, year, or tag"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
            <Select
              aria-label="Order collection items"
              label="Order by"
              data={SORT_OPTIONS}
              value={sortOrder}
              onChange={setSortOrder}
              allowDeselect={false}
            />
            <Text size="sm" c="dimmed" mb={8}>
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "item" : "items"}
            </Text>
          </Group>
          <Grid mt={18}>
            {filteredData.map((d, index) => (
              <Grid.Col
                span={{
                  base: 6,
                  xs: 6,
                  sm: 4,
                }}
                key={`card-item-${index}`}
              >
                <CollectionItemCard data={d} />
              </Grid.Col>
            ))}
          </Grid>
          {filteredData.length === 0 && (
            <Text ta="center" c="dimmed" py="xl">
              No items match your search.
            </Text>
          )}
        </Stack>
      </Stack>
      <Footer />
    </LayoutWrapper>
  );
}
