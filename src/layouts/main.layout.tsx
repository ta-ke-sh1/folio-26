import {Group, Stack, Text} from "@mantine/core";
import LayoutWrapper from "../components/wrappers/layout.wrapper";
import Calendar from "../components/calendar/calendar";
import {useEffect, useState} from "react";
import DatabaseService from "../services/database.service.ts";
import {DatabaseTables} from "../enums/database.enums.ts";
import type CollectionEntity from "../models/entity/collection.model.tsx";

export default function MainLayout() {

    const [data, setData] = useState<CollectionEntity[]>([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        (async () => await fetchCollections())();
    }, []);

    async function fetchCollections(): Promise<void> {
        try {
            const response = await DatabaseService.getInstance().getAll(DatabaseTables.Collections)
            console.log(response)

            if(response.success) {
                setData(response.data as CollectionEntity[])
            } else {
                console.error(response.error)
            }

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <LayoutWrapper>
            <Stack>
                <Group>
                    <Text>Main</Text>
                </Group>

                <Calendar data={data}/>
            </Stack>
        </LayoutWrapper>
    );
}
