export type CatalogItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  tone?: "primary" | "neutral" | "success" | "warning" | "danger";
  group?: string;
};
