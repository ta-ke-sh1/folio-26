import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleText } from "../../services/utils.service";

export function useTextShuffle(text: string) {
  const [displayText, setDisplayText] = useState(text);
  const [isShuffling, setIsShuffling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsShuffling(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    setIsShuffling(true);
    intervalRef.current = setInterval(() => {
      setDisplayText(shuffleText(text, iteration));
      if (iteration >= text.length * 3) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsShuffling(false);
        return;
      }
      iteration += 1;
    }, 30);
  }, [text]);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  return { displayText: isShuffling ? displayText : text, start, stop };
}