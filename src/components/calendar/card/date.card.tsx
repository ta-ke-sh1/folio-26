import {Group, Text} from "@mantine/core";
import "./date.card.scss"

interface DateCardProps {
    content: any
}

export function DateCard({ content }: DateCardProps) {
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
