import { Box, Container, Group, Stack, Text } from "@mantine/core";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { ShuffleButton } from "../animations/shuffle.button";
import { useAnimatedNavigate } from "../transition/transition";
import "./footer.scss";

type SitemapGroup = {
  title: string;
  links: { label: string; path: string }[];
};

const sitemapGroups: SitemapGroup[] = [
  { title: "ROOT", links: [{ label: "HOME", path: "/" }] },
  {
    title: "EXPLORE",
    links: [
      { label: "ABOUT", path: "/about" },
      { label: "COLLECTIONS", path: "/collections" },
      { label: "GALLERY", path: "/gallery" },
      { label: "PLAYGROUND", path: "/playground" },
    ],
  },
  { title: "SYSTEM", links: [{ label: "LOGIN", path: "/login" }] },
];

export default function Footer() {
  const location = useLocation();
  const animatedNavigate = useAnimatedNavigate();
  const eyeRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eye = eyeRef.current;
    const iris = irisRef.current;
    if (!eye || !iris) return;

    const moveIrisX = gsap.quickTo(iris, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const moveIrisY = gsap.quickTo(iris, "y", {
      duration: 0.35,
      ease: "power3.out",
    });
    gsap.set(iris, { xPercent: -50, yPercent: -50 });
    const trackGlobalCursor = (event: MouseEvent) => {
      const horizontal = event.clientX / window.innerWidth - 0.5;
      const vertical = event.clientY / window.innerHeight - 0.5;
      const maxX = Math.max(0, (eye.clientWidth - iris.clientWidth) / 2 - 2);
      const maxY = Math.max(0, (eye.clientHeight - iris.clientHeight) / 2 - 2);
      moveIrisX(horizontal * maxX * 2);
      moveIrisY(vertical * maxY * 2);
    };
    window.addEventListener("mousemove", trackGlobalCursor);
    const blink = gsap.timeline({ repeat: -1, repeatDelay: 4.5 });
    blink
      .to(eye, { scaleY: 0.08, duration: 0.08, ease: "power2.inOut" })
      .to(eye, { scaleY: 1, duration: 0.12, ease: "power2.inOut" });
    return () => {
      window.removeEventListener("mousemove", trackGlobalCursor);
      blink.kill();
    };
  }, []);

  const navigate = (path: string) => {
    if (path !== location.pathname) animatedNavigate(path);
  };

  return (
    <Container component="footer" fluid className="footer-console">
      <Stack
        className="footer-console__layout"
        style={{
          height: "calc(100dvh)",
          width: "100%",
        }}
      >
        <Group
          className="footer-console__topline"
          justify="space-between"
          align="flex-start"
        >
          <Stack
            gap={2}
            style={{
              transform: "translateY(50px)",
            }}
          >
            <Text className="footer-console__brand">FOLIO // TRUNG HA</Text>
            <Text className="footer-console__descriptor">
              DIGITAL ARCHIVE / CREATIVE SYSTEMS
            </Text>
          </Stack>
          <Text
            style={{
              transform: "translateY(50px)",
            }}
            className="footer-console__status"
          >
            SYS 26.09 // ONLINE
          </Text>
        </Group>

        <Box
          className="footer-console__watcher"
          aria-label="Interactive cursor tracker"
        >
          <Box className="footer-console__eye" ref={eyeRef} aria-hidden="true">
            <Box className="footer-console__iris" ref={irisRef}>
              <Box className="footer-console__pupil" />
            </Box>
          </Box>
        </Box>

        <Group
          className="footer-console__sitemap-grid"
          style={{ width: "100%", transform: "translateY(0px)" }}
          justify="space-between"
        >
          {sitemapGroups.map((group) => (
            <Stack key={group.title} className="footer-console__group">
              <Text className="footer-console__group-title">
                [{group.title}]
              </Text>
              <Group>
                {group.links.map((link) => (
                  <ShuffleButton
                    key={link.path}
                    variant="outline"
                    color="orange"
                    className={`footer-console__link${location.pathname === link.path ? " is-active" : ""}`}
                    aria-label={`Navigate to ${link.label.toLowerCase()}`}
                    onClick={() => navigate(link.path)}
                  >
                    {`> ${link.label}`}
                  </ShuffleButton>
                ))}
              </Group>
            </Stack>
          ))}
        </Group>
      </Stack>
    </Container>
  );
}
