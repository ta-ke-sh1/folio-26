import {
  useRef,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Button as MantineButton, type ButtonProps } from "@mantine/core";
import { useTextShuffle } from "./use-text-shuffle";

type ShuffleButtonProps = ButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    component?: "button" | "a";
    href?: string;
    target?: string;
    rel?: string;
  };

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

export function ShuffleButton({
  children,
  component = "button",
  href,
  target,
  rel,
  ...props
}: ShuffleButtonProps) {
  const textLabel = getText(children).replace(/\s+/g, " ").trim();
  const isPlainText =
    typeof children === "string" || typeof children === "number";
  const { displayText, start, stop } = useTextShuffle(
    isPlainText ? String(children) : "",
  );
  const { onMouseEnter, onMouseLeave, onFocus, onBlur, ...buttonProps } = props;

  return (
    <MantineButton
      variant="filled"
      component={component as any}
      href={href}
      target={target}
      rel={rel}
      {...buttonProps}
      aria-label={buttonProps["aria-label"] ?? (textLabel || undefined)}
      onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => {
        onMouseEnter?.(event);
        if (isPlainText) start();
      }}
      onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
        onMouseLeave?.(event);
        if (isPlainText) stop();
      }}
      onFocus={(event: FocusEvent<HTMLButtonElement>) => {
        onFocus?.(event);
        if (isPlainText) start();
      }}
      onBlur={(event: FocusEvent<HTMLButtonElement>) => {
        onBlur?.(event);
        if (isPlainText) stop();
      }}
    >
      {isPlainText ? (
        <span
          aria-hidden="true"
          style={{
            marginLeft: "5px",
            marginRight: "5px",
          }}
        >
          {displayText}
        </span>
      ) : (
        children
      )}
    </MantineButton>
  );
}
