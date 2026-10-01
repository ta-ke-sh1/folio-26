import { useEffect, useState } from "react";
import { Box, Group, Text } from "@mantine/core";

const JAPANESE_LABELS = ["東京記録", "電脳回廊", "夜間資料", "光学記憶"];
const JAPANESE_GLYPHS = "東京電脳回路記録光夜資料記憶接続未来";

function JapaneseShuffleReadout() {
  const [label, setLabel] = useState(JAPANESE_LABELS[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let labelIndex = 0;
    let cycleTimeout = 0;
    let scrambleInterval = 0;

    const shuffle = () => {
      labelIndex = (labelIndex + 1) % JAPANESE_LABELS.length;
      const target = JAPANESE_LABELS[labelIndex];
      let iteration = 0;

      scrambleInterval = window.setInterval(() => {
        setLabel(
          target
            .split("")
            .map((character, index) =>
              index < iteration
                ? character
                : JAPANESE_GLYPHS[
                    Math.floor(Math.random() * JAPANESE_GLYPHS.length)
                  ],
            )
            .join(""),
        );
        iteration += 1;

        if (iteration > target.length) {
          window.clearInterval(scrambleInterval);
          setLabel(target);
          cycleTimeout = window.setTimeout(shuffle, 1800);
        }
      }, 58);
    };

    cycleTimeout = window.setTimeout(shuffle, 900);
    return () => {
      window.clearTimeout(cycleTimeout);
      window.clearInterval(scrambleInterval);
    };
  }, []);

  return <>{label}</>;
}

const cornerStyle = {
  position: "absolute" as const,
  width: 20,
  height: 20,
  borderColor: "rgba(255, 119, 0, .58)",
};

export default function GalleryHud() {
  return (
    <Box
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        overflow: "hidden",
        pointerEvents: "none",
        color: "rgba(255, 207, 171, .7)",
        fontFamily: "DM Mono, monospace",
      }}
    >
      <style>{`
        @keyframes gallery-hud-scan {
          0% { transform: translateY(-110%); opacity: 0; }
          8% { opacity: .45; }
          92% { opacity: .22; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes gallery-hud-blink {
          0%, 44%, 48%, 100% { opacity: .95; }
          46% { opacity: .25; }
        }
        @keyframes gallery-hud-meter {
          from { transform: scaleX(.28); }
          to { transform: scaleX(1); }
        }
        @media (max-width: 640px) {
          .gallery-hud-side-label, .gallery-hud-micro { display: none !important; }
          .gallery-hud-top-right { right: 18px !important; }
          .gallery-hud-bottom { left: 18px !important; right: 18px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-hud-scan, .gallery-hud-blink, .gallery-hud-meter { animation: none !important; }
        }
      `}</style>

      <Box
        className="gallery-hud-scan"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "18vh",
          background:
            "linear-gradient(180deg, transparent, rgba(255, 72, 32, .035), transparent)",
          animation: "gallery-hud-scan 12s linear infinite",
        }}
      />

      <Box style={{ ...cornerStyle, top: 17, left: 17, borderTop: "1px solid", borderLeft: "1px solid" }} />
      <Box style={{ ...cornerStyle, top: 17, right: 17, borderTop: "1px solid", borderRight: "1px solid" }} />
      <Box style={{ ...cornerStyle, bottom: 17, left: 17, borderBottom: "1px solid", borderLeft: "1px solid" }} />
      <Box style={{ ...cornerStyle, bottom: 17, right: 17, borderBottom: "1px solid", borderRight: "1px solid" }} />

      <Group
        gap={8}
        className="gallery-hud-top-right"
        style={{ position: "absolute", top: 31, right: 34, alignItems: "center" }}
      >
        <Box
          className="gallery-hud-blink"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ff503d",
            boxShadow: "0 0 10px #ff503d",
            animation: "gallery-hud-blink 2.6s steps(1, end) infinite",
          }}
        />
        <Text className="gallery-hud-micro" size="8px" c="rgba(255,119,0,.62)">
          35°41′N · 139°41′E
        </Text>
      </Group>

      <Group
        className="gallery-hud-bottom"
        justify="space-between"
        style={{
          position: "absolute",
          left: 34,
          right: 34,
          bottom: 31,
          alignItems: "center",
          gap: 16,
        }}
      >
        <Text className="gallery-hud-micro" size="8px" c="rgba(255,119,0,.68)" style={{ whiteSpace: "nowrap" }}>
          収蔵資料 / ACCESS GRANTED
        </Text>
      </Group>

      <Box
        className="gallery-hud-side-label"
        style={{
          position: "absolute",
          top: "42%",
          left: 23,
          writingMode: "vertical-rl",
          fontFamily: "DotGothic16, sans-serif",
          fontSize: 10,
          letterSpacing: ".28em",
          color: "rgba(255,119,0,.44)",
        }}
      >
        東京 · 記録 · 未来
      </Box>
      <Box
        className="gallery-hud-side-label"
        style={{
          position: "absolute",
          top: "40%",
          right: 23,
          width: 1,
          height: "20%",
          background:
            "repeating-linear-gradient(to bottom, rgba(255,119,0,.58) 0 2px, transparent 2px 8px)",
          opacity: 0.55,
        }}
      />
    </Box>
  );
}
