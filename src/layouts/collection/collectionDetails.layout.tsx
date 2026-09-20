import { useEffect, useState } from "react";
import { Grid, Group, Stack, Title } from "@mantine/core";
import CollectionService from "../../services/collection.service.ts";
import { useParams } from "react-router";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper.tsx";
import { CollectionItemCard } from "../../components/card/collectionItem.card.tsx";

export default function CollectionDetailsLayout() {
  const { id } = useParams();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response =
        await CollectionService.getInstance().getCollectionItemsById(
          Number(id),
        );
      console.log(response);
      if (response.success) {
        setData(response.data);
      } else {
        console.error(response.error);
      }
    }

    (async () => await fetchData())();
  }, [id]);

  return (
    <LayoutWrapper>
      <Stack mb={100} pl={"md"} pr={"md"}>
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
              COLLECTIONS {id}
            </Title>
          </Stack>
        </Group>
        <Grid mt={30}>
          {data.map((d: any, index: number) => (
            <Grid.Col
              span={{
                base: 6,
                xs: 6,
                sm: 4,
                md: 3,
                lg: 3,
              }}
              key={`card-item-${index}`}
            >
              <CollectionItemCard data={d} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </LayoutWrapper>
  );
}
