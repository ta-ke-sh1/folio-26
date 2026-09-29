import { useTextShuffle } from "./use-text-shuffle";

interface ShuffleTextProps {
  text: string;
  className?: string;
}

export function ShuffleText({ text, className }: ShuffleTextProps) {
  const { displayText, start, stop } = useTextShuffle(text);

  return (
    <span
      className={className}
      aria-hidden="true"
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      {displayText}
    </span>
  );
}