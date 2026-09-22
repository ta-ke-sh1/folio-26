import {
  Group,
  Stack,
  Title,
  Text,
  Button,
  SegmentedControl,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Calendar from "./calendar/calendar";
import Footer from "../../components/footer/footer";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import CollectionService from "../../services/collection.service";
import ListMap from "./list/list.tsx";
import type { CollectionEntity } from "../../models/entity/collection.model.tsx";
import "./collections.layout.scss";

/** Helper function to format a Date object or month/year pair into "JUL. 2026" format */
function formatMonthYear(year: number, monthIndex: number): string {
  const date = new Date(year, monthIndex, 1);
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);

  return formatted.toUpperCase().replace(/^([A-Z]{3})\b/, "$1.");
}

enum ViewMode {
  LIST = "List",
  CALENDAR = "Calendar",
}

export default function CollectionsLayout() {
  const now = new Date();

  // Track both month and year so calendar controls wrap correctly (e.g. Dec -> Jan)
  const [currentDate, setCurrentDate] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const [data, setData] = useState<CollectionEntity[]>([]);
  const [mode, setMode] = useState<ViewMode>(ViewMode.CALENDAR);

  // Button Hover States
  const [isPrevHovered, setIsPrevHovered] = useState(false);
  const [isNextHovered, setIsNextHovered] = useState(false);

  useEffect(() => {
    async function fetchCollections(): Promise<void> {
      try {
        const response =
          await CollectionService.getInstance().getCollectionsByMonthAndYear(
            currentDate.year,
            currentDate.month,
          );

        if (response.error) {
          console.error(response.error);
        } else if (response.data) {
          setData(response.data as CollectionEntity[]);
        }
      } catch (e) {
        console.error(e);
      }
    }

    (async () => await fetchCollections())();
  }, [currentDate.month, currentDate.year]);

  // Handlers to increment/decrement the active month
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.year, prev.month - 1, 1);
      return {
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
      };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.year, prev.month + 1, 1);
      return {
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
      };
    });
  };

  // Derive previous and next month strings dynamically
  const currentLabel = formatMonthYear(currentDate.year, currentDate.month);
  const prevLabel = formatMonthYear(currentDate.year, currentDate.month - 1);
  const nextLabel = formatMonthYear(currentDate.year, currentDate.month + 1);

  return (
    <LayoutWrapper>
      <Stack mb={100}>
        <Group pt={"60"} justify={"center"}>
          <Stack justify="center">
            <Title
              style={{
                fontSize: "clamp(36px, 7vw, 84px)",
                fontWeight: 900,
                color: "#FF7700",
                fontFamily: "monospace",
                letterSpacing: "-2px",
                lineHeight: 1,
                textShadow: "0 0 12px rgba(255, 119, 0, 0.6)",
                textAlign: "center",
              }}
            >
              {currentLabel}
              <br /> COLLECTIONS
            </Title>
          </Stack>
        </Group>

        {/* Terminal View Mode Switcher */}
        <Group
          className="collections-toolbar"
          pr="md"
          pl="md"
          justify="space-between"
        >
          <Group className="collections-toolbar__previous">
            <Button
              className="collections-toolbar__button"
              size="md"
              leftSection={<IconChevronLeft size={18} color="#FF7700" />}
              onClick={handlePrevMonth}
              onMouseEnter={() => setIsPrevHovered(true)}
              onMouseLeave={() => setIsPrevHovered(false)}
              style={{
                backgroundColor: isPrevHovered
                  ? "rgba(255, 119, 0, 0.15)"
                  : "var(--folio-card)",
                border: isPrevHovered
                  ? "1px solid #FF9933"
                  : "1px solid #FF7700",
                borderRadius: "6px",
                boxShadow: isPrevHovered
                  ? "0 0 18px rgba(255, 119, 0, 0.5)"
                  : "0 0 10px rgba(255, 119, 0, 0.15)",
                transform: isPrevHovered ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                padding: "8px 18px",
                cursor: "pointer",
              }}
            >
              <Text
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#FF7700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                [ {prevLabel} ]
              </Text>
            </Button>
          </Group>

          <SegmentedControl
            className="collections-toolbar__modes"
            transitionDuration={200}
            data={Object.values(ViewMode)}
            value={mode}
            onChange={(val) => setMode(val as ViewMode)}
            styles={{
              root: {
                backgroundColor: "var(--folio-card)",
                border: "1px solid var(--folio-card-border)",
                borderRadius: "6px",
                padding: "3px",
              },
              indicator: {
                backgroundColor: "#FF7700",
                borderRadius: "4px",
                boxShadow: "0 0 12px rgba(255, 119, 0, 0.5)",
              },
              label: {
                fontFamily: "monospace",
                color: "#737373",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              },
            }}
          />

          <Group className="collections-toolbar__next">
            <Button
              className="collections-toolbar__button"
              size="md"
              rightSection={<IconChevronRight size={18} color="#FF7700" />}
              onClick={handleNextMonth}
              onMouseEnter={() => setIsNextHovered(true)}
              onMouseLeave={() => setIsNextHovered(false)}
              style={{
                backgroundColor: isNextHovered
                  ? "rgba(255, 119, 0, 0.15)"
                  : "var(--folio-card)",
                border: isNextHovered
                  ? "1px solid #FF9933"
                  : "1px solid #FF7700",
                borderRadius: "6px",
                boxShadow: isNextHovered
                  ? "0 0 18px rgba(255, 119, 0, 0.5)"
                  : "0 0 10px rgba(255, 119, 0, 0.15)",
                transform: isNextHovered ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                padding: "8px 18px",
                cursor: "pointer",
              }}
            >
              <Text
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#FF7700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                [ {nextLabel} ]
              </Text>
            </Button>
          </Group>
        </Group>
        {mode === ViewMode.CALENDAR ? (
          <Calendar
            data={data}
            year={currentDate.year}
            month={currentDate.month}
          />
        ) : (
          <ListMap data={data} />
        )}
      </Stack>
      <Footer />
    </LayoutWrapper>
  );
}
