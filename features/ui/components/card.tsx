import type { ReactNode } from "react";
import { cn } from "@/features/ui/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  motion?: "none" | "fade" | "slide";
};

export function Card({ children, className, elevated = false, motion = "none" }: Props) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]",
        elevated ? "shadow-[var(--shadow-sm)]" : "",
        motion === "fade" ? "motion-fade-in" : "",
        motion === "slide" ? "motion-slide-up" : "",
        className,
      )}
    >
      {children}
    </section>
  );
}
