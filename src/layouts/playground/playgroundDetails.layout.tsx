import { useEffect, useState } from "react";
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconCalendar, IconExclamationCircle } from "@tabler/icons-react";
import { useParams } from "react-router";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { DatabaseTables } from "../../enums/database.enums";
import type { PostEntity } from "../../models/entity/post.model";
import DatabaseService from "../../services/database.service";
import JapaneseSignal from "../../components/background/japanese.signal";
import { useAnimatedNavigate } from "../../components/transition/transition";

function formatDate(value: string | null | undefined) {
  if (!value) return "DATE UNFILED";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date);
}

function BlogArticleContent({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content,
    editable: false,
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

export default function PlaygroundDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useAnimatedNavigate();
  const [post, setPost] = useState<PostEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPost = async () => {
      if (!slug) {
        setError("This journal entry has no address.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await DatabaseService.getInstance()
        .getDatabase()
        .from(DatabaseTables.Blogs)
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!isMounted) return;
      if (queryError) {
        setError("The entry could not be loaded. Please try again later.");
      } else if (!data) {
        setError("This entry is unavailable or has not been published.");
      } else {
        setPost(data as PostEntity);
      }
      setLoading(false);
    };
    void fetchPost();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <Container size="md" py={{ base: 72, sm: 96 }}>
      <Stack gap="xl">
        <Button
          variant="subtle"
          color="orange"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate("/playground")}
          style={{ alignSelf: "flex-start" }}
        >
          BACK TO PLAYGROUND
        </Button>

        {loading ? (
          <Loader color="orange" />
        ) : error ? (
          <Alert
            color="orange"
            icon={<IconExclamationCircle size={18} />}
            title="ENTRY NOT FOUND"
          >
            {error}
          </Alert>
        ) : post ? (
          <article>
            <Stack gap="lg">
              <Stack gap="sm">
                <Group gap="xs">
                  <Badge variant="outline" color="orange" ff="monospace">
                    FIELD NOTE // {post.slug}
                  </Badge>
                  <Group gap={6} c="dimmed">
                    <IconCalendar size={14} />
                    <Text size="xs" ff="monospace">
                      {formatDate(post.published_at || post.created_at)}
                    </Text>
                  </Group>
                </Group>
                <Title order={1} c="var(--folio-text)" size="clamp(2rem, 6vw, 3.5rem)">
                  {post.title}
                </Title>
                {post.excerpt && (
                  <Text size="lg" c="dimmed" maw={720}>
                    {post.excerpt}
                  </Text>
                )}
              </Stack>

              {post.cover_image && (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  radius="sm"
                  mah={520}
                  fit="cover"
                  fallbackSrc="https://placehold.co/1200x700?text=PLAYGROUND+ARCHIVE"
                />
              )}

              <Paper
                p={{ base: "md", sm: "xl" }}
                radius="sm"
                withBorder
                style={{ background: "var(--folio-card)" }}
              >
                <BlogArticleContent content={post.content} />
              </Paper>

              <Box pt="md">
                <JapaneseSignal channel="playground" className="section-japanese-signal--end" />
              </Box>
            </Stack>
          </article>
        ) : null}

        <Anchor
          component="button"
          type="button"
          c="dimmed"
          size="sm"
          onClick={() => navigate("/playground")}
          style={{ alignSelf: "flex-start" }}
        >
          Return to all entries
        </Anchor>
      </Stack>
    </Container>
  );
}
