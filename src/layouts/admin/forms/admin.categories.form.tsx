// components/admin/forms/CategoryFormModal.tsx
import { useEffect } from "react";
import { Modal, Stack, TextInput, Group } from "@mantine/core";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";
import { useForm } from "@mantine/form";

export function CategoryFormModal({
  opened,
  onClose,
  editingItem,
  onSubmit,
}: any) {
  const form = useForm({ initialValues: { name: "" } });

  useEffect(() => {
    if (opened) form.setValues({ name: editingItem?.name || "" });
  }, [opened, editingItem]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingItem ? "Edit Category" : "Add Category"}
      centered
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            required
            label="Category Name"
            placeholder="Name..."
            {...form.getInputProps("name")}
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
