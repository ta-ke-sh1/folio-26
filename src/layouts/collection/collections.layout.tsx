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
import Calendar from "../../components/calendar/calendar";
import Footer from "../../components/footer/footer";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import CollectionService from "../../services/collection.service";
import type CollectionEntity from "../../models/entity/collection.model.tsx";

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

  useEffect(() => {
    async function fetchCollections(): Promise<void> {
      try {
        const response =
          await CollectionService.getInstance().getCollectionsByMonthAndYear(
            currentDate.year,
            currentDate.month,
          );

        // Supabase queries return { data, error } directly instead of response.success
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
      <Stack>
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
        <Group justify={"center"}>
          <SegmentedControl
            transitionDuration={300}
            transitionTimingFunction="linear"
            color="yellow"
            data={Object.values(ViewMode)}
            value={mode}
            onChange={setMode}
          />
        </Group>
        {mode === ViewMode.CALENDAR ? (
          <>
            <Group pr={"md"} pl={"md"} justify={"space-between"}>
              <Group>
                <Button
                  color="orange"
                  size={"lg"}
                  variant={"light"}
                  leftSection={<IconChevronLeft />}
                  onClick={handlePrevMonth}
                >
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: 24,
                      letterSpacing: -1,
                    }}
                  >
                    {prevLabel}
                  </Text>
                </Button>
              </Group>
              <Group>
                <Button
                  color="orange"
                  size={"lg"}
                  variant={"light"}
                  rightSection={<IconChevronRight />}
                  onClick={handleNextMonth}
                >
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: 24,
                      letterSpacing: -1,
                    }}
                  >
                    {nextLabel}
                  </Text>
                </Button>
              </Group>
            </Group>

            <Calendar
              data={data}
              year={currentDate.year}
              month={currentDate.month}
            />
          </>
        ) : (
          <></>
        )}
      </Stack>
      <Footer />
    </LayoutWrapper>
  );
}
