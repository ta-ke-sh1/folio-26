import { useEffect, useMemo, useState } from "react";
import { Anchor, Box, Group, Image, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
import { useParams } from "react-router";
import LayoutWrapper from "../../components/wrappers/layout/layout.wrapper";
import Footer from "../../components/footer/footer";
import { ShuffleButton } from "../../components/animations/shuffle.button";
import { ShuffleText } from "../../components/animations/shuffle.text";
import { useAnimatedNavigate } from "../../components/transition/transition";
import { DatabaseTables } from "../../enums/database.enums";
import type CannisterEntity from "../../models/entity/cannister.model";
import CannisterService from "../../services/cannister.service";
import DatabaseService from "../../services/database.service";

interface CannisterFile {
  name: string;
}

const IMAGE_EXTENSION = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

export default function CannisterDetailsLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useAnimatedNavigate();
  const [cannister, setCannister] = useState<CannisterEntity | null>(null);
  const [files, setFiles] = useState<CannisterFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCannister() {
      setIsLoading(true);
      try {
        const service = CannisterService.getInstance();
        const records = (await service.fetchCannisters()) as CannisterEntity[];
        const found = records.find((record) => String(record.id) === id) ?? null;
        if (!isMounted) return;

        setCannister(found);
        if (found) {
          const storageItems = await service.fetchCannisterItems(found.name);
          if (isMounted && Array.isArray(storageItems)) {
            setFiles(storageItems.map((file) => ({ name: file.name })));
          }
        }
      } catch (error) {
        console.error("Unable to load cannister details:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCannister();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const publicUrl = useMemo(() => {
    if (!cannister) return () => "";
    const bucket = DatabaseService.getInstance()
      .getDatabase()
      .storage.from(DatabaseTables.Cannisters);
    return (fileName: string) =>
      bucket.getPublicUrl(`${cannister.name}/${fileName}`).data.publicUrl;
  }, [cannister]);

  const imageFiles = files.filter((file) => IMAGE_EXTENSION.test(file.name));
  const otherFiles = files.filter((file) => !IMAGE_EXTENSION.test(file.name));

  return (
    <LayoutWrapper>
      <Box
        component="main"
        px="clamp(18px, 4vw, 64px)"
        pt="clamp(78px, 8vw, 112px)"
        pb={80}
        c="var(--folio-text)"
        bg="var(--folio-page-bg)"
        style={{
          minHeight: "100dvh",
          boxSizing: "border-box",
          fontFamily: "DM Mono, monospace",
          backgroundImage:
            "linear-gradient(rgba(255,119,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,119,0,.035) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Stack gap="xl">
          <ShuffleButton
            variant="outline"
            color="primaryOrange"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/gallery")}
            w="fit-content"
            styles={{
              root: {
                borderRadius: 0,
                borderWidth: 2,
                fontFamily: "DotGothic16, sans-serif",
                boxShadow: "3px 3px 0 rgba(255,119,0,.25)",
              },
            }}
          >
            Back to index
          </ShuffleButton>

          {isLoading ? (
            <Text c="primaryOrange" role="status" style={{ fontFamily: "DotGothic16, sans-serif" }}>
              <ShuffleText text="LOADING STUDY..." />
            </Text>
          ) : !cannister ? (
            <Stack gap="sm">
              <Title order={1} size="h2" c="primaryOrange" style={{ fontFamily: "DotGothic16, sans-serif" }}>
                <ShuffleText text="STUDY NOT FOUND" />
              </Title>
              <Text c="dimmed">This cannister is not present in the archive.</Text>
            </Stack>
          ) : (
            <>
              <Group align="flex-end" justify="space-between" gap="xl" wrap="wrap" pb="xl" style={{ borderBottom: "1px solid var(--folio-border)" }}>
                <Stack gap="xs">
                  <Text c="var(--folio-accent)" size="sm" fw={600} tt="uppercase" style={{ letterSpacing: "0.12em" }}>
                    Study S-{String(cannister.id).padStart(3, "0")}
                  </Text>
                  <Title
                    order={1}
                    aria-label={cannister.name}
                    style={{
                      fontSize: "clamp(36px, 8vw, 104px)",
                      lineHeight: 1.08,
                      letterSpacing: "-0.045em",
                      fontFamily: "DotGothic16, sans-serif",
                      color: "var(--folio-accent)",
                      textShadow: "0 0 18px rgba(255,119,0,.35)",
                    }}
                  >
                    <ShuffleText text={cannister.name} />
                  </Title>
                </Stack>
                <Stack gap={4} ta="right">
                  <Text size="xs" c="primaryOrange" tt="uppercase" style={{ fontFamily: "DotGothic16, sans-serif" }}>
                    <ShuffleText text="CREATED" />
                  </Text>
                  <Text size="sm">
                    {new Date(cannister.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs" mt="md">
                {(cannister.tags ?? []).length > 0 ? cannister.tags.map((tag) => (
                  <Text key={tag} size="xs" c="primaryOrange" style={{ border: "2px solid var(--folio-border)", padding: "6px 10px", background: "var(--folio-card)", boxShadow: "2px 2px 0 rgba(255,119,0,.12)" }}>
                    {tag}
                  </Text>
                )) : <Text size="sm" c="dimmed">No fields assigned</Text>}
              </Group>

              <Box mt="xl" pt="md" style={{ borderTop: "2px solid var(--folio-border)" }}>
                <Group justify="space-between" mb="md">
                  <Text size="xs" c="primaryOrange" tt="uppercase" style={{ letterSpacing: "0.12em", fontFamily: "DotGothic16, sans-serif" }}>
                    <ShuffleText text="ARCHIVE CONTENTS" />
                  </Text>
                  <Text size="xs" c="dimmed" style={{ fontFamily: "DotGothic16, sans-serif" }}>
                    {files.length} {files.length === 1 ? "FILE" : "FILES"}
                  </Text>
                </Group>

                {imageFiles.length > 0 ? (
                  <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
                    {imageFiles.map((file) => (
                      <Box key={file.name}>
                        <Image
                          src={publicUrl(file.name)}
                          alt={`${cannister.name} — ${file.name}`}
                          fit="cover"
                          radius="xs"
                          style={{ aspectRatio: "4 / 3", background: "var(--folio-card)", border: "2px solid var(--folio-border)", imageRendering: "pixelated", boxShadow: "4px 4px 0 rgba(255,119,0,.12)" }}
                        />
                        <Text size="xs" c="dimmed" mt={6} truncate>{file.name}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : files.length === 0 ? (
                  <Text c="dimmed" py="xl">No files are stored in this study yet.</Text>
                ) : null}

                {otherFiles.length > 0 && (
                  <Stack gap={0} mt={imageFiles.length > 0 ? "xl" : 0}>
                    {otherFiles.map((file) => (
                      <Anchor
                        key={file.name}
                        href={publicUrl(file.name)}
                        target="_blank"
                        rel="noreferrer"
                        c="var(--folio-accent)"
                        py="sm"
                        style={{ borderTop: "1px solid var(--folio-card-border)", fontFamily: "DotGothic16, sans-serif" }}
                      >
                        <Group justify="space-between">
                          <Text size="sm">{file.name}</Text>
                          <IconExternalLink size={16} />
                        </Group>
                      </Anchor>
                    ))}
                  </Stack>
                )}
              </Box>
            </>
          )}
        </Stack>
      </Box>
      <Footer />
    </LayoutWrapper>
  );
}
