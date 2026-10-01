// --- ENTITY INTERFACES ---
export interface CategoryEntity {
  id: number;
  name: string;
  created_at: Date | string;
}

export interface TagEntity {
  id: number;
  name: string;
  created_at: Date | string;
}

export type ActiveTab =
  | "items"
  | "collections"
  | "categories"
  | "tags"
  | "blogs"
  | "cannisters";

export const TABLE_MAP: Record<ActiveTab, string> = {
  items: "collection_items",
  collections: "collections",
  categories: "categories",
  tags: "tags",
  blogs: "blogs",
  cannisters: "cannisters",
};

export const TAB_TITLES: Record<ActiveTab, string> = {
  items: "Collection Items",
  collections: "Collections",
  categories: "Categories",
  tags: "Tags",
  blogs: "Blog Entries",
  cannisters: "Cannisters",
};
