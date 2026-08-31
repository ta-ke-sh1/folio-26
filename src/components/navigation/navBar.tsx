import {
  Container,
  Group,
  Burger,
  Title,
  NavLink,
  Drawer,
  Button,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ZIndexLevel } from "../../enums/styles.enum";
import { useLocation, useNavigate } from "react-router";

export default function NavigationBar() {
  const [opened, { toggle, close }] = useDisclosure(false);

  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.includes("/admin")) {
    return;
  }

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Collections", href: "/collections" },
    { label: "Contacts", href: "/contacts" },
  ];

  return (
    <Container
      fluid
      component="header"
      h={60}
      px="md"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100dvw",
        zIndex: ZIndexLevel.HIGH,
      }}
    >
      <Group justify="space-between" h="100%">
        {/* Brand Logo / Title */}
        <Title
          onClick={() => {
            navigate("/");
          }}
          style={{
            userSelect: "none",
            cursor: "pointer",
            fontSize: 20,
            letterSpacing: -1,
          }}
          order={3}
        >
          folio. 26
        </Title>

        {/* Desktop Navigation Links */}
        <Group gap="xs" visibleFrom="sm">
          {navLinks.map((link) => (
            <Button
              key={link.label}
              component="a"
              onClick={() => {
                navigate(link.href);
              }}
              variant="subtle"
              color="gray"
            >
              {link.label}
            </Button>
          ))}
        </Group>

        {/* Mobile Burger Icon */}
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
          aria-label="Toggle navigation menu"
        />
      </Group>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000}
      >
        <Stack gap="sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              label={link.label}
              href={link.href}
              onClick={close}
            />
          ))}
        </Stack>
      </Drawer>
    </Container>
  );
}
