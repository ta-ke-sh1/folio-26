import {
  Container,
  Group,
  Burger,
  Title,
  NavLink,
  Drawer,
  Button,
  Stack,
  Text,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ZIndexLevel } from "../../enums/styles.enum";
import { useLocation } from "react-router";
import { useAnimatedNavigate } from "../transition/transition";

export default function NavigationBar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const animatedNavigate = useAnimatedNavigate();
  const location = useLocation();

  if (location.pathname.includes("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "ABOUT", href: "/about" },
    { label: "COLLECTIONS", href: "/collections" },
    { label: "CONTACTS", href: "/contacts" },
  ];

  const handleNavigation = (href: string) => {
    close();
    animatedNavigate(href);
  };

  return (
    <Container
      fluid
      component="header"
      h={60}
      px="lg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100dvw",
        zIndex: ZIndexLevel.HIGH,
        backgroundColor: "rgba(5, 5, 5, 0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255, 119, 0, 0.2)",
      }}
    >
      <Group justify="space-between" h="100%">
        {/* Brand Logo / CRT Header Title */}
        <Group
          gap="xs"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigation("/")}
        >
          <Box
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#FF7700",
              boxShadow: "0 0 8px #FF7700",
            }}
          />
          <Title
            order={3}
            style={{
              userSelect: "none",
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "monospace",
              color: "#FF7700",
              letterSpacing: "-0.5px",
              textShadow: "0 0 8px rgba(255, 119, 0, 0.5)",
            }}
          >
            folio.26
          </Title>
          <Text
            size="xs"
            c="dimmed"
            visibleFrom="xs"
            style={{ fontFamily: "monospace", marginLeft: 4 }}
          >
            [SYS_26]
          </Text>
        </Group>

        {/* Right Group: Desktop Nav Links */}
        <Group gap="xs">
          <Group gap="xs" visibleFrom="sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Button
                  key={link.label}
                  onClick={() => handleNavigation(link.href)}
                  variant={isActive ? "light" : "subtle"}
                  color="orange"
                  size="xs"
                  style={{
                    fontFamily: "monospace",
                    letterSpacing: "1px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#FF7700" : "#C1C2C5",
                    backgroundColor: isActive
                      ? "rgba(255, 119, 0, 0.12)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255, 119, 0, 0.4)"
                      : "1px solid transparent",
                  }}
                >
                  {isActive ? `[ ${link.label} ]` : link.label}
                </Button>
              );
            })}
          </Group>

          {/* Mobile CRT Burger Icon */}
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            color="#FF7700"
            aria-label="Toggle navigation menu"
          />
        </Group>
      </Group>

      {/* Mobile Terminal Navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="xl"
        title={
          <Group gap="xs">
            <Text
              size="xs"
              c="primaryOrange"
              style={{ fontFamily: "monospace", fontWeight: 700 }}
            >
              {"> TERMINAL_MENU"}
            </Text>
          </Group>
        }
        hiddenFrom="sm"
        zIndex={1000}
        styles={{
          content: {
            backgroundColor: "#050505",
            color: "#FFF",
            borderLeft: "1px solid rgba(255, 119, 0, 0.3)",
          },
          header: {
            backgroundColor: "#050505",
            borderBottom: "1px solid rgba(255, 119, 0, 0.2)",
            paddingBottom: "16px",
          },
          close: {
            color: "#FF7700",
            "&:hover": {
              backgroundColor: "rgba(255, 119, 0, 0.15)",
            },
          },
        }}
      >
        <Stack gap="md" mt="md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <NavLink
                key={link.label}
                label={isActive ? `> ${link.label}` : link.label}
                onClick={() => handleNavigation(link.href)}
                style={{
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: isActive ? "#FF7700" : "#C1C2C5",
                  backgroundColor: isActive
                    ? "rgba(255, 119, 0, 0.1)"
                    : "transparent",
                  borderLeft: isActive
                    ? "3px solid #FF7700"
                    : "3px solid transparent",
                  borderRadius: "2px",
                  padding: "12px 16px",
                }}
              />
            );
          })}
        </Stack>

        <Box
          style={{
            position: "absolute",
            bottom: "32px",
            left: "24px",
            right: "24px",
            paddingTop: "16px",
            borderTop: "1px dashed rgba(255, 119, 0, 0.2)",
          }}
        >
          <Group justify="space-between">
            <Text size="xs" c="dimmed" style={{ fontFamily: "monospace" }}>
              CH_NO: 26
            </Text>
            <Text size="xs" c="dimmed" style={{ fontFamily: "monospace" }}>
              SIGNAL: ONLINE
            </Text>
          </Group>
        </Box>
      </Drawer>
    </Container>
  );
}
