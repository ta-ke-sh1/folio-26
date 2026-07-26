import {Group, Stack, Title, Text, Button} from "@mantine/core";
import LayoutWrapper from "../components/wrappers/layout/layout.wrapper.tsx";
import Calendar from "../components/calendar/calendar";
import {useEffect, useState} from "react";
import DatabaseService from "../services/database.service.ts";
import {DatabaseTables} from "../enums/database.enums.ts";
import type CollectionEntity from "../models/entity/collection.model.tsx";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";

/** Helper function to format a Date object or month/year pair into "JUL. 2026" format */
function formatMonthYear(year: number, monthIndex: number): string {
    const date = new Date(year, monthIndex, 1);
    const formatted = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(date);

    return formatted.toUpperCase().replace(/^([A-Z]{3})\b/, "$1.");
}

export default function MainLayout() {
    const now = new Date();

    // Track both month and year so calendar controls wrap correctly (e.g. Dec -> Jan)
    const [currentDate, setCurrentDate] = useState({
        month: now.getMonth(),
        year: now.getFullYear(),
    });

    const [data, setData] = useState<CollectionEntity[]>([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        (async () => await fetchCollections())();
    }, []);

    async function fetchCollections(): Promise<void> {
        try {
            const response = await DatabaseService.getInstance().getAll(
                DatabaseTables.Collections
            );

            if (response.success) {
                setData(response.data as CollectionEntity[]);
            } else {
                console.error(response.error);
            }
        } catch (e) {
            console.error(e);
        }
    }

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
            <Group
                pt={'xs'}
                pr={'xl'}
                pl={'md'}
                justify={'space-between'}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100dvw',
                }}
            >
                <Title
                    style={{
                        fontWeight: 500,
                        fontSize: 32,
                    }}
                >
                    Daily Bookmarks
                </Title>
                <Title
                    style={{
                        fontWeight: 500,
                        fontSize: 32,
                    }}
                >
                    {currentLabel}
                </Title>
            </Group>

            <Group
                pb={'md'}
                pr={'xl'}
                pl={'md'}
                justify={'space-between'}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100dvw',
                }}
            >
                <Group>
                    <Button
                        size={'lg'}
                        variant={'light'}
                        leftSection={<IconChevronLeft/>}
                        onClick={handlePrevMonth}
                    >
                        <Text
                            style={{
                                fontWeight: 500,
                                fontSize: 24,
                            }}
                        >
                            {prevLabel}
                        </Text>
                    </Button>
                </Group>
                <Group>
                    <Button
                        size={'lg'}
                        variant={'light'}
                        rightSection={<IconChevronRight/>}
                        onClick={handleNextMonth}
                    >
                        <Text
                            style={{
                                fontWeight: 500,
                                fontSize: 24,
                            }}
                        >
                            {nextLabel}
                        </Text>
                    </Button>
                </Group>
            </Group>

            <Stack>
                <Group pt={'md'} justify={'center'}>
                    <Title
                        style={{
                            maxWidth: 700,
                            textAlign: 'center',
                            lineHeight: '92px',
                            fontWeight: 800,
                            fontSize: 128,
                            letterSpacing: -2,
                        }}
                    >
                        CURATED WRITINGS & COLLECTIONS
                    </Title>
                </Group>
                <Calendar
                    data={data}
                    year={currentDate.year}
                    month={currentDate.month}
                />
            </Stack>
        </LayoutWrapper>
    );
}