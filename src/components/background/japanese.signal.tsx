import { useEffect, useRef, useState } from "react";
import "./japanese.signal.scss";

const SIGNAL_BANKS = {
  story: [
    "電脳都市",
    "都市の残響",
    "記憶を探す",
    "人間の物語",
    "意識を接続",
    "過去を再生",
    "存在を記録",
    "誰かの夢",
  ],
  philosophy: [
    "ネオンの夢",
    "光を追え",
    "夜明け前",
    "感覚を設計",
    "境界を越える",
    "未来を想像",
    "共鳴する心",
    "意味を探す",
  ],
  capability: [
    "未来回路",
    "電子の迷宮",
    "接続中",
    "技術の境界",
    "信号を解析",
    "構造を描く",
    "応答を待機",
    "システム稼働",
  ],
  technology: [
    "仮想空間",
    "データの海",
    "無限の夜",
    "回路を構築",
    "情報を転送",
    "機械の記憶",
    "層を同期",
    "網目を探索",
  ],
  about: [
    "自己紹介",
    "現在地を確認",
    "人とコード",
    "静かな情熱",
    "個体を認識",
    "物語を読込",
    "記録を照合",
    "接点を発見",
  ],
  collection: [
    "時間を収集",
    "記録の断片",
    "過去と未来",
    "記憶の保管庫",
    "断片を整理",
    "履歴を検索",
    "記録を同期",
    "収蔵品を確認",
  ],
  gallery: [
    "光を記録",
    "視点を移動",
    "夜の観測者",
    "瞬間を保存",
    "焦点を合わせ",
    "像を現像",
    "光跡を追跡",
    "フレームを走査",
  ],
  playground: [
    "自由実験区",
    "未完成の発想",
    "遊びを開始",
    "未知へ接続",
    "試作を起動",
    "変数を変更",
    "境界を試験",
    "新規信号",
  ],
} as const;

export type JapaneseSignalChannel = keyof typeof SIGNAL_BANKS;
export type JapaneseSignalVariant = "mixed" | "telemetry" | "minimal";
const GLYPHS = "電脳都市未来回路仮想空間夜明前記憶光電子迷宮無限接続夢海残響";
const FRAGMENT_COUNT = 5;

type JapaneseSignalProps = {
  channel: JapaneseSignalChannel;
  className?: string;
  variant?: JapaneseSignalVariant;
  placement?: "flow" | "grid-items";
};

function SignalFragment({
  channel,
  index,
  initialOffset,
  variant,
}: {
  channel: JapaneseSignalChannel;
  index: number;
  initialOffset: number;
  variant: JapaneseSignalVariant;
}) {
  const phrases = SIGNAL_BANKS[channel];
  const initialPhrase = phrases[(initialOffset + index) % phrases.length];
  const [text, setText] = useState<string>(initialPhrase);
  const currentPhraseRef = useRef(initialPhrase);

  useEffect(() => {
    let cycleTimeout: number;
    let scrambleInterval: number;
    const shuffle = () => {
      const choices = phrases.filter(
        (signal) => signal !== currentPhraseRef.current,
      );
      const target = choices[Math.floor(Math.random() * choices.length)];
      let iteration = 0;

      scrambleInterval = window.setInterval(() => {
        setText(
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
          window.clearInterval(scrambleInterval);
          setText(target);
          currentPhraseRef.current = target;
          cycleTimeout = window.setTimeout(
            shuffle,
            1400 + Math.random() * 1800,
          );
        }
      }, 52);
    };

    cycleTimeout = window.setTimeout(
      shuffle,
      250 + index * 320 + Math.random() * 1100,
    );

    return () => {
      window.clearTimeout(cycleTimeout);
      window.clearInterval(scrambleInterval);
    };
  }, [channel, index, phrases]);

  return (
    <span
      className={`section-japanese-signal__fragment section-japanese-signal__fragment--${variant} fragment-${index + 1}`}
    >
      <span className="section-japanese-signal__meta">
        JP-{String(index + 1).padStart(2, "0")} /
      </span>
      <span className="section-japanese-signal__text">{text}</span>
    </span>
  );
}

export default function JapaneseSignal({
  channel,
  className = "",
  variant = "mixed",
  placement = "flow",
}: JapaneseSignalProps) {
  const phrases = SIGNAL_BANKS[channel];
  const [initialOffset] = useState(() =>
    Math.floor(Math.random() * phrases.length),
  );

  return (
    <div
      className={`section-japanese-signal${placement === "grid-items" ? " section-japanese-signal--grid-items" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      {Array.from({ length: FRAGMENT_COUNT }, (_, index) => (
        <SignalFragment
          key={`${channel}-${index}`}
          channel={channel}
          index={index}
          initialOffset={initialOffset}
          variant={variant}
        />
      ))}
    </div>
  );
}
