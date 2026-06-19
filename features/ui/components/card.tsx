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
        "card-base",
        elevated ? "card-elevated" : "",
        hoverable ? "card-hoverable" : "",
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
