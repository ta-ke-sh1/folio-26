export type CyberpunkBackdropVariant =
  | "login"
  | "admin"
  | "about"
  | "gallery"
  | "cannister"
  | "memories"
  | "collections"
  | "collectionDetails";

type CyberpunkBackdropProps = {
  variant: CyberpunkBackdropVariant;
  layer?: number;
};

export default function CyberpunkBackdrop(props: CyberpunkBackdropProps) {
  void props;
  return null;
}
