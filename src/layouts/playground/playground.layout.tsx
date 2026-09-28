import { Container, Stack, Text, Title } from "@mantine/core";
import JapaneseSignal from "../../components/background/japanese.signal";

export default function PlaygroundLayout() {
  return (
    <Container size="lg" py={100}>
      <Stack gap="md">
        <Text
          size="xs"
          c="orange"
          ff="monospace"
          style={{ letterSpacing: 1 }}
        >
          EXPERIMENTAL // PLAYGROUND
        </Text>
        <Title order={1} c="var(--folio-text)">
          Open systems. Unfinished ideas.
        </Title>
        <JapaneseSignal
          channel="playground"
          className="section-japanese-signal--end"
        />
      </Stack>
    </Container>
  );
}
