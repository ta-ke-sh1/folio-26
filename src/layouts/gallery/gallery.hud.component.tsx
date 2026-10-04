import { Box, Group, Text } from "@mantine/core";
import BilingualShuffle from "../../components/animations/bilingual.shuffle";

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

      <Box
        style={{
          ...cornerStyle,
          top: 17,
          left: 17,
          borderTop: "1px solid",
          borderLeft: "1px solid",
        }}
      />
      <Box
        style={{
          ...cornerStyle,
          top: 17,
          right: 17,
          borderTop: "1px solid",
          borderRight: "1px solid",
        }}
      />
      <Box
        style={{
          ...cornerStyle,
          bottom: 17,
          left: 17,
          borderBottom: "1px solid",
          borderLeft: "1px solid",
        }}
      />
      <Box
        style={{
          ...cornerStyle,
          bottom: 17,
          right: 17,
          borderBottom: "1px solid",
          borderRight: "1px solid",
        }}
      />

      <Text
        className="gallery-hud-title"
        style={{
          position: "absolute",
          top: 29,
          left: 34,
          color: "rgba(255, 207, 171, .9)",
          fontFamily: "DotGothic16, sans-serif",
          fontSize: "clamp(14px, 1.5vw, 20px)",
          letterSpacing: ".2em",
          textShadow: "0 0 12px rgba(255, 119, 0, .35)",
        }}
      >
        <BilingualShuffle english="GALLERY" japanese="ギャラリー" />
      </Text>

      <Group
        gap={8}
        className="gallery-hud-top-right"
        style={{
          position: "absolute",
          top: 31,
          right: 34,
          alignItems: "center",
        }}
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
        <Text
          className="gallery-hud-micro"
          size="8px"
          c="rgba(255,119,0,.68)"
          style={{ whiteSpace: "nowrap" }}
        >
          収蔵資料 / ACCESS GRANTED
        </Text>
        <Text
          className="gallery-hud-title"
          size="xs"
          c="rgba(255, 207, 171, .9)"
          style={{
            fontFamily: "DotGothic16, sans-serif",
            letterSpacing: ".14em",
            textAlign: "right",
            marginLeft: 15,
            textShadow: "0 0 12px rgba(255, 119, 0, .35)",
          }}
        >
          <BilingualShuffle
            english="VISUAL ARCHIVE"
            japanese="ビジュアル・アーカイブ"
          />
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
