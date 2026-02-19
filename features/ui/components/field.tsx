import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/features/ui/utils/cn";

type FieldWrapProps = {
  label?: string;
  helperText?: string;
  className?: string;
  children: ReactNode;
};

function FieldWrap({ label, helperText, className, children }: FieldWrapProps) {
  return (
    <label className={cn("flex flex-col gap-1 text-sm", className)}>
      {label ? <span className="font-medium text-[var(--color-fg)]">{label}</span> : null}
      {children}
      {helperText ? <span className="text-xs text-[var(--color-fg-muted)]">{helperText}</span> : null}
    </label>
  );
}

const CONTROL_CLASS =
  "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm";

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children"> & {
  label?: string;
  helperText?: string;
  wrapperClassName?: string;
};

export function InputField({
  label,
  helperText,
  wrapperClassName,
  className,
  ...props
}: InputFieldProps) {
  return (
    <FieldWrap label={label} helperText={helperText} className={wrapperClassName}>
      <input className={cn(CONTROL_CLASS, className)} {...props} />
    </FieldWrap>
  );
}

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  helperText?: string;
  options: SelectOption[];
  wrapperClassName?: string;
};

export function SelectField({
  label,
  helperText,
  options,
  wrapperClassName,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <FieldWrap label={label} helperText={helperText} className={wrapperClassName}>
      <select className={cn(CONTROL_CLASS, className)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
}

type TextareaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> & {
  label?: string;
  helperText?: string;
  wrapperClassName?: string;
};

export function TextareaField({
  label,
  helperText,
  wrapperClassName,
  className,
  ...props
}: TextareaFieldProps) {
  return (
    <FieldWrap label={label} helperText={helperText} className={wrapperClassName}>
      <textarea className={cn(CONTROL_CLASS, className)} {...props} />
    </FieldWrap>
  );
}
