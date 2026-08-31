import { useState, useEffect, useCallback } from "react";
import {
  AppShell,
  Burger,
  NavLink,
  Group,
  Title,
  Container,
  Badge,
  Anchor,
  Box,
  Button,
  Modal,
  TextInput,
  Stack,
  ActionIcon,
  MultiSelect,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { type DataTableColumn } from "mantine-datatable";
import DatabaseService from "../../services/database.service"; // Adjust path to match your file structure
import ViewTable from "../../components/table/view.table";

type ActiveTab = "items" | "collections" | "categories" | "tags";

// Table Mapping Helper
const TABLE_MAP: Record<ActiveTab, string> = {
  items: "collection_items",
  collections: "collections",
  categories: "categories",
  tags: "tags",
};

export default function AdminLayout() {
  const [opened, { toggle }] = useDisclosure(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("items");

  // Form & Delete Modal States
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Data & Loading States
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Database Service Instance Singleton
  const db = DatabaseService.getInstance();

  // Fetch Data Function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const tableName = TABLE_MAP[activeTab];
      const { data, error } = await db.getAll(tableName);
      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        setTableData([]);
      } else {
        setTableData(data || []);
      }
    } catch (err) {
      console.error("Failed to execute query", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, db]);

  // Trigger Data Fetching on Tab Switch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Form Initial State setup
  const form = useForm({
    initialValues: {
      name: "",
      url: "",
      author: "",
      year: "2026",
      tags: [] as string[],
      collection_id: 1,
      category_id: 1,
      date: "",
    },
  });

  // Open modal for Creating
  const handleCreate = () => {
    setEditingItem(null);
    const today = new Date().toISOString().split("T")[0];
    form.setValues({
      name: "",
      url: "",
      author: "",
      year: "2026",
      tags: [],
      collection_id: 1,
      category_id: 1,
      date: today,
    });
    openFormModal();
  };

  // Open modal for Editing
  const handleEdit = (record: any) => {
    setEditingItem(record);
    const today = new Date().toISOString().split("T")[0];
    form.setValues({
      name: record.name || "",
      url: record.url || "",
      author: record.author || "",
      year: record.year || "2026",
      tags: record.tags || [],
      collection_id: record.collection_id || 1,
      category_id: record.category_id || 1,
      date: record.date || today,
    });
    openFormModal();
  };

  // Prompt Confirmation for Delete
  const promptDelete = (id: number) => {
    setDeletingId(id);
    openDeleteModal();
  };

  // Execute Delete Operation
  const confirmDelete = async () => {
    if (deletingId === null) return;
    setLoading(true);
    try {
      const tableName = TABLE_MAP[activeTab];
      const { error } = await db.deleteById(tableName, deletingId);
      if (error) {
        console.error("Delete failed:", error);
      } else {
        await fetchData();
      }
    } catch (err) {
      console.error("Execution error on delete:", err);
    } finally {
      setDeletingId(null);
      closeDeleteModal();
      setLoading(false);
    }
  };

  // Create or Update Submission
  const handleFormSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const tableName = TABLE_MAP[activeTab];

    try {
      if (editingItem) {
        // UPDATE OPERATION
        let payload: any = {};
        if (activeTab === "items") payload = { ...values };
        else if (activeTab === "collections")
          payload = { name: values.name, date: values.date };
        else payload = { name: values.name };

        const { error } = await db.updateById(
          tableName,
          editingItem.id,
          payload,
        );
        if (error) console.error("Update failed:", error);
      } else {
        // CREATE OPERATION
        let payload: any = {};
        if (activeTab === "items") payload = { ...values };
        else if (activeTab === "collections")
          payload = { name: values.name, date: values.date };
        else payload = { name: values.name };

        const { error } = await db.create(tableName, payload);
        if (error) console.error("Create failed:", error);
      }

      await fetchData();
    } catch (err) {
      console.error("Form execution error:", err);
    } finally {
      closeFormModal();
      setLoading(false);
    }
  };

  // Shared Actions Column Definition
  const actionColumn: DataTableColumn<any> = {
    accessor: "actions",
    title: "Actions",
    textAlign: "right",
    render: (record) => (
      <Group gap="xs" justify="flex-end">
        <ActionIcon
          size="sm"
          variant="subtle"
          color="blue"
          onClick={() => handleEdit(record)}
        >
          <IconEdit size={16} />
        </ActionIcon>
        <ActionIcon
          size="sm"
          variant="subtle"
          color="red"
          onClick={() => promptDelete(record.id)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    ),
  };

  // Column Maps for tables
  const collectionItemColumns: any[] = [
    { accessor: "id", title: "ID", sortable: true, width: 70 },
    { accessor: "name", title: "Name", sortable: true },
    {
      accessor: "tags",
      title: "Tags",
      render: (record: any, record_index: number) => (
        <Group gap={4}>
          {(record.tags || []).map((tag: any, tag_index: number) => (
            <Badge
              key={`${tag}-${record_index}-${tag_index}`}
              size="xs"
              variant="light"
              color="blue"
            >
              {tag}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessor: "url",
      title: "URL",
      render: (record: any) => (
        <Anchor href={record.url} target="_blank" size="sm">
          Link
        </Anchor>
      ),
    },
    { accessor: "author", title: "Author", sortable: true },
    { accessor: "year", title: "Year", sortable: true },
    { accessor: "created_at", title: "Created At", sortable: true },
    actionColumn,
  ];

  const collectionColumns: any[] = [
    { accessor: "id", title: "ID", sortable: true, width: 80 },
    { accessor: "name", title: "Collection Name", sortable: true },
    { accessor: "date", title: "Date", sortable: true },
    { accessor: "created_at", title: "Created At", sortable: true },
    actionColumn,
  ];

  const categoryColumns: any[] = [
    { accessor: "id", title: "ID", sortable: true, width: 80 },
    { accessor: "name", title: "Category Name", sortable: true },
    {
      accessor: "created_at",
      title: "Created At",
      sortable: true,
      render: (r: any) => String(r.created_at),
    },
    actionColumn,
  ];

  const tagColumns: any[] = [
    { accessor: "id", title: "ID", sortable: true, width: 80 },
    {
      accessor: "name",
      title: "Tag Name",
      sortable: true,
      render: (r: any) => (
        <Badge color="teal" variant="outline">
          {r.name}
        </Badge>
      ),
    },
    {
      accessor: "created_at",
      title: "Created At",
      sortable: true,
      render: (r: any) => String(r.created_at),
    },
    actionColumn,
  ];

  const getTableProps = () => {
    switch (activeTab) {
      case "items":
        return {
          title: "Collection Items",
          columns: collectionItemColumns as DataTableColumn<any>[],
        };
      case "collections":
        return {
          title: "Collections",
          columns: collectionColumns as DataTableColumn<any>[],
        };
      case "categories":
        return {
          title: "Categories",
          columns: categoryColumns as DataTableColumn<any>[],
        };
      case "tags":
        return { title: "Tags", columns: tagColumns as DataTableColumn<any>[] };
    }
  };

  const currentTable = getTableProps();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Top Header */}
      <AppShell.Header p="md">
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              aria-label="Toggle navigation"
            />
            <Title order={3}>Admin Dashboard</Title>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Navigation Sidebar */}
      <AppShell.Navbar p="md">
        <NavLink
          label="Collection Items"
          active={activeTab === "items"}
          onClick={() => setActiveTab("items")}
        />
        <NavLink
          label="Collections"
          active={activeTab === "collections"}
          onClick={() => setActiveTab("collections")}
        />
        <NavLink
          label="Categories"
          active={activeTab === "categories"}
          onClick={() => setActiveTab("categories")}
        />
        <NavLink
          label="Tags"
          active={activeTab === "tags"}
          onClick={() => setActiveTab("tags")}
        />
      </AppShell.Navbar>

      {/* Main Container filling remaining view height */}
      <AppShell.Main
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 60px)",
        }}
      >
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
            <Title order={2}>{currentTable.title}</Title>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCreate}
              color="blue"
            >
              Add New
            </Button>
          </Group>

          <Box style={{ flex: 1, height: "100%", overflow: "hidden" }}>
            <ViewTable
              data={tableData}
              columns={currentTable.columns}
              defaultSortName="id"
            />
          </Box>
        </Container>
      </AppShell.Main>

      {/* Create / Edit Form Modal */}
      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        title={`${editingItem ? "Edit" : "Add New"} ${currentTable.title.slice(0, -1)}`}
        centered
      >
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Stack gap="sm">
            <TextInput
              required
              label="Name"
              placeholder="Enter name..."
              {...form.getInputProps("name")}
            />

            {activeTab === "items" && (
              <>
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
                <MultiSelect
                  label="Tags"
                  placeholder="Select tags"
                  data={tableData.flatMap((i) => i.tags || [])}
                  searchable
                  {...form.getInputProps("tags")}
                />
              </>
            )}

            {activeTab === "collections" && (
              <TextInput
                label="Date"
                placeholder="YYYY-MM-DD"
                {...form.getInputProps("date")}
              />
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeFormModal}>
                Cancel
              </Button>
              <Button type="submit" color="blue">
                {editingItem ? "Save Changes" : "Create"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        centered
        size="sm"
      >
        <Text size="sm">
          Are you sure you want to delete this record? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </AppShell>
  );
}
