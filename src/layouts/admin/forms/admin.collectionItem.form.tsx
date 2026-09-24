import { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Select,
  TagsInput,
  Group,
  LoadingOverlay,
  Text,
  Image,
  ActionIcon,
  Box,
} from "@mantine/core";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconUpload, IconPhoto, IconX, IconTrash } from "@tabler/icons-react";
import DatabaseService from "../../../services/database.service";

export interface ItemFormValues {
  name: string;
  url: string;
  author: string;
  year: string;
  collection_id: string;
  category_id: string;
  tags: string[];
  imageFile: File | null;
}

interface ItemFormModalProps {
  opened: boolean;
  onClose: () => void;
  editingItem: any | null;
  onSubmit: (values: ItemFormValues) => Promise<void>;
}

export function ItemFormModal({
  opened,
  onClose,
  editingItem,
  onSubmit,
}: ItemFormModalProps) {
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [collections, setCollections] = useState<
    { value: string; label: string }[]
  >([]);
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  // Track new file upload previews & explicit removal
  const [newFilePreviewUrl, setNewFilePreviewUrl] = useState<string | null>(
    null,
  );
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const db = DatabaseService.getInstance();

  const form = useForm<ItemFormValues>({
    initialValues: {
      name: "",
      url: "",
      author: "",
      year: "2026",
      collection_id: "",
      category_id: "",
      tags: [],
      imageFile: null,
    },
  });

  // Helper to clear preview state & revoke object URLs to prevent memory leaks
  const resetImageState = useCallback(() => {
    setNewFilePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setIsImageRemoved(false);
  }, []);

  useEffect(() => {
    if (!opened) {
      resetImageState();
      return;
    }

    let isMounted = true;

    async function loadFormDependencies() {
      setLoadingLookups(true);
      try {
        const [colsRes, catsRes, tagsRes] = await Promise.all([
          db.getAll("collections"),
          db.getAll("categories"),
          db.getAll("tags"),
        ]);

        if (isMounted) {
          if (colsRes.data) {
            setCollections(
              colsRes.data.map((c: any) => ({
                value: String(c.id),
                label: c.name,
              })),
            );
          }
          if (catsRes.data) {
            setCategories(
              catsRes.data.map((c: any) => ({
                value: String(c.id),
                label: c.name,
              })),
            );
          }
          if (tagsRes.data) {
            setTagOptions(tagsRes.data.map((t: any) => t.name));
          }
        }
      } catch (err) {
        console.error("Failed to load dependencies:", err);
      } finally {
        if (isMounted) setLoadingLookups(false);
      }
    }

    loadFormDependencies();

    // Populate form if editingItem exists, otherwise reset form
    if (editingItem != null) {
      form.setValues({
        name: editingItem.name || "",
        url: editingItem.url || "",
        author: editingItem.author || "",
        year: String(editingItem.year || "2026"),
        collection_id: String(editingItem.collection_id || ""),
        category_id: String(editingItem.category_id || ""),
        tags: editingItem.tags || [],
        imageFile: null,
      });
    } else {
      form.reset();
    }

    resetImageState();

    return () => {
      isMounted = false;
    };
  }, [opened, editingItem, db, resetImageState]);

  // Derive preview URL directly during render
  const currentPreview =
    newFilePreviewUrl ??
    (!isImageRemoved ? editingItem?.image_url || null : null);

  // Event Handlers
  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      if (newFilePreviewUrl) {
        URL.revokeObjectURL(newFilePreviewUrl);
      }
      form.setFieldValue("imageFile", file);
      setNewFilePreviewUrl(URL.createObjectURL(file));
      setIsImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    if (newFilePreviewUrl) {
      URL.revokeObjectURL(newFilePreviewUrl);
    }
    form.setFieldValue("imageFile", null);
    setNewFilePreviewUrl(null);
    setIsImageRemoved(true);
  };

  const handleClose = () => {
    resetImageState();
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: ItemFormValues) => {
    await onSubmit(values);
    resetImageState();
    form.reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={editingItem ? "Edit Collection Item" : "Add Collection Item"}
      centered
      size="lg"
    >
      <Box pos="relative">
        <LoadingOverlay visible={loadingLookups} overlayProps={{ blur: 1 }} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              required
              label="Name"
              placeholder="Item name..."
              {...form.getInputProps("name")}
            />
            <TextInput
              label="URL"
              placeholder="https://..."
              {...form.getInputProps("url")}
            />
            <TextInput
              label="Author"
              placeholder="Author name"
              {...form.getInputProps("author")}
            />
            <TextInput
              label="Year"
              placeholder="2026"
              {...form.getInputProps("year")}
            />

            <Select
              required
              label="Collection"
              placeholder="Select collection"
              data={collections}
              searchable
              {...form.getInputProps("collection_id")}
            />

            <Select
              required
              label="Category"
              placeholder="Select category"
              data={categories}
              searchable
              {...form.getInputProps("category_id")}
            />

            {/* TagsInput replaced MultiSelect to support custom entry and comma-split */}
            <TagsInput
              label="Tags"
              placeholder="Type tag and press Enter or comma"
              data={tagOptions}
              splitChars={[",", ", "]}
              clearable
              {...form.getInputProps("tags")}
            />

            <Text size="sm" fw={500} mt="xs">
              Item Image
            </Text>
            {currentPreview ? (
              <Group align="center">
                <Image
                  src={currentPreview}
                  h={120}
                  w="auto"
                  fit="contain"
                  radius="md"
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={handleRemoveImage}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            ) : (
              <Dropzone
                onDrop={handleDrop}
                maxFiles={1}
                accept={IMAGE_MIME_TYPE}
                multiple={false}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={120}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload size={40} color="var(--mantine-color-blue-6)" />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={40} color="var(--mantine-color-red-6)" />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={40} color="var(--mantine-color-dimmed)" />
                  </Dropzone.Idle>
                  <div>
                    <Text size="sm" inline>
                      Drag an image here or click to select
                    </Text>
                    <Text size="xs" c="dimmed" inline mt={4}>
                      Upload 1 image file
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" color="blue">
                {editingItem ? "Save Changes" : "Create"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
