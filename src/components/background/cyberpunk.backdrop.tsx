import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";

export type CyberpunkBackdropVariant =
  | "login"
  | "admin"
  | "about"
  | "gallery"
  | "cannister"
  | "memories"
  | "collections"
  | "collectionDetails";

type Layout = {
  label: string;
  labelPosition: CSSProperties;
  bars: CSSProperties[];
  dots: CSSProperties;
  crosses: CSSProperties[];
  frame: CSSProperties;
  scanTop: string;
  rings?: CSSProperties;
};

const layouts: Record<CyberpunkBackdropVariant, Layout> = {
  login: {
    label: "AUTH / ACCESS NODE",
    labelPosition: { top: "16%", right: "8%" },
    bars: [{ top: "19%", right: "8%", width: "19%", height: 28 }],
    dots: { bottom: "16%", left: "10%", width: 52, height: 42 },
    crosses: [{ top: "23%", left: "13%" }, { bottom: "22%", right: "12%" }],
    frame: { top: "13%", right: "7%", width: "23%", height: "19%" },
    scanTop: "68%",
  },
  admin: {
    label: "CONTROL / SECTOR 07",
    labelPosition: { top: "14%", left: "calc(250px + 5%)" },
    bars: [{ top: "17%", left: "calc(250px + 5%)", width: "28%", height: 34 }, { bottom: "11%", right: "6%", width: "16%", height: 18 }],
    dots: { top: "34%", right: "5%", width: 58, height: 58 },
    crosses: [{ top: "30%", left: "calc(250px + 7%)" }, { bottom: "20%", right: "9%" }],
    frame: { top: "12%", right: "4%", width: "30%", height: "22%" },
    scanTop: "58%",
  },
  about: {
    label: "PERSONAL SIGNAL / LIVE",
    labelPosition: { top: "8%", left: "4%" },
    bars: [{ top: "8%", right: "5%", width: "22%", height: 26 }],
    dots: { bottom: "14%", right: "8%", width: 54, height: 48 },
    crosses: [{ top: "24%", right: "12%" }, { bottom: "18%", left: "7%" }],
    frame: { top: "7%", left: "3%", width: "22%", height: "17%" },
    scanTop: "43%",
    rings: { top: "50%", left: "50%", width: "min(54vw, 540px)", aspectRatio: 1.55 },
  },
  gallery: {
    label: "ORBITAL ARRAY / 04",
    labelPosition: { top: "10%", right: "6%" },
    bars: [{ bottom: "12%", left: "7%", width: "23%", height: 22 }],
    dots: { top: "18%", left: "8%", width: 48, height: 48 },
    crosses: [{ top: "23%", right: "14%" }, { bottom: "19%", left: "34%" }],
    frame: { bottom: "9%", right: "6%", width: "21%", height: "18%" },
    scanTop: "35%",
    rings: { top: "50%", left: "50%", width: "min(62vw, 650px)", aspectRatio: 1 },
  },
  cannister: {
    label: "FRAME INDEX / EXPOSURE DATA",
    labelPosition: { top: "13%", left: "5%" },
    bars: [{ top: "19%", left: "5%", width: 22, height: "46%" }, { bottom: "12%", right: "8%", width: "25%", height: 20 }],
    dots: { top: "16%", right: "9%", width: 46, height: 50 },
    crosses: [{ top: "40%", right: "8%" }, { bottom: "20%", left: "9%" }],
    frame: { top: "12%", left: "4%", width: "24%", height: "62%" },
    scanTop: "74%",
  },
  memories: {
    label: "MEMORY BANK / PLAYBACK",
    labelPosition: { top: "9%", right: "6%" },
    bars: [{ top: "14%", right: "6%", width: "24%", height: 26 }, { bottom: "15%", left: "7%", width: "17%", height: 18 }],
    dots: { bottom: "24%", right: "8%", width: 56, height: 46 },
    crosses: [{ top: "20%", left: "8%" }, { bottom: "18%", right: "28%" }],
    frame: { top: "8%", right: "5%", width: "27%", height: "21%" },
    scanTop: "52%",
  },
  collections: {
    label: "CATALOG / MONTHLY INDEX",
    labelPosition: { top: "18%", left: "6%" },
    bars: [{ top: "21%", left: "6%", width: "20%", height: 24 }, { bottom: "13%", right: "7%", width: "28%", height: 28 }],
    dots: { top: "38%", right: "8%", width: 54, height: 54 },
    crosses: [{ top: "15%", right: "12%" }, { bottom: "20%", left: "8%" }],
    frame: { bottom: "10%", left: "5%", width: "22%", height: "20%" },
    scanTop: "62%",
  },
  collectionDetails: {
    label: "COLLECTION FILE / DETAIL VIEW",
    labelPosition: { top: "14%", right: "8%" },
    bars: [{ top: "18%", right: "8%", width: "22%", height: 30 }],
    dots: { bottom: "13%", left: "7%", width: 48, height: 48 },
    crosses: [{ top: "20%", left: "8%" }, { bottom: "18%", right: "7%" }],
    frame: { top: "12%", right: "6%", width: "26%", height: "20%" },
    scanTop: "71%",
  },
};

const crosshairStyle: CSSProperties = {
  position: "absolute",
  width: 12,
  height: 12,
  color: "rgba(255, 170, 96, 0.5)",
};

export default function CyberpunkBackdrop({
  variant,
  layer = -1,
}: {
  variant: CyberpunkBackdropVariant;
  layer?: number;
}) {
  return (
    <></>
  );
}