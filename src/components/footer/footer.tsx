import {
  Anchor,
  Container,
  Group,
  ActionIcon,
  Text,
  Stack,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandFacebook,
  IconBrandInstagram,
} from "@tabler/icons-react";

const footerData = [
  {
    title: "Connect",
    links: [
      { label: "Facebook", link: "#" },
      { label: "Instagram", link: "#" },
      { label: "Github", link: "#" },
      { label: "trung.ha@folio.dev", link: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Collections", link: "#" },
      { label: "Playground", link: "#" },
    ],
  },
  {
    title: "Contacts",
    links: [
      { label: "About", link: "#" },
      { label: "Contact", link: "#" },
    ],
  },
];

export default function Footer() {
  const groups = footerData.map((group) => {
    const links = group.links.map((link, index) => (
      <Anchor
        key={index}
        c="white"
        href={link.link}
        lh={1}
        size="sm"
        underline="hover"
      >
        {link.label}
      </Anchor>
    ));

    return (
      <Stack key={group.title} gap="xs">
        <Text fw={600} size="md">
          {group.title}
        </Text>
        <Divider color="rgba(255,255,255,0.2)" mb="sm" />
        {links}
      </Stack>
    );
  });

  return (
    <Container
      component="footer"
      fluid
      pl="md"
      pr="md"
      pt="xl"
      pb="sm"
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "#020202",
        backgroundRepeat: "repeat, no-repeat, no-repeat, no-repeat, no-repeat",
        overflow: "hidden",
        opacity: 1,
      }}
    >
      <Stack
        justify="space-between"
        style={{ minHeight: "400px", position: "relative", zIndex: 12 }}
      >
        {/* Top Section: Brand Info + Links */}
        <Group justify="space-between" align="flex-start" mb="xl" mt="xl">
          <Stack gap="xs" style={{ maxWidth: 300 }}>
            <Text fw={700} size="lg">
              Trung. Ha
            </Text>
            <Text size="sm" c="dimmed">
              A developer's stash of visions, dreams, and escapes.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xl">
            {groups}
          </SimpleGrid>
        </Group>

        {/* Bottom Section: Copyright + Social Icons */}
        <Group justify="space-between" pt="md">
          <Text c="dimmed" size="sm">
            © {new Date().getFullYear()} folio. 26. All rights reserved.
          </Text>

          <Group gap="xs" justify="flex-end" wrap="nowrap">
            <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
              <IconBrandFacebook size={18} stroke={1.5} />
            </ActionIcon>

            <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
              <IconBrandInstagram size={18} stroke={1.5} />
            </ActionIcon>
            <Divider orientation="vertical" />
            <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
              <IconBrandGithub size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Container>
  );
}
