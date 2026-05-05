import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/ui/utils/cn";

type Props = ComponentPropsWithoutRef<"section"> & {
  elevated?: boolean;
  hoverable?: boolean;
  motion?: "none" | "fade" | "slide";
};

export function Card({
  children,
  className,
  elevated = false,
  hoverable = false,
  motion = "none",
  ...rest
}: Props) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]",
        "transition-[border-color,box-shadow,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
        elevated ? "shadow-[var(--shadow-md)]" : "",
        hoverable ? "hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-primary)_32%,var(--color-border))] hover:shadow-[var(--shadow-hover)]" : "",
        motion === "fade" ? "motion-fade-in" : "",
        motion === "slide" ? "motion-slide-up" : "",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
