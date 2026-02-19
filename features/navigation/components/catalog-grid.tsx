import type { CatalogItem } from "@/features/navigation/types";
import { Button } from "@/features/ui/components/button";
import { Card } from "@/features/ui/components/card";

type Props = {
  items: CatalogItem[];
};

export function CatalogGrid({ items }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="p-5 motion-fade-in">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{item.description}</p>
          <div className="mt-4">
            <Button
              href={item.href}
              variant="solid"
              tone={item.tone ?? "primary"}
            >
              {item.ctaLabel}
            </Button>
          </div>
        </Card>
      ))}
    </section>
  );
}
