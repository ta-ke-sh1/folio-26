import {
  AppShell,
  Burger,
  NavLink,
  Group,
  Title,
  Text,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function AdminLayout() {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      {/* Top Header */}
      <AppShell.Header p="md">
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            aria-label="Toggle navigation"
          />
          <Title order={3}>Admin Dashboard</Title>
        </Group>
      </AppShell.Header>

      {/* Collapsible Left Sidebar */}
      <AppShell.Navbar p="md">
        <NavLink label="Dashboard" href="#dashboard" />
        <NavLink label="Collection Items" href="#items" active />
        <NavLink label="Categories" href="#categories" />
        <NavLink label="Settings" href="#settings" />
      </AppShell.Navbar>

      {/* Main Content Column */}
      <AppShell.Main>
        <Container fluid>
          <Title order={2} mb="sm">
            Collection Items
          </Title>
          <Text>Main content area goes here...</Text>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
