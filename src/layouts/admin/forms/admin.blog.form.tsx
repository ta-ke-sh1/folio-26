import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy, IconExclamationCircle } from "@tabler/icons-react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useParams } from "react-router";
import { useAnimatedNavigate } from "../../../components/transition/transition";
import { DatabaseTables } from "../../../enums/database.enums";
import type { BlogFormValues, PostEntity } from "../../../models/entity/post.model";
import DatabaseService from "../../../services/database.service";

const EMPTY_VALUES: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  published: false,
};

export function BlogEditorPage() {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useAnimatedNavigate();
  const [loading, setLoading] = useState(Boolean(blogId));
  const [error, setError] = useState<string | null>(null);
  const [existingPost, setExistingPost] = useState<PostEntity | null>(null);
  const form = useForm<BlogFormValues>({
    initialValues: EMPTY_VALUES,
    validate: {
      title: (value) => value.trim() ? null : "Title is required",
      slug: (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
        ? null
        : "Use lowercase letters, numbers, and hyphens",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
    ],
    content: "",
    onUpdate: ({ editor: activeEditor }) => {
      form.setFieldValue("content", activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!blogId) return;
    let active = true;
    const loadPost = async () => {
      try {
        const { data, error: queryError } = await DatabaseService.getInstance()
          .getDatabase()
          .from(DatabaseTables.Blogs)
          .select("*")
          .eq("id", Number(blogId))
          .maybeSingle();
        if (queryError) throw queryError;
        if (!data) throw new Error("Blog entry not found.");
        if (!active) return;
        const post = data as PostEntity;
        setExistingPost(post);
        form.setValues({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content || "",
          cover_image: post.cover_image || "",
          published: post.published,
        });
        editor?.commands.setContent(post.content || "", { emitUpdate: false });
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load this entry.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadPost();
    return () => {
      active = false;
    };
  }, [blogId, editor, form]);

  const handleSubmit = async (values: BlogFormValues) => {
    if (!editor || !editor.getText().trim()) {
      setError("Add some content before saving this entry.");
      return;
    }
    setLoading(true);
    setError(null);
    const payload = {
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      excerpt: values.excerpt?.trim() || null,
      content: editor.getHTML(),
      cover_image: values.cover_image?.trim() || null,
      published_at: values.published
        ? existingPost?.published_at || new Date().toISOString()
        : null,
      ...(existingPost?.category_id !== undefined
        ? { category_id: existingPost.category_id }
        : {}),
    };
    try {
      const db = DatabaseService.getInstance();
      const { error: saveError } = blogId
        ? await db.updateById(DatabaseTables.Blogs, Number(blogId), payload)
        : await db.create(DatabaseTables.Blogs, payload);
      if (saveError) throw saveError;
      navigate("/admin/blogs");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ flex: 1, minHeight: 0, overflow: "auto", position: "relative" }}>
      <LoadingOverlay visible={loading} overlayProps={{ blur: 1 }} />
      <Box maw={1100} mx="auto" p={{ base: "sm", sm: "lg" }}>
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate("/admin/blogs")}
            >
              Back to blog entries
            </Button>
            <Text size="xs" c="dimmed" ff="monospace">
              {blogId ? `EDITING ENTRY #${blogId}` : "NEW PLAYGROUND ENTRY"}
            </Text>
          </Group>

          <Title order={2}>{blogId ? "Edit Blog Entry" : "Create Blog Entry"}</Title>
          {error && (
            <Alert color="red" icon={<IconExclamationCircle size={18} />} title="Unable to save entry">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput required label="Title" placeholder="A working title..." {...form.getInputProps("title")} />
              <TextInput
                required
                label="URL Slug"
                placeholder="a-lowercase-url-slug"
                description="Public entry address: /playground/your-slug"
                {...form.getInputProps("slug")}
              />
              <TextInput label="Cover Image URL" placeholder="https://..." {...form.getInputProps("cover_image")} />
              <Textarea
                label="Excerpt"
                placeholder="A short introduction for the archive list..."
                autosize
                minRows={2}
                maxRows={5}
                {...form.getInputProps("excerpt")}
              />

              <Stack gap={6}>
                <Text size="sm" fw={500}>Content</Text>
                <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
                  <RichTextEditor editor={editor} variant="default">
                    <RichTextEditor.Toolbar sticky stickyOffset={0}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Code />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                      </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <Box mih={360}>
                      <RichTextEditor.Content />
                    </Box>
                  </RichTextEditor>
                </Paper>
                <Text size="xs" c="dimmed">Use the toolbar to format text, add headings, lists, quotes, code, and links.</Text>
              </Stack>

              <Switch
                label="Published"
                description="Published entries are visible in the public Playground."
                color="orange"
                {...form.getInputProps("published", { type: "checkbox" })}
              />

              <Group justify="flex-end" mt="sm">
                <Button type="button" variant="default" onClick={() => navigate("/admin/blogs")}>
                  Cancel
                </Button>
                <Button type="submit" leftSection={<IconDeviceFloppy size={16} />} color="blue" loading={loading}>
                  {blogId ? "Save Changes" : "Create Entry"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Box>
  );
}
