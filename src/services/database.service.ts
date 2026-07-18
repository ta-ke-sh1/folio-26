import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../database/database.connection";

export default class DatabaseService {
    private static instance: DatabaseService;

    private database: SupabaseClient;

    private constructor() {
        this.database = supabase;
    }

    public static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }

        return DatabaseService.instance;
    }

    public getDatabase() {
        return this.database;
    }
}
