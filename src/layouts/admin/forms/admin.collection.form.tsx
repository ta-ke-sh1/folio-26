import { useEffect } from "react";
import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

export interface CollectionFormValues {
  name: string;
  date: string;
}

interface CollectionFormModalProps {
  opened: boolean;
  onClose: () => void;
  editingItem: any | null;
  onSubmit: (values: CollectionFormValues) => Promise<void>;
}

export function CollectionFormModal({
  opened,
  onClose,
  editingItem,
  onSubmit,
}: CollectionFormModalProps) {
  const form = useForm<CollectionFormValues>({
    initialValues: { name: "", date: "" },
  });

  useEffect(() => {
    if (opened) {
      const today = new Date().toISOString().split("T")[0];
      form.setValues({
        name: editingItem?.name || "",
        date: editingItem?.date || today,
      });
    }
  }, [opened, editingItem]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingItem ? "Edit Collection" : "Add Collection"}
      centered
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            required
            label="Collection Name"
            placeholder="Name..."
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Date"
            placeholder="YYYY-MM-DD"
            {...form.getInputProps("date")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              {editingItem ? "Save Changes" : "Create"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
