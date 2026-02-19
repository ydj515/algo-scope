import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/features/ui/utils/cn";

type Variant = "solid" | "outline" | "ghost" | "subtle";
type Size = "sm" | "md";
type Tone = "primary" | "neutral" | "success" | "warning" | "danger";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = BaseProps & {
  href: string;
  ariaLabel?: string;
};

const sizeClass: Record<Size, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-4 py-2 text-sm",
};

const solidToneClass: Record<Tone, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)]",
  neutral: "bg-[var(--color-fg)] text-[var(--color-surface)] hover:bg-[color-mix(in_srgb,var(--color-fg)_85%,black)]",
  success: "bg-[var(--color-success)] text-[var(--color-success-contrast)] hover:bg-[var(--color-success-hover)]",
  warning: "bg-[var(--color-warning)] text-[var(--color-warning-contrast)] hover:bg-[var(--color-warning-hover)]",
  danger: "bg-[var(--color-danger)] text-[var(--color-danger-contrast)] hover:bg-[var(--color-danger-hover)]",
};

const outlineToneClass: Record<Tone, string> = {
  primary: "border border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))]",
  neutral: "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)]",
  success: "border border-[var(--color-success)] bg-[var(--color-surface)] text-[var(--color-success)] hover:bg-[color-mix(in_srgb,var(--color-success)_10%,var(--color-surface))]",
  warning: "border border-[var(--color-warning)] bg-[var(--color-surface)] text-[var(--color-warning)] hover:bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--color-surface))]",
  danger: "border border-[var(--color-danger)] bg-[var(--color-surface)] text-[var(--color-danger)] hover:bg-[color-mix(in_srgb,var(--color-danger)_10%,var(--color-surface))]",
};

const subtleToneClass: Record<Tone, string> = {
  primary: "bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-surface))]",
  neutral: "bg-[var(--color-surface-muted)] text-[var(--color-fg)] hover:bg-[var(--color-surface)]",
  success: "bg-[color-mix(in_srgb,var(--color-success)_12%,var(--color-surface))] text-[var(--color-success)] hover:bg-[color-mix(in_srgb,var(--color-success)_18%,var(--color-surface))]",
  warning: "bg-[color-mix(in_srgb,var(--color-warning)_16%,var(--color-surface))] text-[var(--color-warning)] hover:bg-[color-mix(in_srgb,var(--color-warning)_24%,var(--color-surface))]",
  danger: "bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--color-surface))] text-[var(--color-danger)] hover:bg-[color-mix(in_srgb,var(--color-danger)_18%,var(--color-surface))]",
};

const ghostToneClass: Record<Tone, string> = {
  primary: "bg-transparent text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))]",
  neutral: "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)]",
  success: "bg-transparent text-[var(--color-success)] hover:bg-[color-mix(in_srgb,var(--color-success)_10%,var(--color-surface))]",
  warning: "bg-transparent text-[var(--color-warning)] hover:bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--color-surface))]",
  danger: "bg-transparent text-[var(--color-danger)] hover:bg-[color-mix(in_srgb,var(--color-danger)_10%,var(--color-surface))]",
};

function resolveVariantToneClass(variant: Variant, tone: Tone): string {
  if (variant === "solid") {
    return solidToneClass[tone];
  }
  if (variant === "outline") {
    return outlineToneClass[tone];
  }
  if (variant === "subtle") {
    return subtleToneClass[tone];
  }
  return ghostToneClass[tone];
}

function baseClass(variant: Variant, tone: Tone, size: Size, className?: string): string {
  return cn(
    "inline-flex items-center justify-center rounded-[var(--radius-md)] font-semibold",
    "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
    "motion-pulse-focus",
    sizeClass[size],
    resolveVariantToneClass(variant, tone),
    className,
  );
}

export function Button(props: ButtonProps | LinkButtonProps) {
  if ("href" in props && props.href) {
    const { href, children, className, ariaLabel, variant = "solid", tone = "primary", size = "md" } = props;
    return (
      <Link href={href} aria-label={ariaLabel} className={baseClass(variant, tone, size, className)}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;
  const {
    children,
    className,
    type,
    variant = "solid",
    tone = "primary",
    size = "md",
    ...rest
  } = buttonProps;
  return (
    <button type={type ?? "button"} className={baseClass(variant, tone, size, className)} {...rest}>
      {children}
    </button>
  );
}
