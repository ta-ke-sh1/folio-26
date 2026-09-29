import { useCallback, useEffect, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { type DataTableColumn } from "mantine-datatable";
import { ShuffleButton as AnimatedButton } from "../../../components/animations/shuffle.button";
import { useAnimatedNavigate } from "../../../components/transition/transition";
import ViewTable from "../../../components/table/view.table";
import { DatabaseTables } from "../../../enums/database.enums";
import type { PostEntity } from "../../../models/entity/post.model";
import DatabaseService from "../../../services/database.service";

export function BlogsTab() {
  const [data, setData] = useState<PostEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useAnimatedNavigate();
  const db = DatabaseService.getInstance();

  const loadData = useCallback(async () => {
    const { data: result, error } = await db.getAll(DatabaseTables.Blogs);
    if (error) throw error;
    return (result || []) as PostEntity[];
  }, [db]);

  useEffect(() => {
    let active = true;
    loadData()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((fetchError: unknown) => {
        console.error("Error fetching blog entries:", fetchError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadData]);

  const columns: DataTableColumn<PostEntity>[] = [
    { accessor: "id", title: "ID", sortable: true, width: 70 },
    { accessor: "title", title: "Title", sortable: true },
    { accessor: "slug", title: "Slug", sortable: true },
    {
      accessor: "published",
      title: "Status",
      sortable: true,
      render: (record) => (
        <Badge color={record.published ? "green" : "gray"} variant="light">
          {record.published ? "PUBLISHED" : "DRAFT"}
        </Badge>
      ),
    },
    {
      accessor: "created_at",
      title: "Created At",
      sortable: true,
      render: (record) => record.created_at
        ? new Date(record.created_at).toLocaleDateString()
        : "—",
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
            aria-label={`Edit ${record.title}`}
            onClick={() => navigate(`/admin/blogs/${record.id}/edit`)}
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
        <Title order={2}>Blog Entries</Title>
        <AnimatedButton
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/admin/blogs/new")}
          color="blue"
        >
          Add Entry
        </AnimatedButton>
      </Group>
      <Box style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <ViewTable data={data} columns={columns} defaultSortName="created_at" />
      </Box>
    </Container>
  );
}
