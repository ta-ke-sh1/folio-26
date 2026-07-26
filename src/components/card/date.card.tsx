import {Group, Text} from "@mantine/core";
import "./date.card.scss"
import {useNavigate} from "react-router";

interface DateCardProps {
    content: any,
    data?: any
}

export function DateCard({content, data}: DateCardProps) {

    const navigate = useNavigate()

    function handleNavigate() {
        if (data.id) {
            navigate(`/collection/${data.id}`)
        }
    }

    return (
        <Group
            onClick={handleNavigate}
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
