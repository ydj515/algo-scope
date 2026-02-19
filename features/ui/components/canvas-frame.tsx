import type { ReactNode } from "react";
import { cn } from "@/features/ui/utils/cn";

type BaseProps = {
  header?: ReactNode;
  children?: ReactNode;
  legend?: ReactNode;
  message?: ReactNode;
  className?: string;
};

type EmptyProps = BaseProps & {
  hasData: false;
  emptyText: string;
};

type FilledProps = BaseProps & {
  hasData: true;
  emptyText?: string;
};

type Props = EmptyProps | FilledProps;

export function CanvasFrame({
  hasData,
  emptyText,
  header,
  children,
  legend,
  message,
  className,
}: Props) {
  if (!hasData) {
    return (
      <div
        className={cn(
          "flex h-[380px] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-fg-muted)]",
          className,
        )}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
        className,
      )}
    >
      {header ? <div className="mb-3">{header}</div> : null}
      {children}
      {legend ? <div className="mt-3">{legend}</div> : null}
      {message ? <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{message}</p> : null}
    </section>
  );
}
