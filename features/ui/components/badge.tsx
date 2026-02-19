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

function toneClass(tone: BadgeTone, variant: BadgeVariant): string {
  if (variant === "solid") {
    if (tone === "success") {
      return "bg-[var(--color-success)] text-[var(--color-success-contrast)]";
    }
    if (tone === "warning") {
      return "bg-[var(--color-warning)] text-[var(--color-warning-contrast)]";
    }
    if (tone === "danger") {
      return "bg-[var(--color-danger)] text-[var(--color-danger-contrast)]";
    }
    if (tone === "neutral") {
      return "bg-[var(--color-fg)] text-[var(--color-surface)]";
    }
    return "bg-[var(--color-info)] text-[var(--color-info-contrast)]";
  }

  if (variant === "outline") {
    if (tone === "success") {
      return "border border-[var(--color-success)] text-[var(--color-success)]";
    }
    if (tone === "warning") {
      return "border border-[var(--color-warning)] text-[var(--color-warning)]";
    }
    if (tone === "danger") {
      return "border border-[var(--color-danger)] text-[var(--color-danger)]";
    }
    if (tone === "neutral") {
      return "border border-[var(--color-border)] text-[var(--color-fg)]";
    }
    return "border border-[var(--color-info)] text-[var(--color-info)]";
  }

  if (tone === "success") {
    return "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--color-surface))] text-[var(--color-success)]";
  }
  if (tone === "warning") {
    return "bg-[color-mix(in_srgb,var(--color-warning)_20%,var(--color-surface))] text-[var(--color-warning)]";
  }
  if (tone === "danger") {
    return "bg-[color-mix(in_srgb,var(--color-danger)_14%,var(--color-surface))] text-[var(--color-danger)]";
  }
  if (tone === "neutral") {
    return "bg-[var(--color-surface-muted)] text-[var(--color-fg)]";
  }
  return "bg-[color-mix(in_srgb,var(--color-info)_14%,var(--color-surface))] text-[var(--color-info)]";
}

export function Badge({
  children,
  tone = "info",
  variant = "subtle",
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        toneClass(tone, variant),
        className,
      )}
    >
      {children}
    </span>
  );
}
