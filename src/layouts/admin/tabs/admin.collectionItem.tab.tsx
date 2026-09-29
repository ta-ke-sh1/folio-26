import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Group,
  Title,
  Box,
  LoadingOverlay,
  Badge,
  Anchor,
  ActionIcon,
  Image,
} from "@mantine/core";
import { ShuffleButton as Button } from "../../../components/animations/shuffle.button";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import { type DataTableColumn } from "mantine-datatable";
import DatabaseService from "../../../services/database.service";
import ViewTable from "../../../components/table/view.table";
import {
  type ItemFormValues,
  ItemFormModal,
} from "../forms/admin.collectionItem.form";

export function ItemsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formModalOpened, { open: openFormModal, close: closeFormModal }] =
    useDisclosure(false);

  const db = DatabaseService.getInstance();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: result, error } = await db.getAll("collection_items");
    if (!error) setData(result || []);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    (async () => await fetchData())();
  }, [fetchData]);

  const handleSubmit = async (values: ItemFormValues) => {
    setLoading(true);
    try {
      // Upload file to Supabase Storage if user selected an image
      if (values.imageFile) {
        const fileName = `collection-${values.collection_id}-${values.name}.jpg`;
        const storageBucket = "collection_items"; // Ensure this storage bucket exists in Supabase

        const { error: uploadError } = await db
          .getDatabase()
          .storage.from(storageBucket)
          .upload(fileName, values.imageFile, {
            contentType: "image/jpeg",
            upsert: true, // Overwrite if item with same name exists
          });

        if (uploadError) {
          throw new Error(`Supabase Storage upload error: ${uploadError}`);
        }
      }

      // Prepare database payload
      const payload: Record<string, any> = {
        name: values.name,
        url: values.url,
        author: values.author,
        year: values.year,
        collection_id: Number(values.collection_id),
        category_id: Number(values.category_id),
        tags: values.tags,
      };

      let res;
      if (editingItem) {
        res = await db.updateById("collection_items", editingItem.id, payload);
      } else {
        res = await db.create("collection_items", {
          ...payload,
          created_at: new Date(),
        });
      }

      if (res.error) {
        throw new Error(`Error: ${res.error.message}`);
      }

      await fetchData();
      closeFormModal();
    } catch (err) {
      console.error("Error submitting item:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<any>[] = [
    { accessor: "id", title: "ID", sortable: true, width: 70 },
    {
      accessor: "image_url",
      title: "Image",
      width: 70,
      render: (r: any) =>
        r.image_url ? (
          <Image src={r.image_url} h={40} w={40} radius="xs" fit="cover" />
        ) : null,
    },
    { accessor: "name", title: "Name", sortable: true },
    {
      accessor: "tags",
      title: "Tags",
      render: (r: any) => (
        <Group gap={4}>
          {(r.tags || []).map((tag: string, idx: number) => (
            <Badge key={`${tag}-${idx}`} size="xs" variant="light" color="blue">
              {tag}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessor: "url",
      title: "URL",
      render: (r: any) => (
        <Anchor href={r.url} target="_blank" size="sm">
          Link
        </Anchor>
      ),
    },
    { accessor: "author", title: "Author", sortable: true },
    { accessor: "year", title: "Year", sortable: true },
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
        <Title order={2}>Collection Items</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditingItem(null);
            openFormModal();
          }}
          color="blue"
        >
          Add New Item
        </Button>
      </Group>
      <Box style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <ViewTable data={data} columns={columns} defaultSortName="id" />
      </Box>

      <ItemFormModal
        opened={formModalOpened}
        onClose={closeFormModal}
        editingItem={editingItem}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
