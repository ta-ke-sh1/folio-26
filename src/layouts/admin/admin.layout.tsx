import { AppShell, Burger, Group, NavLink, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CategoriesTab } from "./tabs/admin.categories.tab";
import { CollectionsTab } from "./tabs/admin.collection.tab";
import { ItemsTab } from "./tabs/admin.collectionItem.tab";
import { TagsTab } from "./tabs/admin.tags.tab";
import { BlogsTab } from "./tabs/admin.blog.tab";
import { type ActiveTab } from "./admin.types";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { BlogEditorPage } from "./forms/admin.blog.form";

const VALID_TABS: ActiveTab[] = ["items", "collections", "categories", "tags", "blogs"];

export default function AdminLayout() {

  if (import.meta.env.IS_LOCAL !== "true") {
    window.location.href = "/";
  }

  const [opened, { toggle }] = useDisclosure(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isBlogPath = location.pathname.startsWith("/admin/blogs");
  const isBlogEditor =
    location.pathname === "/admin/blogs/new" ||
    /^\/admin\/blogs\/\d+\/edit$/.test(location.pathname);
  const pathTab = location.pathname.split("/")[2] as ActiveTab | undefined;
  const queryTab = new URLSearchParams(location.search).get("tab");
  const activeTab: ActiveTab = isBlogPath
    ? "blogs"
    : VALID_TABS.includes(pathTab as ActiveTab)
      ? (pathTab as ActiveTab)
      : "items";

  useEffect(() => {
    if (location.pathname !== "/admin" || !queryTab) return;
    const normalizedTab = VALID_TABS.includes(queryTab as ActiveTab)
      ? (queryTab as ActiveTab)
      : "items";
    navigate(normalizedTab === "items" ? "/admin/items" : `/admin/${normalizedTab}`, {
      replace: true,
    });
  }, [location.pathname, navigate, queryTab]);

  const renderActiveTab = () => {
    if (isBlogEditor) return <BlogEditorPage />;
    if (isBlogPath) return <BlogsTab />;

    switch (activeTab) {
      case "items":
        return <ItemsTab />;
      case "collections":
        return <CollectionsTab />;
      case "categories":
        return <CategoriesTab />;
      case "tags":
        return <TagsTab />;
      case "blogs":
        return <BlogsTab />;
    }
  };

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
      <AdminHeader opened={opened} onToggleNavbar={toggle} />
      <AdminSidebar
        activeTab={activeTab}
        isBlogPath={isBlogPath}
        onSelectTab={(tab: ActiveTab) => navigate(tab === "items" ? "/admin/items" : `/admin/${tab}`)}
      />

      <AppShell.Main
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 60px)",
        }}
      >
        {renderActiveTab()}
      </AppShell.Main>
    </AppShell>
  );
}

function AdminHeader({ opened, onToggleNavbar }: any) {
  return (
    <AppShell.Header p="md">
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger
            opened={opened}
            onClick={onToggleNavbar}
            size="sm"
            aria-label="Toggle navigation"
          />
          <Title order={3}>Admin Dashboard</Title>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

const NAV_ITEMS: { label: string; value: ActiveTab }[] = [
  { label: "Collection Items", value: "items" },
  { label: "Collections", value: "collections" },
  { label: "Categories", value: "categories" },
  { label: "Tags", value: "tags" },
  { label: "Blog Entries", value: "blogs" },
];

function AdminSidebar({ activeTab, isBlogPath, onSelectTab }: any) {
  return (
    <AppShell.Navbar p="md">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.value}
          label={item.label}
          active={activeTab === item.value || (item.value === "blogs" && isBlogPath)}
          onClick={() => onSelectTab(item.value)}
        />
      ))}
    </AppShell.Navbar>
  );
}
