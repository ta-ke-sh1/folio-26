export interface PostEntity {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogFormValues = Pick<
  PostEntity,
  "title" | "slug" | "excerpt" | "content" | "cover_image" | "published"
>;
