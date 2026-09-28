import { useEffect, useState } from "react";

const GLYPHS = "電脳未来回路仮想記録光夢夜接続探索情報";

type BilingualShuffleProps = {
  english: string;
  japanese: string;
  className?: string;
};

export default function BilingualShuffle({
  english,
  japanese,
  className = "",
}: BilingualShuffleProps) {
  const [displayText, setDisplayText] = useState(english);
  const [isJapanese, setIsJapanese] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeoutId: number;
    let intervalId: number;
    let showingJapanese = false;

    const shuffleTo = (target: string, targetIsJapanese: boolean) => {
      let iteration = 0;
      intervalId = window.setInterval(() => {
        setDisplayText(
          target
            .split("")
            .map((character, index) =>
              index < iteration
                ? character
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
        iteration += 1;

        if (iteration > target.length) {
          window.clearInterval(intervalId);
          setDisplayText(target);
          setIsJapanese(targetIsJapanese);
          showingJapanese = targetIsJapanese;
          timeoutId = window.setTimeout(
            () =>
              shuffleTo(
                showingJapanese ? english : japanese,
                !showingJapanese,
              ),
            2600 + Math.random() * 3000,
          );
        }
      }, 48);
    };

    timeoutId = window.setTimeout(
      () => shuffleTo(japanese, true),
      1800 + Math.random() * 2400,
    );

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [english, japanese]);

  return (
    <span
      className={`bilingual-shuffle${className ? ` ${className}` : ""}`}
      data-language={isJapanese ? "ja" : "en"}
      aria-label={english}
      style={{
        display: "inline",
        fontFamily: '"DotGothic16", sans-serif',
        letterSpacing: isJapanese ? "0.04em" : undefined,
      }}
    >
      {displayText}
    </span>
  );
}