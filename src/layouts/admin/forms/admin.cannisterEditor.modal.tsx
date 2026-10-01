import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Container,
  Group,
  Image,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  TagsInput,
  Text,
  Tooltip,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";
import type CannisterEntity from "../../../models/entity/cannister.model";
import CannisterService, {
  type CannisterImageFile,
} from "../../../services/cannister.service";
import { DatabaseTables } from "../../../enums/database.enums";
import DatabaseService from "../../../services/database.service";

const IMAGE_FILE = /^\d+\.jpg$/i;

export function CannisterEditorPage() {
  const { cannisterId } = useParams<{ cannisterId: string }>();
  const navigate = useNavigate();
  const [cannister, setCannister] = useState<CannisterEntity | null>(null);
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [images, setImages] = useState<CannisterImageFile[]>([]);
  const [draftTags, setDraftTags] = useState<string[] | null>(null);
  const [draftCategoryId, setDraftCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const tags = draftTags ?? cannister?.tags ?? [];
  const categoryId =
    draftCategoryId ?? (cannister ? String(cannister.category_id ?? "") : null);
  const storage = useMemo(
    () =>
      DatabaseService.getInstance()
        .getDatabase()
        .storage.from(DatabaseTables.Cannisters),
    [],
  );

  useEffect(() => {
    let isActive = true;

    async function loadCannister() {
      const [records, categoryResponse] = await Promise.all([
        CannisterService.getInstance().fetchCannisters(),
        DatabaseService.getInstance().getAll("categories"),
      ]);
      if (!isActive) return;
      const record =
        (records as CannisterEntity[]).find(
          (item) => String(item.id) === cannisterId,
        ) ?? null;
      setCannister(record);
      if (categoryResponse.data) {
        setCategories(
          categoryResponse.data.map(
            (category: { id: number; name: string }) => ({
              value: String(category.id),
              label: category.name,
            }),
          ),
        );
      }
    }

    void loadCannister().catch((error: unknown) => {
      notifications.show({
        title: "Could not load cannister",
        message: error instanceof Error ? error.message : "Please try again.",
        color: "red",
      });
    });

    return () => {
      isActive = false;
    };
  }, [cannisterId]);

  const refreshImages = useCallback(async () => {
    if (!cannister) return [];
    const result = await CannisterService.getInstance().fetchCannisterItems(
      cannister.name,
    );
    return Array.isArray(result)
      ? result
          .filter((file) => IMAGE_FILE.test(file.name))
          .map((file) => ({ name: file.name }))
      : [];
  }, [cannister]);

  useEffect(() => {
    if (!cannister) return;
    let isActive = true;
    void refreshImages()
      .then((nextImages) => {
        if (isActive) setImages(nextImages);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        notifications.show({
          title: "Could not list cannister images",
          message:
            error instanceof Error
              ? error.message
              : "Check the folder path and Storage permissions.",
          color: "red",
        });
      });
    return () => {
      isActive = false;
    };
  }, [cannister, refreshImages]);

  const getImageUrl = (fileName: string) =>
    storage.getPublicUrl(`${cannister?.name}/${fileName}`).data.publicUrl;

  const uploadImages = async (files: File[]) => {
    if (!cannister || files.length === 0) return;
    setLoading(true);
    try {
      const highestIndex = images.reduce((highest, file) => {
        const index = Number(file.name.match(/^(\d+)\.jpg$/i)?.[1] ?? 0);
        return Math.max(highest, index);
      }, 0);
      await CannisterService.getInstance().uploadImages(
        cannister.name,
        files,
        highestIndex + 1,
      );
      setImages(await refreshImages());
      notifications.show({
        title: "Images uploaded",
        message: `${files.length} image(s) added.`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Upload failed",
        message:
          error instanceof Error ? error.message : "Could not upload images.",
        color: "red",
      });
      setImages(await refreshImages());
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (fileName: string) => {
    if (
      !cannister ||
      !window.confirm(`Delete ${fileName}? This cannot be undone.`)
    )
      return;
    setLoading(true);
    try {
      await CannisterService.getInstance().deleteImage(
        cannister.name,
        fileName,
      );
      setImages(await refreshImages());
      notifications.show({
        title: "Image deleted",
        message: `${fileName} was removed.`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Delete failed",
        message:
          error instanceof Error ? error.message : "Could not delete image.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveInformation = async () => {
    if (!cannister || !categoryId) return;
    setLoading(true);
    try {
      const result = await CannisterService.getInstance().updateCannister(
        cannister.id,
        {
          tags,
          category_id: Number(categoryId),
        },
      );
      if (result.error) throw new Error(result.error.message);
      setCannister((current) =>
        current
          ? {
              ...current,
              tags,
              category_id: Number(categoryId),
            }
          : current,
      );
      setDraftTags(null);
      setDraftCategoryId(null);
      notifications.show({
        title: "Cannister updated",
        message: "Information saved.",
        color: "green",
      });
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Update failed",
        message:
          error instanceof Error
            ? error.message
            : "Could not save cannister information.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid pos="relative" style={{ flex: 1, overflowY: "auto" }}>
      <LoadingOverlay
        visible={!cannister || loading}
        overlayProps={{ blur: 1 }}
      />
      <Stack gap="lg" pb="xl">
        <Group justify="space-between" align="center">
          <Button
            variant="default"
            onClick={() => navigate("/admin/cannisters")}
          >
            Back to Cannisters
          </Button>
          {cannister && (
            <Text size="xs" c="dimmed">
              ID {cannister.id}
            </Text>
          )}
        </Group>
        {cannister && (
          <>
            <Text component="h1" size="xl" fw={700} m={0}>
              Cannister · {cannister.name}
            </Text>
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase">
                Cannister information
              </Text>
              <Stack mt="sm" maw={560}>
                <Text size="sm" fw={600}>
                  {cannister.name}
                </Text>
                <Select
                  label="Category"
                  data={categories}
                  value={categoryId}
                  onChange={setDraftCategoryId}
                  searchable
                  allowDeselect={false}
                />
                <TagsInput label="Tags" value={tags} onChange={setDraftTags} />
                <Button
                  onClick={() => void saveInformation()}
                  color="blue"
                  w="fit-content"
                >
                  Save info
                </Button>
              </Stack>
              <Text size="xs" c="dimmed" mt="xs">
                Created {new Date(cannister.created_at).toLocaleString()} ·
                Storage folder: {cannister.name}/
              </Text>
            </Box>

            <Box>
              <Group justify="space-between" mb="sm">
                <Text size="xs" c="dimmed" tt="uppercase">
                  Images ({images.length})
                </Text>
                <Text size="xs" c="dimmed">
                  Sequential JPEG names: 1.jpg, 2.jpg, ...
                </Text>
              </Group>
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                multiple
                loading={loading}
                onDrop={(files) => void uploadImages(files)}
                onReject={() =>
                  notifications.show({
                    title: "Invalid image",
                    message: "Choose a supported image file.",
                    color: "red",
                  })
                }
                p="md"
                radius="sm"
                style={{ borderStyle: "dashed" }}
              >
                <Group
                  justify="center"
                  gap="md"
                  mih={72}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload size={24} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={24} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={24} />
                  </Dropzone.Idle>
                  <Stack gap={0}>
                    <Text size="sm">
                      Drop images to add, or click to browse
                    </Text>
                    <Text size="xs" c="dimmed">
                      Images are converted to JPEG and assigned the next
                      available index.
                    </Text>
                  </Stack>
                </Group>
              </Dropzone>
            </Box>

            {images.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                This cannister has no images yet.
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
                {images
                  .slice()
                  .sort(
                    (first, second) =>
                      Number(first.name.split(".")[0]) -
                      Number(second.name.split(".")[0]),
                  )
                  .map((image) => (
                    <Box key={image.name} pos="relative">
                      <Image
                        src={getImageUrl(image.name)}
                        alt={`${cannister.name} ${image.name}`}
                        fit="cover"
                        radius="sm"
                        style={{
                          aspectRatio: "4 / 3",
                          background: "var(--mantine-color-default)",
                        }}
                      />
                      <Group justify="space-between" mt={4}>
                        <Text size="xs" c="dimmed">
                          {image.name}
                        </Text>
                        <Tooltip label={`Delete ${image.name}`}>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            aria-label={`Delete image ${image.name}`}
                            onClick={() => void deleteImage(image.name)}
                            disabled={loading}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Box>
                  ))}
              </SimpleGrid>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
