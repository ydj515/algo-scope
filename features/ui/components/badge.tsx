import type { ReactNode } from "react";
import { cn } from "@/features/ui/utils/cn";

type BadgeTone = "info" | "success" | "warning" | "danger" | "neutral";
type BadgeVariant = "subtle" | "solid" | "outline";

type Props = {
  children: ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  className?: string;
};

/* variant-tone 조합을 CSS 클래스로 매핑 */
const variantToneClass: Record<BadgeVariant, Record<BadgeTone, string>> = {
  subtle: {
    info: "badge-subtle-info",
    success: "badge-subtle-success",
    warning: "badge-subtle-warning",
    danger: "badge-subtle-danger",
    neutral: "badge-subtle-neutral",
  },
  solid: {
    info: "badge-solid-info",
    success: "badge-solid-success",
    warning: "badge-solid-warning",
    danger: "badge-solid-danger",
    neutral: "badge-solid-neutral",
  },
  outline: {
    info: "badge-outline-info",
    success: "badge-outline-success",
    warning: "badge-outline-warning",
    danger: "badge-outline-danger",
    neutral: "badge-outline-neutral",
  },
};

export function Badge({
  children,
  tone = "info",
  variant = "subtle",
  className,
}: Props) {
  return (
    <span
      className={cn(
        "badge-base",
        variantToneClass[variant][tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
