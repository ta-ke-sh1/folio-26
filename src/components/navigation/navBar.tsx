import { useState, useEffect } from "react";
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

  // Telemetry state: Mouse coordinates & dynamic local time
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    // 1. Mouse move tracker
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // 2. Real-time clock updater
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false }));
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
    <>
      {/* Top Header Navigation */}
      <Container
        fluid
        component="header"
        h={40}
        px="sm"
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
                fontSize: 16,
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

      {/* Bottom Telemetry Bar */}
      <Container
        fluid
        component="footer"
        h={40}
        px="lg"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100dvw",
          zIndex: ZIndexLevel.HIGHEST,
          backgroundColor: "rgba(5, 5, 5, 0.85)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255, 119, 0, 0.2)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Group
          justify="space-between"
          w="100%"
          style={{ fontFamily: "monospace" }}
        >
          {/* Server Location & Signal */}
          <Group gap="xs">
            <Box
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#40C057",
                boxShadow: "0 0 6px #40C057",
              }}
            />
            <Text size="xs" c="dimmed" style={{ letterSpacing: "0.5px" }}>
              LOC:{" "}
              <Text component="span" c="gray.3" inherit>
                HAN // VN
              </Text>
            </Text>
          </Group>

          {/* Mouse Coordinates Tracker */}
          <Group gap="xs" visibleFrom="xs">
            <Text size="xs" c="dimmed" style={{ letterSpacing: "0.5px" }}>
              CURSOR:{" "}
              <Text component="span" c="orange.4" inherit>
                X:{String(mousePos.x).padStart(4, "0")} Y:
                {String(mousePos.y).padStart(4, "0")}
              </Text>
            </Text>
          </Group>

          {/* Real-time Digital Clock */}
          <Group gap="xs">
            <Text size="xs" c="dimmed" style={{ letterSpacing: "0.5px" }}>
              SYS_TIME:{" "}
              <Text component="span" c="orange.4" fw={700} inherit>
                {timeStr || "00:00:00"}
              </Text>
            </Text>
          </Group>
        </Group>
      </Container>
    </>
  );
}
