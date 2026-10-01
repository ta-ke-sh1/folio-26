import { DatabaseTables } from "../enums/database.enums";
import DatabaseService from "./database.service";

export interface CannisterImageFile {
  name: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
}

async function convertImageToJpeg(file: File, outputName: string): Promise<File> {
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
      (result) => (result ? resolve(result) : reject(new Error("Could not encode image as JPEG."))),
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
      console.error(
        `Failed to fetch storage items for canister ${name}:`,
        storageError.message,
      );
      return [];
    }
    return storageFiles;
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
    const bucket = this.dbService.getDatabase().storage.from(DatabaseTables.Cannisters);
    let nextIndex = startIndex;

    for (const file of files) {
      const jpeg = await convertImageToJpeg(file, `${nextIndex}.jpg`);
      const { error } = await bucket.upload(`${name}/${jpeg.name}`, jpeg, {
        contentType: "image/jpeg",
        upsert: false,
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
    if (error) throw new Error(`Failed to delete ${fileName}: ${error.message}`);
  }
}
