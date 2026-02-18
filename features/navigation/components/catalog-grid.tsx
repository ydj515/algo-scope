import Link from "next/link";
import type { CatalogItem } from "@/features/navigation/types";

type Props = {
  items: CatalogItem[];
};

export function CatalogGrid({ items }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
          <div className="mt-4">
            <Link
              href={item.href}
              className={`inline-flex rounded-md px-4 py-2 text-sm font-semibold text-white ${item.accentClass}`}
            >
              {item.ctaLabel}
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
