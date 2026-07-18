import { Group, Stack, Text } from "@mantine/core";
import LayoutWrapper from "../components/wrappers/layout.wrapper";
import Caldendar from "../components/calendar/calendar";

export default function MainLayout() {
    return (
        <LayoutWrapper>
            <Stack>
                <Group>
                    <Text>Main</Text>
                </Group>

                <Caldendar />
            </Stack>
        </LayoutWrapper>
    );
}
