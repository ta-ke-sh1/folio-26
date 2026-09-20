// components/admin/forms/TagFormModal.tsx
import { useEffect } from "react";
import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

export function TagFormModal({ opened, onClose, editingItem, onSubmit }: any) {
  const form = useForm({ initialValues: { name: "" } });

  useEffect(() => {
    if (opened) form.setValues({ name: editingItem?.name || "" });
  }, [opened, editingItem]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingItem ? "Edit Tag" : "Add Tag"}
      centered
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            required
            label="Tag Name"
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
