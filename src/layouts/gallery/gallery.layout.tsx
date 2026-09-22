import {
  ActionIcon,
  Box,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFocusCentered,
  IconRefresh,
} from "@tabler/icons-react";
import { useState } from "react";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import "./gallery.layout.scss";

type SortKey = "iso" | "aperture" | "shutter";

type Shot = {
  id: number;
  title: string;
  location: string;
  iso: number;
  aperture: number;
  shutter: number;
};

const SHOTS: Shot[] = [
  { id: 1, title: "Still Water", location: "West Lake", iso: 100, aperture: 8, shutter: 250 },
  { id: 2, title: "Passing Light", location: "Hanoi", iso: 400, aperture: 2.8, shutter: 60 },
  { id: 3, title: "Concrete Study", location: "Ba Dinh", iso: 200, aperture: 5.6, shutter: 125 },
  { id: 4, title: "After Rain", location: "Old Quarter", iso: 800, aperture: 2, shutter: 30 },
  { id: 5, title: "Last Commute", location: "Ring Road", iso: 200, aperture: 11, shutter: 500 },
  { id: 6, title: "Quiet Facade", location: "Dong Da", iso: 100, aperture: 8, shutter: 125 },
  { id: 7, title: "Open Window", location: "Tay Ho", iso: 400, aperture: 4, shutter: 60 },
  { id: 8, title: "Night Signal", location: "Long Bien", iso: 1600, aperture: 1.8, shutter: 15 },
  { id: 9, title: "Canopy", location: "Botanical Garden", iso: 400, aperture: 5.6, shutter: 250 },
];

const ISO_VALUES = [100, 200, 400, 800, 1600, 2400];
const APERTURE_VALUES = [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16];
const SHUTTER_VALUES = [15, 30, 60, 125, 250, 500, 1000];

type ExposureRange = {
  min: number;
  max: number;
};

type CameraSettings = {
  iso: ExposureRange;
  aperture: ExposureRange;
  shutter: ExposureRange;
};

type CameraDialProps = {
  label: string;
  edge: "MIN" | "MAX";
  values: number[];
  value: number;
  active: boolean;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
};

function CameraDial({
  label,
  edge,
  values,
  value,
  active,
  formatValue = String,
  onChange,
}: CameraDialProps) {
  const valueIndex = values.indexOf(value);
  const rotation = -130 + (valueIndex / (values.length - 1)) * 260;

  return (
    <label className={`camera-dial ${active ? "camera-dial--active" : ""}`}>
      <Text className="camera-dial__label">{label} / {edge}</Text>
      <Box className="camera-dial__control">
        <Box
          className="camera-dial__knob"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <span />
        </Box>
        <input
          aria-label={`${label} sort target`}
          type="range"
          min={0}
          max={values.length - 1}
          step={1}
          value={valueIndex}
          onChange={(event) => onChange(values[Number(event.target.value)])}
        />
      </Box>
      <Text className="camera-dial__value">{formatValue(value)}</Text>
    </label>
  );
}

export default function GalleryLayout() {
  const [settings, setSettings] = useState<CameraSettings>({
    iso: { min: 100, max: 1600 },
    aperture: { min: 1.8, max: 11 },
    shutter: { min: 15, max: 500 },
  });
  const [sortKey, setSortKey] = useState<SortKey>("iso");
  const [activeShotId, setActiveShotId] = useState(1);
  const [isCanisterLoaded, setIsCanisterLoaded] = useState(false);

  const activeRange = settings[sortKey];
  const rangeCenter = (activeRange.min + activeRange.max) / 2;
  const sortedShots = SHOTS
    .filter((shot) =>
      (Object.keys(settings) as SortKey[]).every((key) => {
        const range = settings[key];
        return shot[key] >= range.min && shot[key] <= range.max;
      }),
    )
    .sort((first, second) => {
      const distance = Math.abs(first[sortKey] - rangeCenter) - Math.abs(second[sortKey] - rangeCenter);
      return distance || first.id - second.id;
    });
  const activeShot = SHOTS.find((shot) => shot.id === activeShotId) ?? SHOTS[0];
  const activeIndex = sortedShots.findIndex((shot) => shot.id === activeShot.id);
  const hasMatchingShots = sortedShots.length > 0;

  const changeSetting = (key: SortKey, edge: "min" | "max", value: number) => {
    setSettings((current) => {
      const currentRange = current[key];
      const nextRange = edge === "min"
        ? { min: Math.min(value, currentRange.max), max: currentRange.max }
        : { min: currentRange.min, max: Math.max(value, currentRange.min) };
      return { ...current, [key]: nextRange };
    });
    setSortKey(key);
    const nextRange = edge === "min"
      ? { min: Math.min(value, settings[key].max), max: settings[key].max }
      : { min: settings[key].min, max: Math.max(value, settings[key].min) };
    const closest = SHOTS
      .filter((shot) =>
        (Object.keys(settings) as SortKey[]).every((filterKey) => {
          const range = filterKey === key ? nextRange : settings[filterKey];
          return shot[filterKey] >= range.min && shot[filterKey] <= range.max;
        }),
      )
      .sort((first, second) =>
        Math.abs(first[key] - (nextRange.min + nextRange.max) / 2) -
          Math.abs(second[key] - (nextRange.min + nextRange.max) / 2) ||
        first.id - second.id,
      )[0];
    if (closest) setActiveShotId(closest.id);
  };

  const stepFrame = (direction: -1 | 1) => {
    if (!sortedShots.length) return;
    const nextIndex = (activeIndex + direction + sortedShots.length) % sortedShots.length;
    setActiveShotId(sortedShots[nextIndex].id);
  };

  const resetCamera = () => {
    setSettings({
      iso: { min: 100, max: 1600 },
      aperture: { min: 1.8, max: 11 },
      shutter: { min: 15, max: 500 },
    });
    setSortKey("iso");
    setActiveShotId(1);
  };

  return (
    <LayoutWrapper>
      <main className="camera-gallery">
        <header className="camera-gallery__header">
          <div>
            <Text className="camera-gallery__eyebrow">OPTICAL ARCHIVE / ROLL 026</Text>
            <Title className="camera-gallery__title">FIELD CAMERA</Title>
          </div>
          <Group gap="xs" className="camera-gallery__status">
            <span className="camera-gallery__status-light" />
            <Text>
              {isCanisterLoaded
                ? `FRAME ${String(activeShot.id).padStart(2, "0")} / ${String(SHOTS.length).padStart(2, "0")}`
                : "ROLL NOT LOADED"}
            </Text>
          </Group>
        </header>

        <section className="camera-body" aria-label="Interactive film camera gallery">
          <div className="camera-body__topline">
            <Text>FOLIO // 35MM</Text>
            <Group gap="xs">
              <IconFocusCentered size={15} />
              <Text>MANUAL FOCUS</Text>
            </Group>
            <ActionIcon
              variant="subtle"
              color="orange"
              aria-label="Reset camera settings"
              title="Reset camera settings"
              onClick={resetCamera}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </div>

          <div className="camera-body__workspace">
            <aside className="exposure-panel" aria-label="Exposure sorting controls">
              <Text className="exposure-panel__heading">EXPOSURE / SORT</Text>
              <Stack gap="lg" align="center">
                <div className="camera-dial-pair">
                <CameraDial
                  label="ISO"
                  edge="MIN"
                  values={ISO_VALUES}
                  value={settings.iso.min}
                  active={sortKey === "iso"}
                  onChange={(value) => changeSetting("iso", "min", value)}
                />
                <CameraDial
                  label="ISO"
                  edge="MAX"
                  values={ISO_VALUES}
                  value={settings.iso.max}
                  active={sortKey === "iso"}
                  onChange={(value) => changeSetting("iso", "max", value)}
                />
                </div>
                <div className="camera-dial-pair">
                <CameraDial
                  label="APERTURE"
                  edge="MIN"
                  values={APERTURE_VALUES}
                  value={settings.aperture.min}
                  active={sortKey === "aperture"}
                  formatValue={(value) => `f/${value}`}
                  onChange={(value) => changeSetting("aperture", "min", value)}
                />
                <CameraDial
                  label="APERTURE"
                  edge="MAX"
                  values={APERTURE_VALUES}
                  value={settings.aperture.max}
                  active={sortKey === "aperture"}
                  formatValue={(value) => `f/${value}`}
                  onChange={(value) => changeSetting("aperture", "max", value)}
                />
                </div>
                <div className="camera-dial-pair">
                <CameraDial
                  label="SHUTTER"
                  edge="MIN"
                  values={SHUTTER_VALUES}
                  value={settings.shutter.min}
                  active={sortKey === "shutter"}
                  formatValue={(value) => `1/${value}`}
                  onChange={(value) => changeSetting("shutter", "min", value)}
                />
                <CameraDial
                  label="SHUTTER"
                  edge="MAX"
                  values={SHUTTER_VALUES}
                  value={settings.shutter.max}
                  active={sortKey === "shutter"}
                  formatValue={(value) => `1/${value}`}
                  onChange={(value) => changeSetting("shutter", "max", value)}
                />
                </div>
              </Stack>
              <Text className="exposure-panel__note">
                ACTIVE SORT: {sortKey.toUpperCase()} / {sortedShots.length} MATCHES
              </Text>
            </aside>

            <div className="viewfinder-shell">
              <div className="ruler ruler--top" aria-hidden="true" />
              <div className="ruler ruler--left" aria-hidden="true" />
              <figure className={`viewfinder ${isCanisterLoaded && hasMatchingShots ? "" : "viewfinder--empty"}`}>
                {isCanisterLoaded && hasMatchingShots ? (
                  <>
                    <img src={`/pictures/${activeShot.id}.jpg`} alt={`${activeShot.title}, ${activeShot.location}`} />
                    <div className="viewfinder__grid" aria-hidden="true" />
                    <div className="viewfinder__focus" aria-hidden="true"><span /></div>
                    <figcaption className="viewfinder__caption">
                      <div>
                        <Text className="viewfinder__frame">FRAME {String(activeShot.id).padStart(2, "0")}</Text>
                        <Text className="viewfinder__name">{activeShot.title}</Text>
                      </div>
                      <Text>{activeShot.location.toUpperCase()} // {activeShot.iso} / f{activeShot.aperture} / 1/{activeShot.shutter}</Text>
                    </figcaption>
                  </>
                ) : (
                  <figcaption className="viewfinder__empty-message">
                    <Text>{isCanisterLoaded ? "NO MATCHING FRAMES" : "NO FILM DETECTED"}</Text>
                    <Text>
                      {isCanisterLoaded
                        ? "WIDEN EXPOSURE RANGES TO CONTINUE"
                        : "SELECT ROLL 026 BELOW TO LOAD"}
                    </Text>
                  </figcaption>
                )}
              </figure>
              {isCanisterLoaded && hasMatchingShots && (
                <>
                  <ActionIcon
                    className="viewfinder__nav viewfinder__nav--previous"
                    variant="filled"
                    aria-label="Previous frame"
                    title="Previous frame"
                    onClick={() => stepFrame(-1)}
                  >
                    <IconChevronLeft size={20} />
                  </ActionIcon>
                  <ActionIcon
                    className="viewfinder__nav viewfinder__nav--next"
                    variant="filled"
                    aria-label="Next frame"
                    title="Next frame"
                    onClick={() => stepFrame(1)}
                  >
                    <IconChevronRight size={20} />
                  </ActionIcon>
                </>
              )}
            </div>
          </div>

          <div className="pathfinder" aria-label="Film archive pathfinder">
            <div className="pathfinder__label">
              <Text>FILM VAULT</Text>
              <Text>{isCanisterLoaded ? `${sortKey.toUpperCase()} / NEAREST FIRST` : "01 ROLL AVAILABLE"}</Text>
            </div>
            <div className="pathfinder__archive">
              {isCanisterLoaded ? (
                <>
                  <div className="pathfinder__roll-header">
                    <Text>ROLL 026 // 09 EXPOSURES</Text>
                    <button type="button" onClick={() => setIsCanisterLoaded(false)}>
                      EJECT ROLL
                    </button>
                  </div>
                  <div className="film-strip" aria-label="Frames inside roll 026">
                  {sortedShots.map((shot, index) => (
                    <button
                      type="button"
                      className={shot.id === activeShot.id ? "film-strip__frame film-strip__frame--active" : "film-strip__frame"}
                      key={shot.id}
                      onClick={() => setActiveShotId(shot.id)}
                      aria-label={`View film strip ${shot.id}: ${shot.title}`}
                      aria-pressed={shot.id === activeShot.id}
                    >
                      <span className="film-strip__index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="film-strip__image">
                        <img src={`/pictures/${shot.id}.jpg`} alt="" />
                      </span>
                      <span className="film-strip__code">26A-{String(shot.id).padStart(2, "0")}</span>
                    </button>
                  ))}
                  </div>
                </>
              ) : (
                <div className="canister-rack" aria-label="Available film canisters">
                  <button
                    type="button"
                    className="film-canister"
                    onClick={() => setIsCanisterLoaded(true)}
                    aria-label="Load canister Roll 026 containing 9 pictures"
                  >
                    <span className="film-canister__spool" aria-hidden="true">
                      <span className="film-canister__label">
                        <img src="/pictures/1.jpg" alt="" />
                        <span>026</span>
                      </span>
                    </span>
                    <span className="film-canister__name">ROLL 026 // 09 EXP</span>
                  </button>
                  <div className="canister-rack__manifest">
                    <Text>35MM COLOR NEGATIVE</Text>
                    <Text>ISO 100-1600 / 09 FRAMES</Text>
                    <Text>SELECT CANISTER TO LOAD</Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </LayoutWrapper>
  );
}
