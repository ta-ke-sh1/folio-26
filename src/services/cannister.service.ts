import { DatabaseTables } from "../enums/database.enums";
import { parse } from "exifr";
import DatabaseService from "./database.service";

interface ExposureMetadata {
  iso?: number;
  exposureTime?: number;
  aperture?: number;
}

async function readExposureMetadata(file: File): Promise<ExposureMetadata> {
  try {
    const tags = await parse(file, {
      pick: ["ISO", "PhotographicSensitivity", "ExposureTime", "ShutterSpeedValue", "FNumber"],
    });
    const shutterSpeed = Number(tags?.ExposureTime);
    const shutterSpeedValue = Number(tags?.ShutterSpeedValue);
    const exposureTime = Number.isFinite(shutterSpeed) && shutterSpeed > 0
      ? shutterSpeed
      : Number.isFinite(shutterSpeedValue)
        ? 2 ** -shutterSpeedValue
        : undefined;
    const iso = Number(tags?.ISO ?? tags?.PhotographicSensitivity);
    const aperture = Number(tags?.FNumber);

    return {
      ...(Number.isFinite(iso) && iso > 0 ? { iso } : {}),
      ...(exposureTime && Number.isFinite(exposureTime) && exposureTime > 0
        ? { exposureTime }
        : {}),
      ...(Number.isFinite(aperture) && aperture > 0 ? { aperture } : {}),
    };
  } catch {
    // EXIF is optional; uploading should still work for images without camera metadata.
    return {};
  }
}

export interface CannisterImageFile {
  name: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
}

async function convertImageToJpeg(
  file: File,
  outputName: string,
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Could not create an image canvas.");
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Could not encode image as JPEG.")),
      "image/jpeg",
      0.92,
    );
  });

  return new File([blob], outputName, { type: "image/jpeg" });
}

export default class CannisterService {
  private static instance: CannisterService;
  private dbService: DatabaseService;

  private constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  public static getInstance(): CannisterService {
    if (!CannisterService.instance) {
      CannisterService.instance = new CannisterService();
    }
    return CannisterService.instance;
  }

  public async fetchCannisters() {
    const response = await this.dbService.getAll(DatabaseTables.Cannisters);
    console.log(response);

    if (response.error) {
      console.error("Error fetching cannisters:", response.error.message);
      return [];
    }

    return response.data;
  }

  public async fetchCannisterItems(name: string) {
    const { data: storageFiles, error: storageError } = await this.dbService
      .getDatabase()
      .storage.from(DatabaseTables.Cannisters)
      .list(name);

    if (storageError) {
      throw new Error(
        `Failed to list cannister folder "${name}" in bucket "${DatabaseTables.Cannisters}": ${storageError.message}`,
      );
    }
    return storageFiles ?? [];
  }

  public async createCannister(payload: {
    name: string;
    tags: string[];
    category_id: number;
  }) {
    return this.dbService
      .getDatabase()
      .from(DatabaseTables.Cannisters)
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select()
      .single();
  }

  public async updateCannister(
    id: number,
    payload: { tags: string[]; category_id: number },
  ) {
    return this.dbService
      .getDatabase()
      .from(DatabaseTables.Cannisters)
      .update(payload)
      .eq("id", id);
  }

  public async uploadImages(name: string, files: File[], startIndex: number) {
    const bucket = this.dbService
      .getDatabase()
      .storage.from(DatabaseTables.Cannisters);
    let nextIndex = startIndex;

    for (const file of files) {
      const exposureMetadata = await readExposureMetadata(file);
      const jpeg = await convertImageToJpeg(file, `${nextIndex}.jpg`);
      const { error } = await bucket.upload(`${name}/${jpeg.name}`, jpeg, {
        contentType: "image/jpeg",
        upsert: false,
        metadata: exposureMetadata,
      });
      if (error) {
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }
      nextIndex += 1;
    }

    return nextIndex;
  }

  public async deleteImage(name: string, fileName: string) {
    const { error } = await this.dbService
      .getDatabase()
      .storage.from(DatabaseTables.Cannisters)
      .remove([`${name}/${fileName}`]);
    if (error)
      throw new Error(`Failed to delete ${fileName}: ${error.message}`);
  }

  public async deleteCannister(id: number, name: string) {
    const bucket = this.dbService
      .getDatabase()
      .storage.from(DatabaseTables.Cannisters);
    const objectPaths: string[] = [];

    const collectFolderObjects = async (folderPath: string): Promise<void> => {
      const pageSize = 1000;
      let offset = 0;

      while (true) {
        const { data, error } = await bucket.list(folderPath, {
          limit: pageSize,
          offset,
        });
        if (error) {
          throw new Error(
            `Failed to list cannister folder "${folderPath}": ${error.message}`,
          );
        }

        const entries = data ?? [];
        for (const entry of entries) {
          const entryPath = `${folderPath}/${entry.name}`;
          if (entry.id == null && entry.metadata == null) {
            await collectFolderObjects(entryPath);
          } else {
            objectPaths.push(entryPath);
          }
        }

        if (entries.length < pageSize) break;
        offset += pageSize;
      }
    };

    await collectFolderObjects(name);

    for (let offset = 0; offset < objectPaths.length; offset += 1000) {
      const { error } = await bucket.remove(objectPaths.slice(offset, offset + 1000));
      if (error) {
        throw new Error(
          `Failed to remove cannister storage objects: ${error.message}`,
        );
      }
    }

    const { error } = await this.dbService.deleteById(
      DatabaseTables.Cannisters,
      id,
    );
    if (error) {
      throw new Error(
        `Storage folder was deleted, but the cannister record could not be deleted: ${error.message}`,
      );
    }

    return objectPaths.length;
  }
}
