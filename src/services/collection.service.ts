import DatabaseService from "../services/database.service";
import { DatabaseTables } from "../enums/database.enums";
import type CollectionEntity from "../models/entity/collection.model";

// Omit auto-generated fields for creation payloads
export type CreateCollectionDto = Omit<CollectionEntity, "id" | "created_at">;

// Allow partial updates for existing records
export type UpdateCollectionDto = Partial<CreateCollectionDto>;

export default class CollectionService {
    private static instance: CollectionService;
    private dbService: DatabaseService;
    private tableName = DatabaseTables.Collections;

    private constructor() {
        this.dbService = DatabaseService.getInstance();
    }

    public static getInstance(): CollectionService {
        if (!CollectionService.instance) {
            CollectionService.instance = new CollectionService();
        }
        return CollectionService.instance;
    }

    /**
     * Fetch all collections.
     */
    public async getAllCollections() {
        return this.dbService.getAll(this.tableName);
    }

    /**
     * Fetch a single collection by its ID.
     */
    public async getCollectionById(id: number) {
        return this.dbService.getById(this.tableName, id.toString());
    }

    /**
     * Add a new collection.
     */
    public async createCollection(data: CreateCollectionDto) {
        return this.dbService.create(this.tableName, data);
    }

    /**
     * Edit an existing collection by ID.
     */
    public async updateCollection(id: number, data: UpdateCollectionDto) {
        return this.dbService.updateById(this.tableName, id, data);
    }

    /**
     * Delete a collection by ID.
     */
    public async deleteCollection(id: number) {
        return this.dbService.deleteById(this.tableName, id);
    }

    /**
     * Fetch collections created within a specific month and year.
     *
     * @param year - Full year (e.g. 2026)
     * @param monthIndex - 0-indexed month (0 = January, 11 = December)
     */
    public async getCollectionsByMonthAndYear(year: number, monthIndex: number) {
        // Start of the target month: YYYY-MM-01T00:00:00.000Z
        const startDate = new Date(Date.UTC(year, monthIndex, 1)).toISOString();

        // Start of the next month (exclusive bound)
        const endDate = new Date(Date.UTC(year, monthIndex + 1, 1)).toISOString();

        return this.dbService
            .getDatabase()
            .from(this.tableName)
            .select()
            .gte("created_at", startDate)
            .lt("created_at", endDate);
    }
}