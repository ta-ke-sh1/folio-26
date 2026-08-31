import { Group, Stack, Title } from "@mantine/core";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";

export default function ContactsLayout() {
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
              CONTACT ME
            </Title>
          </Stack>
        </Group>
      </Stack>
    </LayoutWrapper>
  );
}
