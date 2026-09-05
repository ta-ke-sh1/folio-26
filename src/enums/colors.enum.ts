import type { MantineColorsTuple } from "@mantine/core";

// 1. Strict Enum for direct inline styles and logic
export enum ColorPalette {
  // Orange Spectrum
  Orange50 = "#FFF0E5",
  Orange100 = "#FFE0CC",
  Orange200 = "#FFBF99",
  Orange300 = "#FF9C66",
  Orange400 = "#FF7E33",
  Orange500 = "#FF670D",
  Orange600 = "#FF5500", // Core Brand Accent
  Orange700 = "#E64A00",
  Orange800 = "#CC3E00",
  Orange900 = "#B33300",

  // Pure Black & Dark Spectrum
  BlackPure = "#000000",
  BlackBody = "#020202",
  BlackSurface = "#050505",
  BlackCard = "#0D0D0D",
  BlackHover = "#141414",
  BlackBorder = "#1F1F1F",

  // Text Colors
  TextPrimary = "#FFFFFF",
  TextMuted = "#A6A7AB",
}

// 2. Mantine 10-shade tuples
export const primaryOrange: MantineColorsTuple = [
  ColorPalette.Orange50,
  ColorPalette.Orange100,
  ColorPalette.Orange200,
  ColorPalette.Orange300,
  ColorPalette.Orange400,
  ColorPalette.Orange500,
  ColorPalette.Orange600,
  ColorPalette.Orange700,
  ColorPalette.Orange800,
  ColorPalette.Orange900,
];

export const pitchBlack: MantineColorsTuple = [
  ColorPalette.TextMuted,
  "#A6A7AB",
  "#909296",
  "#333333",
  ColorPalette.BlackBorder,
  ColorPalette.BlackHover,
  ColorPalette.BlackCard,
  ColorPalette.BlackSurface,
  ColorPalette.BlackBody,
  ColorPalette.BlackPure,
];
