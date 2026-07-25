import {Grid, Stack} from "@mantine/core";
import {DateCard} from "./card/date.card.tsx";
import type CollectionEntity from "../../models/entity/collection.model.tsx";
import {type JSX, useEffect} from "react";

interface CalendarProps {
    data: CollectionEntity[]
}

export default function Calendar({data}: CalendarProps): JSX.Element {
    const now = new Date();

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const dayOfWeekIndex = firstDayOfMonth.getDay();
    const daysInCurrentMonth: number = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
    ).getDate();

    useEffect(() => {

    }, []);

    return (
        <Stack p="md">
            <Grid columns={7}>
                {Array(dayOfWeekIndex + daysInCurrentMonth)
                    .fill(1)
                    .map((_, index: number) => {
                        const matchingData = data[index];
                        if(matchingData) {
                            console.log(matchingData);
                        }

                        return <Grid.Col key={`calendar-card-${index}`} span={1}>
                            {index > dayOfWeekIndex - 1 && (
                                <DateCard
                                    content={index + 1 - dayOfWeekIndex}
                                />
                            )}
                        </Grid.Col>
                    })}
            </Grid>
        </Stack>
    );
}

