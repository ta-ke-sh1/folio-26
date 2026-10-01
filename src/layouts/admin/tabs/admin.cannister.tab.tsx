import { useCallback, useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Tooltip,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { openConfirmModal } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { type DataTableColumn } from "mantine-datatable";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";
import ViewTable from "../../../components/table/view.table";
import type CannisterEntity from "../../../models/entity/cannister.model";
import CannisterService from "../../../services/cannister.service";
import DatabaseService from "../../../services/database.service";
import { CannisterCreateModal, type CannisterFormValues } from "../forms/admin.cannister.form";

interface CategoryRecord {
  id: number;
  name: string;
}

export function CannistersTab() {
  const [data, setData] = useState<CannisterEntity[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const navigate = useNavigate();
  const db = DatabaseService.getInstance();
  const service = CannisterService.getInstance();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recordsResponse, categoriesResponse] = await Promise.all([
        service.fetchCannisters(),
        db.getAll("categories"),
      ]);
      setData((recordsResponse ?? []) as CannisterEntity[]);
      if (categoriesResponse.data) {
        setCategories(
          (categoriesResponse.data as CategoryRecord[]).map((category) => ({
            value: String(category.id),
            label: category.name,
          })),
        );
      }
    } catch (error) {
      notifications.show({
        title: "Could not load cannisters",
        message: error instanceof Error ? error.message : "Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [db, service]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [recordsResponse, categoriesResponse] = await Promise.all([
          service.fetchCannisters(),
          db.getAll("categories"),
        ]);
        if (!isMounted) return;
        setData((recordsResponse ?? []) as CannisterEntity[]);
        if (categoriesResponse.data) {
          setCategories(
            (categoriesResponse.data as CategoryRecord[]).map((category) => ({
              value: String(category.id),
              label: category.name,
            })),
          );
        }
      } catch (error) {
        if (isMounted) {
          notifications.show({
            title: "Could not load cannisters",
            message: error instanceof Error ? error.message : "Please try again.",
            color: "red",
          });
        }
      }
    }

    void loadInitialData();
    return () => {
      isMounted = false;
    };
  }, [db, service]);

  const createCannister = async (values: CannisterFormValues, files: File[]): Promise<boolean> => {
    const name = values.name.trim();
    if (name.includes("/")) {
      notifications.show({ title: "Invalid name", message: "Cannister names cannot contain '/'.", color: "red" });
      return false;
    }

    setLoading(true);
    let cannisterCreated = false;
    try {
      const { data: record, error } = await service.createCannister({
        name,
        tags: values.tags,
        category_id: Number(values.category_id),
      });
      if (error) throw new Error(error.message);
      if (!record) throw new Error("The cannister was created without a returned record.");
      cannisterCreated = true;

      if (files.length > 0) await service.uploadImages(name, files, 1);
      notifications.show({
        title: "Cannister created",
        message: `${name} was added with ${files.length} image(s).`,
        color: "green",
      });
      closeCreate();
      await fetchData();
      return true;
    } catch (error) {
      notifications.show({
        title: cannisterCreated ? "Cannister created; image upload incomplete" : "Cannister creation failed",
        message: cannisterCreated
          ? `${error instanceof Error ? error.message : "Some images could not be uploaded."} You can add the remaining images from Edit.`
          : error instanceof Error ? error.message : "Please try again.",
        color: cannisterCreated ? "yellow" : "red",
      });
      if (cannisterCreated) closeCreate();
      await fetchData();
      return cannisterCreated;
    } finally {
      setLoading(false);
    }
  };

  const deleteCannister = async (cannister: CannisterEntity) => {
    setLoading(true);
    try {
      const deletedFileCount = await service.deleteCannister(
        cannister.id,
        cannister.name,
      );
      notifications.show({
        title: "Cannister deleted",
        message: `${cannister.name} and ${deletedFileCount} storage file(s) were deleted.`,
        color: "green",
      });
      await fetchData();
    } catch (error) {
      notifications.show({
        title: "Cannister deletion failed",
        message: error instanceof Error ? error.message : "Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<CannisterEntity>[] = [
    { accessor: "id", title: "ID", sortable: true, width: 80 },
    { accessor: "name", title: "Cannister", sortable: true },
    {
      accessor: "category_id",
      title: "Category",
      render: (record) => categories.find((category) => category.value === String(record.category_id))?.label ?? record.category_id,
    },
    {
      accessor: "tags",
      title: "Tags",
      render: (record) => record.tags?.length ? record.tags.join(", ") : <Text c="dimmed">—</Text>,
    },
    { accessor: "created_at", title: "Created At", sortable: true },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (record) => (
        <Group justify="flex-end">
          <Tooltip label="View cannister and manage images">
            <ActionIcon
              variant="subtle"
              color="blue"
              aria-label={`Manage ${record.name}`}
              onClick={() => navigate(`/admin/cannisters/${record.id}/edit`)}
            >
              <IconEdit size={17} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete cannister and its storage folder">
            <ActionIcon
              variant="subtle"
              color="red"
              aria-label={`Delete ${record.name} and its images`}
              onClick={() => openConfirmModal({
                title: `Delete ${record.name}?`,
                children: (
                  <Text size="sm">
                    This permanently deletes the cannister record and every file in
                    its <strong>{record.name}</strong> storage folder.
                  </Text>
                ),
                labels: { confirm: "Delete cannister", cancel: "Cancel" },
                confirmProps: { color: "red" },
                onConfirm: () => void deleteCannister(record),
              })}
            >
              <IconTrash size={17} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <Container
      fluid
      style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", position: "relative" }}
    >
      <LoadingOverlay visible={loading} overlayProps={{ blur: 1 }} />
      <Group justify="space-between" mb="md">
        <Title order={2}>Cannisters</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate} color="blue">
          Add Cannister
        </Button>
      </Group>
      <Box style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <ViewTable data={data} columns={columns} defaultSortName="id" />
      </Box>
      <CannisterCreateModal
        opened={createOpened}
        onClose={closeCreate}
        categories={categories}
        onSubmit={createCannister}
      />
    </Container>
  );
}
