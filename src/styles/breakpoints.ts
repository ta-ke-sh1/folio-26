export const MANTINE_BREAKPOINTS = {
  xs: "36em",
  sm: "48em",
  md: "62em",
  lg: "75em",
  xl: "88em",
} as const;

export type MantineBreakpointName = keyof typeof MANTINE_BREAKPOINTS;

export function maxWidth(breakpoint: MantineBreakpointName): string {
  return `(max-width: ${MANTINE_BREAKPOINTS[breakpoint]})`;
}

export function minWidth(breakpoint: MantineBreakpointName): string {
  return `(min-width: ${MANTINE_BREAKPOINTS[breakpoint]})`;
}
