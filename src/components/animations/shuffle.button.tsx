import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button as MantineButton, type ButtonProps } from "@mantine/core";
import { useTextShuffle } from "./use-text-shuffle";

type ShuffleButtonProps = ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

function getText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(getText).join("");
  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as { children?: ReactNode; text?: unknown };
    if (typeof props.text === "string") return props.text;
    return getText(props.children);
  }
  return "";
}

export function ShuffleButton({ children, ...props }: ShuffleButtonProps) {
  const textLabel = getText(children).replace(/\s+/g, " ").trim();
  const isPlainText = typeof children === "string" || typeof children === "number";
  const { displayText, start, stop } = useTextShuffle(
    isPlainText ? String(children) : "",
  );
  const { onMouseEnter, onMouseLeave, onFocus, onBlur, ...buttonProps } = props;

  return (
    <MantineButton
      {...buttonProps}
      aria-label={buttonProps["aria-label"] ?? (textLabel || undefined)}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (isPlainText) start();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (isPlainText) stop();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (isPlainText) start();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (isPlainText) stop();
      }}
    >
      {isPlainText ? (
        <span aria-hidden="true">{displayText}</span>
      ) : (
        children
      )}
    </MantineButton>
  );
}