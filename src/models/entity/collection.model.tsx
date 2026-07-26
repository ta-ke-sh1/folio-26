export default interface CollectionEntity {
    id: number;
    category_id: number;
    name: string;
    tags: string[];
    url: string;
    author: string;
    year: string;
    created_at: string;
}