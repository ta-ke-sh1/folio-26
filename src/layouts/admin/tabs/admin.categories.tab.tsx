import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Group,
  Title,
  Box,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import { type DataTableColumn } from "mantine-datatable";
import DatabaseService from "../../../services/database.service";
import ViewTable from "../../../components/table/view.table";
import { CategoryFormModal } from "../forms/admin.categories.form";

export function CategoriesTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formModalOpened, { open: openFormModal, close: closeFormModal }] =
    useDisclosure(false);

  const db = DatabaseService.getInstance();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await db.getAll("categories");
      if (!error) setData(result || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    (async () => await fetchData())();
  }, [fetchData]);

  const handleSubmit = async (values: { name: string }) => {
    setLoading(true);
    try {
      if (editingItem) {
        await db.updateById("categories", editingItem.id, values);
      } else {
        await db.create("categories", values);
      }
      await fetchData();
      closeFormModal();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<any>[] = [
    { accessor: "id", title: "ID", sortable: true, width: 80 },
    { accessor: "name", title: "Category Name", sortable: true },
    {
      accessor: "created_at",
      title: "Created At",
      sortable: true,
      render: (r: any) => String(r.created_at || ""),
    },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (record) => (
        <Group gap="xs" justify="flex-end">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            onClick={() => {
              setEditingItem(record);
              openFormModal();
            }}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <Container
      fluid
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
      }}
    >
      <LoadingOverlay visible={loading} overlayProps={{ blur: 1 }} />

      <Group justify="space-between" mb="md">
        <Title order={2}>Categories</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditingItem(null);
            openFormModal();
          }}
          color="blue"
        >
          Add Category
        </Button>
      </Group>

      <Box style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <ViewTable data={data} columns={columns} defaultSortName="id" />
      </Box>

      <CategoryFormModal
        opened={formModalOpened}
        onClose={closeFormModal}
        editingItem={editingItem}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
