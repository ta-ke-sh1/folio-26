import { useState } from "react";
import { AppShell, Burger, Group, NavLink, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CategoriesTab } from "./tabs/admin.categories.tab";
import { CollectionsTab } from "./tabs/admin.collection.tab";
import { ItemsTab } from "./tabs/admin.collectionItem.tab";
import { TagsTab } from "./tabs/admin.tags.tab";
import type { ActiveTab } from "./admin.types";

export default function AdminLayout() {
  const [opened, { toggle }] = useDisclosure(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("items");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "items":
        return <ItemsTab />;
      case "collections":
        return <CollectionsTab />;
      case "categories":
        return <CategoriesTab />;
      case "tags":
        return <TagsTab />;
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
      <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

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
];

function AdminSidebar({ activeTab, onSelectTab }: any) {
  return (
    <AppShell.Navbar p="md">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.value}
          label={item.label}
          active={activeTab === item.value}
          onClick={() => onSelectTab(item.value)}
        />
      ))}
    </AppShell.Navbar>
  );
}
