import { Grid, Group, Stack, Text } from "@mantine/core";

export default function Caldendar() {
    const now = new Date();

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const dayOfWeekIndex = firstDayOfMonth.getDay();
    const daysInCurrentMonth: number = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
    ).getDate();

    return (
        <Stack p="md">
            <Grid columns={7}>
                {Array(dayOfWeekIndex + daysInCurrentMonth)
                    .fill(1)
                    .map((_, index: number) => (
                        <Grid.Col span={1}>
                            {index > dayOfWeekIndex - 1 && (
                                <DateCard
                                    content={index + 1 - dayOfWeekIndex}
                                />
                            )}
                        </Grid.Col>
                    ))}
                <Grid.Col></Grid.Col>
            </Grid>
        </Stack>
    );
}

function DateCard({ content }: any) {
    return (
        <Group
            justify="center"
            style={{
                height: "150px",
                borderRadius: 5,
                borderStyle: "dashed",
                border: "1px solid rgba(0,0,0,0.1)",
            }}>
            <Text>{content}</Text>
        </Group>
    );
}
