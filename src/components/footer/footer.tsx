import {
  Anchor,
  Container,
  Group,
  ActionIcon,
  Text,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";

const footerData = [
  {
    title: "Product",
    links: [
      { label: "Features", link: "#" },
      { label: "Pricing", link: "#" },
      { label: "Integrations", link: "#" },
      { label: "Updates", link: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", link: "#" },
      { label: "API Reference", link: "#" },
      { label: "Guides", link: "#" },
      { label: "Community", link: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", link: "#" },
      { label: "Careers", link: "#" },
      { label: "Blog", link: "#" },
      { label: "Contact", link: "#" },
    ],
  },
];

export default function Footer() {
  const groups = footerData.map((group) => {
    const links = group.links.map((link, index) => (
      <Anchor
        key={index}
        href={link.link}
        c="dimmed"
        lh={1}
        size="sm"
        underline="hover"
      >
        {link.label}
      </Anchor>
    ));

    return (
      <Stack key={group.title} gap="xs">
        <Text fw={600} size="sm">
          {group.title}
        </Text>
        {links}
      </Stack>
    );
  });

  return (
    <Container
      component="footer"
      fluid
      mt="xl"
      pl="md"
      pr="md"
      pt="lg"
      pb="sm"
      style={{
        height: "50dvh",
        borderTop: "1px solid var(--mantine-color-gray-3)",
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      <Stack
        justify="space-between"
        style={{
          height: "100%",
        }}
      >
        {/* Top Section: Brand Info + Links */}
        <Group justify="space-between" align="flex-start" mb="xl">
          <Stack gap="xs" max-w={300}>
            <Text fw={700} size="lg">
              CollectionApp
            </Text>
            <Text size="sm" c="dimmed">
              Organize, track, and share your entities and collections
              seamlessly.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xl">
            {groups}
          </SimpleGrid>
        </Group>

        {/* Bottom Section: Copyright + Social Icons */}
        <Group
          justify="space-between"
          pt="md"
          style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
        >
          <Text c="dimmed" size="sm">
            © {new Date().getFullYear()} CollectionApp. All rights reserved.
          </Text>

          <Group gap="xs" justify="flex-end" wrap="nowrap">
            <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
              <IconBrandTwitter size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
              <IconBrandGithub size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
              <IconBrandLinkedin size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Container>
  );
}
