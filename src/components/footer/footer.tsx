import { Box, Container, Stack, useMantineTheme } from "@mantine/core";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";
import { ShuffleButton } from "../animations/shuffle.button";
import { useAnimatedNavigate } from "../transition/transition";
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
} from "@tabler/icons-react";
import BilingualShuffle from "../animations/bilingual.shuffle";

const createFooterStyles = (xsBreakpoint: string) => `
.footer-console {
  position: relative; z-index: 10; width: calc(100dvw / var(--folio-viewport-scale, 1)) !important;
  max-width: none !important; margin-inline: 0 !important; box-sizing: border-box;
  padding: 0 0 calc(40px / var(--folio-viewport-scale, 1)) !important;
  background: var(--folio-page-bg); color: var(--folio-text); border-bottom: 1px solid rgba(105,67,41,.58);
}
.footer-console__layout { width: 100%; height: 100%; justify-content: space-between; }
.footer-console__side-sitemap {
  position: absolute; z-index: 4; top: 50%; left: 0; display: grid; width: 100%;
  grid-template-columns: minmax(0,1fr) minmax(0,1fr); align-items: center;
  transform: translateY(-50%); pointer-events: none;
}
.footer-console__side-link-column, .footer-console__social-column {
  min-width: 0; height: clamp(180px,38vh,300px); gap: clamp(8px,1.5vh,14px) !important; pointer-events: auto;
}
.footer-console__side-link-column { grid-column: 1; align-items: flex-start; }
.footer-console__social-column { grid-column: 2; align-items: flex-end; }
.footer-console__watcher {
  --locator-orange: 255,132,32; --locator-highlight: 255,190,102;
  --locator-grid: rgba(255,132,32,.045); --locator-grid-major: rgba(255,132,32,.1);
  --locator-grid-label: rgba(255,190,102,.52); position: relative; display: block;
  min-height: clamp(310px,30vw,460px); flex: 1 1 auto; flex-direction: column; width: 100%;
  margin: 0; overflow: hidden; isolation: isolate;
  background: linear-gradient(var(--locator-grid-major) 1px,transparent 1px),
    linear-gradient(90deg,var(--locator-grid-major) 1px,transparent 1px),
    linear-gradient(var(--locator-grid) 1px,transparent 1px),
    linear-gradient(90deg,var(--locator-grid) 1px,transparent 1px),
    radial-gradient(ellipse at center,rgba(var(--locator-orange),.11),transparent 68%);
  background-size: 120px 120px,120px 120px,24px 24px,24px 24px,auto;
}
:root[data-mantine-color-scheme="light"] .footer-console__watcher {
  --locator-grid: rgba(85,61,42,.055); --locator-grid-major: rgba(150,85,43,.12); --locator-grid-label: rgba(105,67,41,.58);
}
.footer-console__grid-markings { position: absolute; z-index: 1; inset: 0; color: var(--locator-grid-label); font: 500 9px/1 "DM Mono",monospace; letter-spacing: .08em; pointer-events: none; }
.footer-console__ruler { position: absolute; }
.footer-console__ruler--top { top: 14px; right: 34px; left: 34px; height: 12px; border-top: 1px solid var(--locator-grid-major); background: repeating-linear-gradient(90deg,var(--locator-grid-label) 0 1px,transparent 1px 8px); background-size: 100% 5px; background-repeat: no-repeat; }
.footer-console__ruler--top span { position: absolute; top: 7px; transform: translateX(-50%); }
.footer-console__ruler--left { top: 34px; bottom: 34px; left: 18px; width: 16px; border-left: 1px solid var(--locator-grid-major); background: repeating-linear-gradient(180deg,var(--locator-grid-label) 0 1px,transparent 1px 8px); background-size: 5px 100%; background-repeat: no-repeat; }
.footer-console__ruler--left span { position: absolute; left: 7px; transform: translateY(-50%); }
.footer-console__grid-note { position: absolute; font-family: "Noto Sans JP","Yu Gothic",sans-serif; letter-spacing: .12em; }
.footer-console__grid-note--top { top: 38px; right: 36px; }
.footer-console__grid-note--bottom { bottom: 16px; left: 38px; }
.footer-console__watcher::before, .footer-console__watcher::after { position: absolute; top: 50%; width: 18vw; max-width: 260px; height: 1px; content: ""; background: rgba(var(--locator-orange),.42); pointer-events: none; }
.footer-console__watcher::before { left: 0; }
.footer-console__watcher::after { right: 0; }
.footer-console__blob-anchor { position: absolute; z-index: 0; top: 50%; left: 50%; width: clamp(190px,34vw,430px); aspect-ratio: 1; pointer-events: none; transform: translate(-50%,-50%); }
.footer-console__blob { position: absolute; inset: 0; border-radius: 38% 62% 68% 32% / 42% 45% 55% 58%; background: radial-gradient(circle at 35% 32%,rgba(var(--locator-highlight),.82),transparent 28%),radial-gradient(circle at 68% 42%,rgba(var(--locator-orange),.82),transparent 42%),radial-gradient(circle at 42% 68%,rgba(170,58,8,.8),transparent 48%); filter: blur(26px) saturate(140%); opacity: .48; transform-origin: center; transition: opacity 250ms ease; animation: footer-blob-morph 9s ease-in-out infinite alternate; will-change: transform; }
.footer-console__blob::before { position: absolute; inset: -8%; border-radius: 50%; background: conic-gradient(from 0deg,transparent 0deg 250deg,rgba(var(--locator-orange),.12) 276deg,rgba(var(--locator-orange),.82) 307deg,rgba(var(--locator-highlight),.92) 326deg,transparent 352deg 360deg); content: ""; filter: blur(6px); opacity: .72; transform-origin: center; -webkit-mask: radial-gradient(closest-side,transparent 55%,#000 59% 66%,transparent 72%); mask: radial-gradient(closest-side,transparent 55%,#000 59% 66%,transparent 72%); pointer-events: none; animation: footer-blob-orbit 8s linear infinite; }
.footer-console__watcher:hover .footer-console__blob { opacity: .78; }
@keyframes footer-blob-orbit { to { rotate: 360deg; } }
@keyframes footer-blob-morph {
  0% { border-radius: 38% 62% 68% 32% / 42% 45% 55% 58%; scale: .92; rotate: 0deg; }
  50% { border-radius: 58% 42% 36% 64% / 56% 36% 64% 44%; scale: 1.06; rotate: 180deg; }
  100% { border-radius: 44% 56% 58% 42% / 34% 58% 42% 66%; scale: .98; rotate: 360deg; }
}
.footer-console__locator-lines { position: absolute; z-index: 2; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.footer-console__locator-line { fill: none; stroke: rgba(var(--locator-highlight),.95); stroke-width: .28; stroke-dasharray: .45 .55; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 2px rgba(var(--locator-orange),.95)); transition: d 180ms ease-out; }
.footer-console__locator-line--faint { stroke: rgba(var(--locator-orange),.72); stroke-width: .2; stroke-dasharray: .38 .62; opacity: .78; }
.footer-console__locator-region { position: absolute; z-index: 1; border: 1px solid rgba(var(--locator-orange),.78); background: repeating-linear-gradient(0deg,rgba(var(--locator-orange),.12) 0 1px,transparent 1px 4px),linear-gradient(135deg,rgba(var(--locator-orange),.12),rgba(var(--locator-orange),.02)); box-shadow: inset 0 0 14px rgba(var(--locator-orange),.1),0 0 7px rgba(var(--locator-orange),.2); opacity: .78; pointer-events: none; transition: left 420ms cubic-bezier(.2,.75,.2,1),top 420ms cubic-bezier(.2,.75,.2,1),width 420ms ease,height 420ms ease; }
.footer-console__location { position: absolute; z-index: 2; padding: 3px 5px; border: 1px solid rgba(var(--locator-highlight),.95); background: rgba(20,9,2,.92); color: #ffad57; font: 700 clamp(9px,.9vw,11px)/1.1 "DM Mono",monospace; letter-spacing: .015em; white-space: nowrap; pointer-events: none; text-shadow: 0 0 7px rgba(var(--locator-orange),.72); box-shadow: 0 0 7px rgba(var(--locator-orange),.32),inset 0 0 5px rgba(var(--locator-orange),.1); transform: translate(-50%,-50%); transition: left 380ms cubic-bezier(.2,.75,.2,1),top 380ms cubic-bezier(.2,.75,.2,1); }
.footer-console__location.is-large { padding: 5px 7px; font-size: clamp(8px,.9vw,12px); background: rgba(24,10,1,.94); }
.footer-console__locator-crosshair { position: absolute; z-index: 1; width: 12px; height: 12px; border: 1px solid rgba(var(--locator-highlight),.95); background: rgba(var(--locator-orange),.15); box-shadow: 0 0 12px rgba(var(--locator-orange),.9); transform: translate(-50%,-50%); transition: none; will-change: translate; pointer-events: none; }
.footer-console__locator-crosshair::before, .footer-console__locator-crosshair::after { position: absolute; top: 50%; left: 50%; content: ""; background: rgba(var(--locator-highlight),.88); transform: translate(-50%,-50%); }
.footer-console__locator-crosshair::before { width: 24px; height: 1px; }
.footer-console__locator-crosshair::after { width: 1px; height: 24px; }
.footer-console__eye { position: absolute; z-index: 3; top: 50%; left: 50%; width: min(66vw,390px); aspect-ratio: 2.15; overflow: hidden; border: 1px solid rgba(var(--locator-highlight),.98); border-radius: 50%; background: rgba(20,9,2,.9); box-shadow: 0 0 45px rgba(var(--locator-orange),.26),inset 0 0 28px rgba(var(--locator-orange),.1); transform: translate(-50%,-50%); transform-origin: center; pointer-events: none; animation: footer-eye-blink 7s ease-in-out infinite; }
.footer-console__eye::before, .footer-console__eye::after { position: absolute; z-index: 0; content: ""; background: rgba(var(--locator-orange),.52); pointer-events: none; }
.footer-console__eye::before { top: 50%; left: 0; width: 100%; height: 1px; }
.footer-console__eye::after { top: 0; left: 50%; width: 1px; height: 100%; }
.footer-console__iris { position: absolute; z-index: 1; top: 50%; left: 50%; width: clamp(54px,10vw,78px); aspect-ratio: 1; transform: translate(-50%,-50%); transition: left 120ms ease-out,top 120ms ease-out; border: 1px solid #ff8a24; border-radius: 50%; background: #ff8a24; box-shadow: inset 0 0 0 7px rgba(var(--locator-orange),.16),0 0 24px rgba(var(--locator-orange),.88); }
.footer-console__pupil { position: absolute; z-index: 2; top: 50%; left: 50%; width: 38%; aspect-ratio: 1; border-radius: 50%; background: #1a0a01; transform: translate(-50%,-50%); }
@keyframes footer-eye-blink { 0%,48%,52%,100% { scale: 1 1; } 50% { scale: 1 .08; } }
.footer-console .footer-console__link { display: flex; width: fit-content; min-height: 28px; justify-content: flex-start; align-items: center; padding: 4px 5px; border: 1px solid rgba(255,180,110,.38); border-radius: 0; background: linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,119,0,.09)); -webkit-backdrop-filter: blur(10px) saturate(145%); backdrop-filter: blur(10px) saturate(145%); color: #ffd2a6 !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.16),0 4px 18px rgba(255,119,0,.12); font-family: monospace; font-size: 11px; letter-spacing: .08em; text-align: left; text-decoration: none; transition: color 160ms ease; }
.footer-console .footer-console__side-link-column .footer-console__link { width: fit-content !important; align-self: flex-start; }
.footer-console .footer-console__link:hover, .footer-console .footer-console__link:focus-visible, .footer-console .footer-console__link.is-active { border-color: rgba(255,190,135,.62); background: linear-gradient(135deg,rgba(255,255,255,.2),rgba(255,119,0,.2)); color: #fff0df !important; }
.footer-console .footer-console__link:focus-visible { outline: 2px solid var(--folio-accent-hover); outline-offset: 3px; }
:root[data-mantine-color-scheme="light"] .footer-console .footer-console__link, :root[data-mantine-color-scheme="light"] .footer-console .footer-console__link:hover, :root[data-mantine-color-scheme="light"] .footer-console .footer-console__link:focus-visible, :root[data-mantine-color-scheme="light"] .footer-console .footer-console__link.is-active { color: var(--folio-text) !important; }
@media (max-width: ${xsBreakpoint}) {
  .footer-console { height: calc(100dvh - 40px) !important; padding: 0 0 calc(40px / var(--folio-viewport-scale,1)) !important; box-sizing: border-box !important; overflow: hidden !important; }
  .footer-console__layout { position: relative !important; height: 100% !important; min-height: 0 !important; justify-content: space-between !important; }
  .footer-console__watcher { position: absolute !important; z-index: 2; inset: 0 !important; width: 100% !important; min-height: 0 !important; max-height: none !important; flex: none !important; margin: 0 !important; left: auto !important; }
  .footer-console__watcher::before, .footer-console__watcher::after { width: 12vw !important; }
  .footer-console__grid-markings { font-size: 7px; }
  .footer-console__ruler--top { top: 10px; right: 20px; left: 20px; }
  .footer-console__ruler--left { left: 8px; }
  .footer-console__grid-note--top { top: 30px; right: 20px; }
  .footer-console__grid-note--bottom { bottom: 10px; left: 24px; }
  .footer-console__blob-anchor { width: clamp(170px,58vw,250px); }
  .footer-console__blob { filter: blur(22px) saturate(140%); }
  .footer-console__eye { width: min(30vw,150px); }
  .footer-console__iris { width: 32px; }
  .footer-console__location { padding: 3px 4px; font-size: 8px; }
  .footer-console__location.is-large { padding: 4px 5px; font-size: 9px; }
  .footer-console__locator-crosshair { width: 10px; height: 10px; }
  .footer-console__side-link-column, .footer-console__social-column { height: clamp(150px,32vh,230px); gap: clamp(6px,1.5vh,10px) !important; }
  .footer-console .footer-console__link { width: auto !important; max-width: 100% !important; min-height: 28px !important; height: auto !important; justify-content: flex-start !important; padding: 3px 5px !important; font-size: clamp(7px,2vw,9px) !important; line-height: 1.25 !important; letter-spacing: .02em !important; white-space: normal !important; overflow-wrap: anywhere; }
  .footer-console .footer-console__side-link-column .footer-console__link { width: fit-content !important; align-self: flex-start; }
  .footer-console__social-column .footer-console__link { justify-content: flex-end !important; text-align: right !important; }
}
.footer-console--modal { width: 100% !important; max-width: 100% !important; margin: 0 !important; height: 100% !important; min-height: 0 !important; max-height: 100% !important; padding: 0 !important; overflow: hidden !important; }
.footer-console--modal .footer-console__layout { height: 100% !important; min-height: 0 !important; }
.footer-console--modal .footer-console__watcher { position: absolute !important; inset: 0 !important; width: 100% !important; min-height: 0 !important; max-height: none !important; flex: none !important; margin: 0 !important; left: auto !important; }
@media (prefers-reduced-motion: reduce) {
  .footer-console__blob, .footer-console__blob::before, .footer-console__eye { animation: none; }
  .footer-console__location, .footer-console__locator-region, .footer-console__locator-crosshair, .footer-console__locator-line { transition: none; }
}
`;

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
  { label: "COLLECTIONS", path: "/collections" },
  { label: "GALLERY", path: "/gallery" },
  { label: "PLAYGROUND", path: "/playground" },
];

const socialLinks = [
  {
    label: "Discord",
    handle: "developer#0001",
    href: "https://discord.com/",
    icon: IconBrandDiscord,
  },
  {
    label: "Facebook",
    handle: "@dev_terminal",
    href: "https://www.facebook.com/ed.1698",
    icon: IconBrandFacebook,
  },
  {
    label: "Instagram",
    handle: "@dev:matrix.org",
    href: "https://www.instagram.com/tru.ng_ha/",
    icon: IconBrandInstagram,
  },
  {
    label: "Github",
    handle: "github.com/dev-profile",
    href: "https://github.com/ta-ke-sh1",
    icon: IconBrandGithub,
  },
];

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
  const theme = useMantineTheme();
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
        height: compact ? "100%" : "calc(100dvh - 40px)",
        width: compact ? "100%" : "100dvw",
        marginBottom: compact ? "25px" : 0,
      }}
    >
      <style>{createFooterStyles(theme.breakpoints.xs)}</style>
      <Stack
        className="footer-console__layout"
        style={{ height: "100%", width: "100%" }}
      >
        <Box
          className="footer-console__watcher"
          data-cursor="crosshair"
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
                  style={{
                    left: `${(index / (RULER_MARKS.length - 1)) * 100}%`,
                  }}
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
            aria-label="Footer links and social networks"
          >
            <Stack
              component="nav"
              className="footer-console__side-link-column"
              aria-label="Site navigation"
              justify="space-between"
              ml="sm"
            >
              {sitemapLinks.map((link) => (
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

            <Stack
              component="nav"
              className="footer-console__social-column"
              aria-label="Social networks"
              justify="space-between"
              align="flex-end"
              mr="sm"
            >
              {socialLinks.map((link) => {
                const SocialIcon = link.icon;
                return (
                  <ShuffleButton
                    key={link.label}
                    component="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="filled"
                    color="orange"
                    className="footer-console__link footer-console__social-link"
                    aria-label={`${link.label}: ${link.href} (opens in a new tab)`}
                    title={link.href}
                    leftSection={
                      <SocialIcon
                        style={{ marginLeft: "5px" }}
                        size={14}
                        aria-hidden="true"
                      />
                    }
                  >
                    {`> ${link.label}`}
                  </ShuffleButton>
                );
              })}
            </Stack>
          </Box>
        </Box>
        <Box
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <BilingualShuffle
            english="Click to navigate"
            japanese="クリックして移動"
          />
        </Box>
      </Stack>
    </Container>
  );
}
