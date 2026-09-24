import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container, Stack, Badge } from "@mantine/core";

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", // Fading begins when the top of the section hits the top of the viewport
          end: "center top", // Reaches 0 opacity when the middle of the section leaves the top
          scrub: true, // Syncs the opacity transition directly to scroll position
        },
      });
    }, containerRef);

    return () => ctx.revert(); // Clean up animation context on unmount
  }, []);

  return (
    <Container
      ref={containerRef}
      fluid
      className="homepage-story-section"
      style={{ overflow: "visible" }}
    >
      <Stack gap={"md"} pt={50}>
        <Badge
          size="lg"
          variant="dot"
          color="primaryOrange"
          style={{ width: "fit-content" }}
        >
          I. Story
        </Badge>
      </Stack>
    </Container>
  );
}
