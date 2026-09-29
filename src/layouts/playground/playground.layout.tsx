import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Grid,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconArrowUpRight, IconBook2, IconExclamationCircle, IconTerminal } from "@tabler/icons-react";
import { DatabaseTables } from "../../enums/database.enums";
import type { PostEntity } from "../../models/entity/post.model";
import DatabaseService from "../../services/database.service";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";
import JapaneseSignal from "../../components/background/japanese.signal";
import Footer from "../../components/footer/footer";
import { useAnimatedNavigate } from "../../components/transition/transition";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";

type SortOrder = "latest" | "oldest";

function formatDate(value: string | null | undefined) {
  if (!value) return "DATE UNFILED";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function PlaygroundPostCard({ post }: { post: PostEntity }) {
  const navigate = useAnimatedNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const date = formatDate(post.published_at || post.created_at);

  return (
    <UnstyledButton
      component="a"
      href={`/playground/${encodeURIComponent(post.slug)}`}
      onClick={(event) => {
        event.preventDefault();
        navigate(`/playground/${encodeURIComponent(post.slug)}`);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: "block", width: "100%", textAlign: "left" }}
    >
      <Paper
        p="lg"
        radius={8}
        style={{
          backgroundColor: isHovered ? "var(--folio-card-hover)" : "var(--folio-card)",
          border: isHovered ? "1px solid var(--folio-accent)" : "1px solid var(--folio-card-border)",
          boxShadow: isHovered ? "0 0 20px rgba(255, 119, 0, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.4)",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
        }}
      >
        <Grid align="stretch" gap="lg">
          <Grid.Col span={{ base: 12, sm: 8, lg: 9 }}>
            <Stack justify="space-between" h="100%" gap="md">
              <Stack gap="xs">
                <Group justify="space-between" align="center" wrap="wrap">
                  <Group gap="xs">
                    <IconTerminal size={16} color={isHovered ? "var(--folio-accent)" : "var(--folio-muted)"} />
                    <Text
                      size="xs"
                      fw={700}
                      ff="DotGothic16"
                      c={isHovered ? "var(--folio-accent)" : "var(--folio-muted)"}
                      style={{ letterSpacing: 1 }}
                    >
                      // PLAYGROUND_{post.slug.toUpperCase()}
                    </Text>
                  </Group>
                  <Badge
                    size="sm"
                    variant="outline"
                    color="orange"
                    style={{ fontFamily: "DotGothic16", backgroundColor: "transparent" }}
                  >
                    FIELD NOTE
                  </Badge>
                </Group>

                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(22px, 3vw, 32px)",
                    fontWeight: 900,
                    color: "var(--folio-text)",
                    fontFamily: "DotGothic16",
                    letterSpacing: "-1px",
                    lineHeight: 1.1,
                    textShadow: isHovered ? "0 0 10px rgba(255, 119, 0, 0.4)" : "none",
                  }}
                >
                  {post.title}
                </Title>
                {post.excerpt && (
                  <Text c="dimmed" lineClamp={3} style={{ lineHeight: 1.65 }}>
                    {post.excerpt}
                  </Text>
                )}
              </Stack>

              <Group justify="space-between" align="center" mt="md">
                <Text size="xs" ff="DotGothic16" c="dimmed">
                  PUBLISHED: {date}
                </Text>
                <Group gap={4}>
                  <Text
                    size="xs"
                    fw={700}
                    ff="DotGothic16"
                    c={isHovered ? "var(--folio-accent)" : "var(--folio-muted)"}
                    style={{ letterSpacing: 0.5 }}
                  >
                    OPEN ENTRY
                  </Text>
                  <IconArrowUpRight
                    size={18}
                    color={isHovered ? "var(--folio-accent)" : "var(--folio-muted)"}
                    style={{ transform: isHovered ? "translate(2px, -2px)" : "none", transition: "transform 0.2s ease" }}
                  />
                </Group>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4, lg: 3 }}>
            <Box
              style={{
                width: "100%",
                minHeight: 130,
                height: "100%",
                minWidth: 0,
                borderRadius: 6,
                border: isHovered ? "1px solid var(--folio-accent)" : "1px solid #262626",
                backgroundImage: post.cover_image
                  ? `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.78)), url("${post.cover_image}")`
                  : "radial-gradient(circle at 70% 30%, rgba(255,119,0,.16), transparent 42%), linear-gradient(135deg, #191715, #090909)",
                backgroundColor: "#121212",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 10,
                overflow: "hidden",
              }}
            >
              <Group justify="space-between" align="center">
                <Badge
                  size="xs"
                  style={{
                    fontFamily: "DotGothic16",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "var(--folio-accent)",
                    border: "1px solid rgba(255, 119, 0, 0.4)",
                  }}
                >
                  PREVIEW
                </Badge>
                <IconBook2 size={16} color="var(--folio-accent)" />
              </Group>
              <Text size="xs" fw={700} ff="DotGothic16" c="white" lineClamp={1}>
                {post.slug.toUpperCase()}
              </Text>
            </Box>
          </Grid.Col>
        </Grid>
      </Paper>
    </UnstyledButton>
  );
}

export default function PlaygroundLayout() {
  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");

  const fetchPosts = useCallback(async () => {
    const { data, error: queryError } = await DatabaseService.getInstance()
      .getDatabase()
      .from(DatabaseTables.Blogs)
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (queryError) throw queryError;
    return (data || []) as PostEntity[];
  }, []);

  useEffect(() => {
    let active = true;
    fetchPosts()
      .then((result) => {
        if (active) setPosts(result);
      })
      .catch((fetchError: unknown) => {
        console.error("Unable to load playground entries:", fetchError);
        if (active) setError("The archive could not be reached. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchPosts]);

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = Date.parse(a.published_at || a.created_at || "") || 0;
    const dateB = Date.parse(b.published_at || b.created_at || "") || 0;
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <LayoutWrapper>
      <Stack mb={100}>
        <Group pt={60} justify="center">
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
              PLAYGROUND
            </Title>
          </Stack>
        </Group>

        <Group
          className="playground-toolbar"
          px="md"
          justify="space-between"
          align="center"
          wrap="wrap"
          gap="md"
        >
          <Group gap="xs">
            <IconBook2 size={18} color="#FF7700" />
            <Text size="xs" fw={700} ff="DotGothic16" c="#FF7700" style={{ letterSpacing: 1 }}>
              EXPERIMENTAL // PLAYGROUND
            </Text>
          </Group>

          <Text size="xs" c="dimmed" ff="DotGothic16">
            ENTRIES: {String(posts.length).padStart(2, "0")}
          </Text>
        </Group>

        <Stack gap="md" px="md">
          <Group justify="space-between" align="center" mb="xs">
            <Group gap="xs">
              <IconTerminal size={18} color="#FF7700" />
              <Text size="xs" fw={700} ff="DotGothic16" c="#FF7700" style={{ letterSpacing: 1 }}>
                // PLAYGROUND_ARCHIVE
              </Text>
            </Group>
            <Text size="xs" ff="DotGothic16" c="#737373">
              TOTAL: {sortedPosts.length}
            </Text>
          </Group>

          {loading ? (
            <Group justify="center" py="xl"><Loader color="orange" /></Group>
          ) : error ? (
            <Paper p="lg" withBorder radius="sm">
              <Group gap="sm" c="orange">
                <IconExclamationCircle size={18} />
                <Text>{error}</Text>
              </Group>
            </Paper>
          ) : sortedPosts.length ? (
            <Stack gap="md">
              {sortedPosts.map((post) => <PlaygroundPostCard key={post.id} post={post} />)}
            </Stack>
          ) : (
            <Paper p="lg" radius={8} style={{ background: "var(--folio-card)", border: "1px solid var(--folio-card-border)" }}>
              <Stack gap="xs">
                <Text size="xs" c="orange" ff="DotGothic16">// NO_PUBLISHED_ENTRIES</Text>
                <Title order={3} c="var(--folio-text)">The playground is still taking shape.</Title>
                <Text c="dimmed">Published journal entries will appear here when they are ready.</Text>
              </Stack>
            </Paper>
          )}
        </Stack>

        <JapaneseSignal channel="playground" className="section-japanese-signal--end" />
      </Stack>
      <Footer />
    </LayoutWrapper>
  );
}
