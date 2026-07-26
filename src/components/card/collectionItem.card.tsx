import {Group, Text} from "@mantine/core";
import "./date.card.scss"

interface CollectionItemCardProps {
    content: any,
    data?: any
}

export function CollectionItemCard({ content, data }: CollectionItemCardProps) {

    return (
        <Group
            className={'date-card'}
            justify="center"
            style={{
                height: "15dvh",
                borderRadius: 5,
                border: "1px dashed rgba(0,0,0,0.1)",
            }}>
            <Text>{data.data.length > 0 ? data.name : content}</Text>
        </Group>
    );
}
