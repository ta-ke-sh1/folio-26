import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Group,
  Title,
  Button,
  Box,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import { type DataTableColumn } from "mantine-datatable";
import DatabaseService from "../../../services/database.service";
import ViewTable from "../../../components/table/view.table";
import {
  type CollectionFormValues,
  CollectionFormModal,
} from "../forms/admin.collection.form";

export function CollectionsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formModalOpened, { open: openFormModal, close: closeFormModal }] =
    useDisclosure(false);

  const db = DatabaseService.getInstance();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: result } = await db.getAll("collections");
    setData(result || []);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    (async () => await fetchData())();
  }, [fetchData]);

  const handleSubmit = async (values: CollectionFormValues) => {
    setLoading(true);
    if (editingItem) {
      await db.updateById("collections", editingItem.id, values);
    } else {
      await db.create("collections", values);
    }
    await fetchData();
    closeFormModal();
    setLoading(false);
  };

  const columns: DataTableColumn<any>[] = [
    { accessor: "id", title: "ID", sortable: true, width: 80 },
    { accessor: "name", title: "Collection Name", sortable: true },
    { accessor: "date", title: "Date", sortable: true },
    { accessor: "created_at", title: "Created At", sortable: true },
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
        <Title order={2}>Collections</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditingItem(null);
            openFormModal();
          }}
          color="blue"
        >
          Add Collection
        </Button>
      </Group>
      <Box style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <ViewTable data={data} columns={columns} defaultSortName="id" />
      </Box>

      <CollectionFormModal
        opened={formModalOpened}
        onClose={closeFormModal}
        editingItem={editingItem}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
