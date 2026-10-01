import { useState } from "react";
import {
  Box,
  Group,
  Modal,
  Select,
  Stack,
  TagsInput,
  TextInput,
  Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";

export interface CannisterFormValues {
  name: string;
  tags: string[];
  category_id: string;
}

interface CannisterCreateModalProps {
  opened: boolean;
  onClose: () => void;
  categories: { value: string; label: string }[];
  onSubmit: (values: CannisterFormValues, files: File[]) => Promise<boolean>;
}

export function CannisterCreateModal({
  opened,
  onClose,
  categories,
  onSubmit,
}: CannisterCreateModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<CannisterFormValues>({
    initialValues: { name: "", tags: [], category_id: "" },
    validate: {
      name: (value) => (value.trim() ? null : "Enter a cannister name"),
      category_id: (value) => (value ? null : "Select a category"),
    },
  });

  const submit = async (values: CannisterFormValues) => {
    const created = await onSubmit(values, files);
    if (created) {
      form.reset();
      setFiles([]);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create cannister" centered size="lg">
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          <TextInput
            required
            label="Cannister name"
            description="Used as the folder name in the cannisters storage bucket."
            placeholder="e.g. Ambient Studies"
            {...form.getInputProps("name")}
          />
          <Select
            required
            label="Category"
            placeholder={categories.length ? "Choose a category" : "No categories available"}
            data={categories}
            disabled={categories.length === 0}
            {...form.getInputProps("category_id")}
          />
          <TagsInput
            label="Tags"
            placeholder="Type a tag and press Enter"
            {...form.getInputProps("tags")}
          />
          <Box>
            <Text size="sm" fw={500} mb={6}>Images</Text>
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              multiple
              onDrop={(droppedFiles) => setFiles((current) => [...current, ...droppedFiles])}
              onReject={() => undefined}
              p="lg"
              radius="sm"
              style={{ borderStyle: "dashed" }}
            >
              <Group justify="center" gap="xl" mih={90} style={{ pointerEvents: "none" }}>
                <Dropzone.Accept><IconUpload size={28} /></Dropzone.Accept>
                <Dropzone.Reject><IconX size={28} /></Dropzone.Reject>
                <Dropzone.Idle><IconPhoto size={28} /></Dropzone.Idle>
                <Stack gap={2}>
                  <Text size="sm">Drop multiple images here or click to browse</Text>
                  <Text size="xs" c="dimmed">Images are converted to JPEG and stored as 1.jpg, 2.jpg, etc.</Text>
                </Stack>
              </Group>
            </Dropzone>
            {files.length > 0 && (
              <Text size="xs" c="dimmed" mt="xs">
                {files.length} {files.length === 1 ? "image" : "images"} selected: {files.map((file) => file.name).join(", ")}
              </Text>
            )}
          </Box>
          <Group justify="flex-end" mt="sm">
            <Button variant="default" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" color="blue" disabled={categories.length === 0}>Create cannister</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
