import { Group, Stack, Title } from "@mantine/core";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";

export default function AboutLayout() {
  return (
    <LayoutWrapper>
      <Stack>
        <Group pt={"md"} justify={"center"}>
          <Stack justify="center">
            <Title
              style={{
                maxWidth: 700,
                textAlign: "center",
                lineHeight: "86px",
                fontWeight: 1000,
                fontSize: 96,
                letterSpacing: -3,
                fontFamily: "Plus Jakarta Sans Variable",
              }}
            >
              ABOUT
              <br />
              TRUNG. HA
            </Title>
          </Stack>
        </Group>
      </Stack>
    </LayoutWrapper>
  );
}
