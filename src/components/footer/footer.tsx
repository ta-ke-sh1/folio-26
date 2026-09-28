import { Box, Container, Stack } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";
import { ShuffleButton } from "../animations/shuffle.button";
import { useAnimatedNavigate } from "../transition/transition";
import "./footer.scss";

type LocatorPoint = {
  x: number;
  y: number;
  code: string;
};

type LocatorRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const LOCATOR_OFFSETS = [
  [-32, -24], [-14, -34], [8, -28], [29, -35],
  [-39, -8], [-20, -13], [2, -11], [23, -8],
  [-34, 12], [-13, 7], [11, 10], [34, 14],
  [-25, 31], [-4, 27], [19, 32], [38, 30],
] as const;
const LOCATOR_REGIONS = [
  { x: -28, y: -22, width: 31, height: 23 },
  { x: 4, y: -31, width: 30, height: 19 },
  { x: -38, y: 2, width: 28, height: 21 },
  { x: -7, y: -2, width: 36, height: 24 },
  { x: 19, y: 12, width: 27, height: 21 },
];
const INITIAL_POINTER_POINT = { x: 50, y: 50 };

function createLocatorPoints(pointer: { x: number; y: number }): LocatorPoint[] {
  return LOCATOR_OFFSETS.map(([offsetX, offsetY], index) => {
    const x = Math.round(Math.max(5, Math.min(95, pointer.x + offsetX)));
    const y = Math.round(Math.max(7, Math.min(93, pointer.y + offsetY)));
    return {
      x,
      y,
      code: `X${String(x * 11 + index).padStart(3, "0")}Y${String(y * 9 + index * 3).padStart(3, "0")}`,
    };
  });
}

function createLocatorRegions(pointer: { x: number; y: number }): LocatorRegion[] {
  return LOCATOR_REGIONS.map(({ x, y, width, height }) => ({
    x: Math.max(1, Math.min(99 - width, pointer.x + x)),
    y: Math.max(1, Math.min(99 - height, pointer.y + y)),
    width,
    height,
  }));
}

const INITIAL_LOCATOR_POINTS = createLocatorPoints(INITIAL_POINTER_POINT);
const INITIAL_LOCATOR_REGIONS = createLocatorRegions(INITIAL_POINTER_POINT);

const sitemapLinks = [
  { label: "HOME", path: "/" },
  { label: "ABOUT", path: "/about" },
  { label: "COLLECTIONS", path: "/collections" },
  { label: "GALLERY", path: "/gallery" },
  { label: "PLAYGROUND", path: "/playground" },
  { label: "LOGIN", path: "/login" },
];

type FooterProps = {
  compact?: boolean;
};

export default function Footer({ compact = false }: FooterProps) {
  const location = useLocation();
  const animatedNavigate = useAnimatedNavigate();
  const watcherRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLSpanElement>(null);
  const regionRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const locationRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerLineRefs = useRef<Array<SVGPathElement | null>>([]);
  const networkLineRefs = useRef<Array<SVGPathElement | null>>([]);

  useEffect(() => {
    const watcher = watcherRef.current;
    const eye = eyeRef.current;
    const iris = irisRef.current;
    const blob = blobRef.current;
    const crosshair = crosshairRef.current;
    if (!watcher || !eye || !iris || !blob || !crosshair) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { ...INITIAL_POINTER_POINT };
    const irisPosition = { x: 0, y: 0 };
    let watcherBounds = watcher.getBoundingClientRect();

    const updatePointerVisuals = () => {
      const x = pointer.x;
      const y = pointer.y;
      const moveX = ((x - 50) / 100) * watcherBounds.width;
      const moveY = ((y - 50) / 100) * watcherBounds.height;
      blob.style.translate = `${moveX}px ${moveY}px`;
      crosshair.style.translate = `${moveX}px ${moveY}px`;

      const locatorPoints = createLocatorPoints(pointer);
      const locatorRegions = createLocatorRegions(pointer);
      locatorRegions.forEach((region, index) => {
        const element = regionRefs.current[index];
        const initial = INITIAL_LOCATOR_REGIONS[index];
        if (!element || !initial) return;
        const dx = ((region.x - initial.x) / 100) * watcherBounds.width;
        const dy = ((region.y - initial.y) / 100) * watcherBounds.height;
        element.style.translate = `${dx}px ${dy}px`;
      });

      locatorPoints.forEach((point, index) => {
        const element = locationRefs.current[index];
        const initial = INITIAL_LOCATOR_POINTS[index];
        if (!element || !initial) return;
        const dx = ((point.x - initial.x) / 100) * watcherBounds.width;
        const dy = ((point.y - initial.y) / 100) * watcherBounds.height;
        element.style.translate = `${dx}px ${dy}px`;
        element.textContent = point.code;

        const bend = index % 2 === 0 ? 8 : -8;
        pointerLineRefs.current[index]?.setAttribute(
          "d",
          `M ${x} ${y} Q ${(x + point.x) / 2 + bend} ${(y + point.y) / 2 - bend} ${point.x} ${point.y}`,
        );
      });

      locatorPoints.slice(0, -1).forEach((point, index) => {
        const nextPoint = locatorPoints[index + 1];
        if (index % 3 === 1 || !nextPoint) return;
        networkLineRefs.current[index]?.setAttribute(
          "d",
          `M ${point.x} ${point.y} L ${nextPoint.x} ${nextPoint.y}`,
        );
      });
    };
    let pointerTween: gsap.core.Tween | undefined;
    let irisTween: gsap.core.Tween | undefined;
    const updateBounds = () => {
      watcherBounds = watcher.getBoundingClientRect();
    };

    const trackEyePointer = (event: PointerEvent) => {
      const eyeBounds = eye.getBoundingClientRect();
      const maxX = Math.max(0, (eye.clientWidth - iris.clientWidth) / 2 - 2);
      const maxY = Math.max(0, (eye.clientHeight - iris.clientHeight) / 2 - 2);
      const irisX = Math.max(
        -maxX,
        Math.min(maxX, event.clientX - eyeBounds.left - eyeBounds.width / 2),
      );
      const irisY = Math.max(
        -maxY,
        Math.min(maxY, event.clientY - eyeBounds.top - eyeBounds.height / 2),
      );
      irisTween?.kill();
      irisTween = gsap.to(irisPosition, {
        x: irisX,
        y: irisY,
        duration: reduceMotion ? 0 : 0.18,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => {
          iris.style.translate = `${irisPosition.x}px ${irisPosition.y}px`;
        },
      });
    };

    const trackPointer = (event: PointerEvent) => {
      const localX = event.clientX - watcherBounds.left;
      const localY = event.clientY - watcherBounds.top;
      const x = Math.max(0, Math.min(100, (localX / watcherBounds.width) * 100));
      const y = Math.max(0, Math.min(100, (localY / watcherBounds.height) * 100));
      pointerTween?.kill();
      pointerTween = gsap.to(pointer, {
        x,
        y,
        duration: reduceMotion ? 0 : 0.48,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: updatePointerVisuals,
      });
    };

    window.addEventListener("pointermove", trackEyePointer, { passive: true });
    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("resize", updateBounds);
    return () => {
      window.removeEventListener("pointermove", trackEyePointer);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("resize", updateBounds);
      pointerTween?.kill();
      irisTween?.kill();
      gsap.killTweensOf([pointer, irisPosition]);
    };
  }, []);

  const navigate = (path: string) => {
    if (path !== location.pathname) animatedNavigate(path);
  };
  const sideLinkColumns = [sitemapLinks.slice(0, 3), sitemapLinks.slice(3)];

  return (
    <Container
      component="footer"
      fluid
      className={`footer-console${compact ? " footer-console--modal" : ""}`}
    >
      <Stack
        className="footer-console__layout"
        style={{
          height: compact ? "100%" : "100dvh",
          width: "100%",
        }}
      >
        <Box
          className="footer-console__watcher"
          ref={watcherRef}
          aria-label="Interactive location tracker"
          p="0"
        >
          <Box
            className="footer-console__blob"
            ref={blobRef}
            aria-hidden="true"
          />
          {INITIAL_LOCATOR_REGIONS.map((region, index) => (
            <span
              key={`region-${index}`}
              ref={(element) => {
                regionRefs.current[index] = element;
              }}
              className="footer-console__locator-region"
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.width}%`, 
                height: `${region.height}%`,
              }}
              aria-hidden="true"
            />
          ))}
          <svg
            className="footer-console__locator-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {INITIAL_LOCATOR_POINTS.map((point, index) => {
              const bend = index % 2 === 0 ? 8 : -8;
              return (
                <path
                  key={`pointer-${index}`}
                  ref={(element) => {
                    pointerLineRefs.current[index] = element;
                  }}
                  d={`M ${INITIAL_POINTER_POINT.x} ${INITIAL_POINTER_POINT.y} Q ${(INITIAL_POINTER_POINT.x + point.x) / 2 + bend} ${(INITIAL_POINTER_POINT.y + point.y) / 2 - bend} ${point.x} ${point.y}`}
                  className="footer-console__locator-line"
                />
              );
            })}
            {INITIAL_LOCATOR_POINTS.slice(0, -1).map((point, index) => {
              const nextPoint = INITIAL_LOCATOR_POINTS[index + 1];
              if (index % 3 === 1) return null;
              if (!nextPoint) return null;
              return (
                <path
                  key={`network-${index}`}
                  ref={(element) => {
                    networkLineRefs.current[index] = element;
                  }}
                  d={`M ${point.x} ${point.y} L ${nextPoint.x} ${nextPoint.y}`}
                  className="footer-console__locator-line footer-console__locator-line--faint"
                />
              );
            })}
          </svg>
          <span
            className="footer-console__locator-crosshair"
            ref={crosshairRef}
            style={{ left: `${INITIAL_POINTER_POINT.x}%`, top: `${INITIAL_POINTER_POINT.y}%` }}
            aria-hidden="true"
          />
          <Box className="footer-console__eye" ref={eyeRef} aria-hidden="true">
            <Box className="footer-console__iris" ref={irisRef}>
              <Box className="footer-console__pupil" />
            </Box>
          </Box>
          {INITIAL_LOCATOR_POINTS.map((point, index) => (
            <span
              key={`location-${index}`}
              ref={(element) => {
                locationRefs.current[index] = element;
              }}
              className={`footer-console__location${index % 4 === 0 ? " is-large" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              {point.code}
            </span>
          ))}
          <Box
            className="footer-console__side-sitemap"
            aria-label="Footer navigation"
          >
            {sideLinkColumns.map((links, columnIndex) => (
              <Stack
                key={columnIndex}
                className={`footer-console__side-link-column${columnIndex === 1 ? " is-right" : ""}`}
                justify="space-between"
              >
                {links.map((link) => (
                  <ShuffleButton
                    key={link.path}
                    variant="filled"
                    color="orange"
                    className={`footer-console__link${location.pathname === link.path ? " is-active" : ""}`}
                    aria-label={`Navigate to ${link.label.toLowerCase()}`}
                    onClick={() => navigate(link.path)}
                  >
                    {`> ${link.label}`}
                  </ShuffleButton>
                ))}
              </Stack>
            ))}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}
