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

/* variant-tone 조합을 CSS 클래스로 매핑 */
const variantToneClass: Record<Variant, Record<Tone, string>> = {
  solid: {
    primary: "btn-solid-primary",
    neutral: "btn-solid-neutral",
    success: "btn-solid-success",
    warning: "btn-solid-warning",
    danger: "btn-solid-danger",
  },
  outline: {
    primary: "btn-outline-primary",
    neutral: "btn-outline-neutral",
    success: "btn-outline-success",
    warning: "btn-outline-warning",
    danger: "btn-outline-danger",
  },
  subtle: {
    primary: "btn-subtle-primary",
    neutral: "btn-subtle-neutral",
    success: "btn-subtle-success",
    warning: "btn-subtle-warning",
    danger: "btn-subtle-danger",
  },
  ghost: {
    primary: "btn-ghost-primary",
    neutral: "btn-ghost-neutral",
    success: "btn-ghost-success",
    warning: "btn-ghost-warning",
    danger: "btn-ghost-danger",
  },
};

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
};

function baseClass(variant: Variant, tone: Tone, size: Size, className?: string): string {
  return cn(
    "btn-base",
    "motion-pulse-focus",
    sizeClass[size],
    variantToneClass[variant][tone],
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
