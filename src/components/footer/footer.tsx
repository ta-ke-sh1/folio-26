import { Box, Container, Stack } from "@mantine/core";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";
import { ShuffleButton } from "../animations/shuffle.button";
import { useAnimatedNavigate } from "../transition/transition";
import "./footer.scss";

/* ----------------------------- static data ------------------------------ */

const LOCATOR_OFFSETS = [
  [-32, -24],
  [-14, -34],
  [8, -28],
  [29, -35],
  [-39, -8],
  [-20, -13],
  [2, -11],
  [23, -8],
  [-34, 12],
  [-13, 7],
  [11, 10],
  [34, 14],
  [-25, 31],
  [-4, 27],
  [19, 32],
  [38, 30],
] as const;

const LOCATOR_REGIONS = [
  { x: -28, y: -22, width: 31, height: 23 },
  { x: 4, y: -31, width: 30, height: 19 },
  { x: -38, y: 2, width: 28, height: 21 },
  { x: -7, y: -2, width: 36, height: 24 },
  { x: 19, y: 12, width: 27, height: 21 },
] as const;

const INITIAL_POINTER: Record<string, number> = { x: 50, y: 50 } as const;
const RULER_MARKS = ["00", "20", "40", "60", "80", "100"];
const VERTICAL_RULER_MARKS = ["00", "25", "50", "75", "100"];

// Network lines connect point i -> i+1, skipping every third pair.
const NETWORK_INDEXES = Array.from(
  { length: LOCATOR_OFFSETS.length - 1 },
  (_, i) => i,
).filter((i) => i % 3 !== 1);

const sitemapLinks = [
  { label: "HOME", path: "/" },
  // { label: "ABOUT", path: "/about" },
  { label: "COLLECTIONS", path: "/collections" },
  { label: "GALLERY", path: "/gallery" },
  { label: "PLAYGROUND", path: "/playground" },
  // { label: "LOGIN", path: "/login" },
];
const SIDE_LINK_COLUMNS = [sitemapLinks.slice(0, 3), sitemapLinks.slice(3)];

/* ------------------------------- helpers -------------------------------- */

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const pad3 = (n: number) => String(n).padStart(3, "0");

const pointX = (px: number, i: number) =>
  clamp(px + LOCATOR_OFFSETS[i][0], 5, 95);
const pointY = (py: number, i: number) =>
  clamp(py + LOCATOR_OFFSETS[i][1], 7, 93);
const pointCode = (x: number, y: number, i: number) =>
  `X${pad3(Math.round(x) * 11 + i)}Y${pad3(Math.round(y) * 9 + i * 3)}`;

const regionX = (px: number, i: number) =>
  clamp(px + LOCATOR_REGIONS[i].x, 1, 99 - LOCATOR_REGIONS[i].width);
const regionY = (py: number, i: number) =>
  clamp(py + LOCATOR_REGIONS[i].y, 1, 99 - LOCATOR_REGIONS[i].height);

const pointerPath = (
  px: number,
  py: number,
  x: number,
  y: number,
  i: number,
) => {
  const bend = i % 2 === 0 ? 8 : -8;
  return `M ${px} ${py} Q ${(px + x) / 2 + bend} ${(py + y) / 2 - bend} ${x} ${y}`;
};
const networkPath = (x1: number, y1: number, x2: number, y2: number) =>
  `M ${x1} ${y1} L ${x2} ${y2}`;

// Initial (pointer = 50/50) layout, used for first render and as delta origin.
const INITIAL_POINTS = LOCATOR_OFFSETS.map((_, i) => {
  const x = pointX(INITIAL_POINTER.x, i);
  const y = pointY(INITIAL_POINTER.y, i);
  return { x, y, code: pointCode(x, y, i) };
});
const INITIAL_REGIONS = LOCATOR_REGIONS.map((r, i) => ({
  x: regionX(INITIAL_POINTER.x, i),
  y: regionY(INITIAL_POINTER.y, i),
  width: r.width,
  height: r.height,
}));

// Exponential smoothing, frame-rate independent.
const damp = (current: number, target: number, speed: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-speed * dt));

/* ------------------------------ component ------------------------------- */

type FooterProps = { compact?: boolean };

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

    const count = LOCATOR_OFFSETS.length;
    const px = new Float32Array(count); // current point x (%)
    const py = new Float32Array(count); // current point y (%)
    const codes = INITIAL_POINTS.map((p) => p.code);

    const pointer = { ...INITIAL_POINTER }; // smoothed, in % of watcher
    const pointerTarget = { ...INITIAL_POINTER };
    const iris_ = { x: 0, y: 0 }; // smoothed, in px
    const irisTarget = { x: 0, y: 0 };

    let width = 1;
    let height = 1;
    let lastClientX: number | null = null;
    let lastClientY: number | null = null;
    let needsMeasure = false;
    let visible = true;
    let dirty = true;

    /** Convert last cursor position to targets. Only reads layout. */
    const measure = () => {
      needsMeasure = false;
      if (lastClientX === null || lastClientY === null) return;

      const rect = watcher.getBoundingClientRect();
      width = rect.width || 1;
      height = rect.height || 1;
      pointerTarget.x = clamp(
        ((lastClientX - rect.left) / width) * 100,
        0,
        100,
      );
      pointerTarget.y = clamp(
        ((lastClientY - rect.top) / height) * 100,
        0,
        100,
      );

      const eyeRect = eye.getBoundingClientRect();
      const maxX = Math.max(0, (eye.clientWidth - iris.clientWidth) / 2 - 2);
      const maxY = Math.max(0, (eye.clientHeight - iris.clientHeight) / 2 - 2);
      irisTarget.x = clamp(
        lastClientX - eyeRect.left - eyeRect.width / 2,
        -maxX,
        maxX,
      );
      irisTarget.y = clamp(
        lastClientY - eyeRect.top - eyeRect.height / 2,
        -maxY,
        maxY,
      );
      dirty = true;
    };

    /** Only writes to the DOM. */
    const render = () => {
      const { x, y } = pointer;
      const mx = ((x - 50) / 100) * width;
      const my = ((y - 50) / 100) * height;
      const blobX = ((pointerTarget.x - 50) / 100) * width;
      const blobY = ((pointerTarget.y - 50) / 100) * height;
      blob.style.translate = `${blobX}px ${blobY}px`;
      crosshair.style.translate = `${mx}px ${my}px`;
      iris.style.translate = `${iris_.x}px ${iris_.y}px`;

      for (let i = 0; i < LOCATOR_REGIONS.length; i++) {
        const el = regionRefs.current[i];
        if (!el) continue;
        const dx = ((regionX(x, i) - INITIAL_REGIONS[i].x) / 100) * width;
        const dy = ((regionY(y, i) - INITIAL_REGIONS[i].y) / 100) * height;
        el.style.translate = `${dx}px ${dy}px`;
      }

      for (let i = 0; i < count; i++) {
        const cx = pointX(x, i);
        const cy = pointY(y, i);
        px[i] = cx;
        py[i] = cy;

        const el = locationRefs.current[i];
        if (el) {
          const dx = ((cx - INITIAL_POINTS[i].x) / 100) * width;
          const dy = ((cy - INITIAL_POINTS[i].y) / 100) * height;
          el.style.translate = `${dx}px ${dy}px`;
          const code = pointCode(cx, cy, i);
          if (codes[i] !== code) {
            codes[i] = code;
            el.textContent = code;
          }
        }
        pointerLineRefs.current[i]?.setAttribute(
          "d",
          pointerPath(x, y, cx, cy, i),
        );
      }

      for (const i of NETWORK_INDEXES) {
        networkLineRefs.current[i]?.setAttribute(
          "d",
          networkPath(px[i], py[i], px[i + 1], py[i + 1]),
        );
      }
    };

    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      if (needsMeasure) measure();

      const dt = Math.min(deltaTime, 64) / 1000;
      const settled =
        Math.abs(pointer.x - pointerTarget.x) < 0.005 &&
        Math.abs(pointer.y - pointerTarget.y) < 0.005 &&
        Math.abs(iris_.x - irisTarget.x) < 0.05 &&
        Math.abs(iris_.y - irisTarget.y) < 0.05;

      if (settled && !dirty) return;

      if (reduceMotion || settled) {
        pointer.x = pointerTarget.x;
        pointer.y = pointerTarget.y;
        iris_.x = irisTarget.x;
        iris_.y = irisTarget.y;
      } else {
        pointer.x = damp(pointer.x, pointerTarget.x, 8, dt);
        pointer.y = damp(pointer.y, pointerTarget.y, 8, dt);
        iris_.x = damp(iris_.x, irisTarget.x, 22, dt);
        iris_.y = damp(iris_.y, irisTarget.y, 22, dt);
      }
      dirty = false;
      render();
    };

    const onPointerMove = (e: PointerEvent) => {
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      needsMeasure = true; // measured once per frame in tick()
    };
    // Bounds change while scrolling / resizing even if the mouse is still.
    const invalidate = () => {
      needsMeasure = true;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) needsMeasure = true;
      },
      { threshold: 0 },
    );
    io.observe(watcher);

    const ro = new ResizeObserver(invalidate);
    ro.observe(watcher);

    // Initialise widths so the first render is correct.
    const rect = watcher.getBoundingClientRect();
    width = rect.width || 1;
    height = rect.height || 1;

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", invalidate, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", invalidate);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", invalidate, { capture: true });
      window.removeEventListener("resize", invalidate);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const navigate = useCallback(
    (path: string) => {
      if (path !== location.pathname) animatedNavigate(path);
    },
    [location.pathname, animatedNavigate],
  );

  return (
    <Container
      component="footer"
      fluid
      className={`footer-console${compact ? " footer-console--modal" : ""}`}
      style={{
        height: compact ? "100%" : "calc(100dvh - 80px)",
        marginBottom: compact ? "25px" : 0,
      }}
    >
      <Stack
        className="footer-console__layout"
        style={{ height: "100%", width: "100%" }}
      >
        <Box
          className="footer-console__watcher"
          ref={watcherRef}
          aria-label="Interactive location tracker"
          p="0"
        >
          <Box
            className="footer-console__blob-anchor"
            ref={blobRef}
            aria-hidden="true"
          >
            <Box className="footer-console__blob" />
          </Box>

          <div className="footer-console__grid-markings" aria-hidden="true">
            <div className="footer-console__ruler footer-console__ruler--top">
              {RULER_MARKS.map((mark, index) => (
                <span
                  key={mark}
                  style={{ left: `${(index / (RULER_MARKS.length - 1)) * 100}%` }}
                >
                  {mark}
                </span>
              ))}
            </div>
            <div className="footer-console__ruler footer-console__ruler--left">
              {VERTICAL_RULER_MARKS.map((mark, index) => (
                <span
                  key={mark}
                  style={{
                    top: `${(index / (VERTICAL_RULER_MARKS.length - 1)) * 100}%`,
                  }}
                >
                  {mark}
                </span>
              ))}
            </div>
            <span className="footer-console__grid-note footer-console__grid-note--top">
              観測座標 // 26
            </span>
            <span className="footer-console__grid-note footer-console__grid-note--bottom">
              実験領域 ・ 記録中
            </span>
          </div>

          {INITIAL_REGIONS.map((region, index) => (
            <span
              key={index}
              ref={(el) => {
                regionRefs.current[index] = el;
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
            {INITIAL_POINTS.map((point, index) => (
              <path
                key={`pointer-${index}`}
                ref={(el) => {
                  pointerLineRefs.current[index] = el;
                }}
                d={pointerPath(
                  INITIAL_POINTER.x,
                  INITIAL_POINTER.y,
                  point.x,
                  point.y,
                  index,
                )}
                className="footer-console__locator-line"
              />
            ))}
            {NETWORK_INDEXES.map((index) => {
              const a = INITIAL_POINTS[index];
              const b = INITIAL_POINTS[index + 1];
              return (
                <path
                  key={`network-${index}`}
                  ref={(el) => {
                    networkLineRefs.current[index] = el;
                  }}
                  d={networkPath(a.x, a.y, b.x, b.y)}
                  className="footer-console__locator-line footer-console__locator-line--faint"
                />
              );
            })}
          </svg>

          <span
            className="footer-console__locator-crosshair"
            ref={crosshairRef}
            style={{
              left: `${INITIAL_POINTER.x}%`,
              top: `${INITIAL_POINTER.y}%`,
            }}
            aria-hidden="true"
          />

          <Box className="footer-console__eye" ref={eyeRef} aria-hidden="true">
            <Box className="footer-console__iris" ref={irisRef}>
              <Box className="footer-console__pupil" />
            </Box>
          </Box>

          {INITIAL_POINTS.map((point, index) => (
            <span
              key={`location-${index}`}
              ref={(el) => {
                locationRefs.current[index] = el;
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
            {SIDE_LINK_COLUMNS.map((links, columnIndex) => (
              <Stack
                key={columnIndex}
                className={`footer-console__side-link-column${columnIndex === 1 ? " is-right" : ""}`}
                justify="space-between"
                mr="sm"
                ml="sm"
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
