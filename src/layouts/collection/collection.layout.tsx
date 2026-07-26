import {useEffect, useState} from "react";
import {Grid, Stack} from "@mantine/core";
import {CollectionItemCard} from "../../components/card/collectionItem.card.tsx";
import CollectionService from "../../services/collection.service.ts";
import {useParams} from "react-router";

export default function CollectionLayout() {

    const {id} = useParams()

    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            const response = await CollectionService.getInstance().getCollectionItemsById(Number(id))
            if (response.success) {
                setData(response.data)
            } else {
                console.error(response.error)
            }
        }

        (async () => await fetchData())()
    }, [id]);

    return (
        <Stack p="md">
            <Grid columns={7}>
                {
                    data.map((data, index: number) => {
                        return <Grid.Col key={`calendar-card-${index}`} span={1}>
                            <CollectionItemCard content={index} data={data}/>
                        </Grid.Col>
                    })}
            </Grid>
        </Stack>
    )
}