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
    <div className={cn("field-wrap", className)}>
      {label ? <span className="field-label">{label}</span> : null}
      {children}
      {helperText ? <span className="field-helper">{helperText}</span> : null}
    </div>
  );
}

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
      <input className={cn("field-control", className)} {...props} />
    </FieldWrap>
  );
}

type NumberFieldProps = Omit<InputFieldProps, "type">;

export function NumberField(props: NumberFieldProps) {
  return <InputField type="number" {...props} />;
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
      <select className={cn("field-control", className)} {...props}>
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
      <textarea className={cn("field-control", className)} {...props} />
    </FieldWrap>
  );
}

type RangeFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type"> & {
  label?: string;
  helperText?: string;
  wrapperClassName?: string;
};

export function RangeField({
  label,
  helperText,
  wrapperClassName,
  className,
  ...props
}: RangeFieldProps) {
  return (
    <FieldWrap label={label} helperText={helperText} className={wrapperClassName}>
      <input
        type="range"
        className={cn("w-full accent-[var(--color-primary)]", className)}
        {...props}
      />
    </FieldWrap>
  );
}

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type"> & {
  label?: string;
  helperText?: string;
  wrapperClassName?: string;
};

export function CheckboxField({
  label,
  helperText,
  wrapperClassName,
  className,
  ...props
}: CheckboxFieldProps) {
  return (
    <FieldWrap helperText={helperText} className={wrapperClassName}>
      <label className="inline-flex items-center gap-2 ty-label1">
        <input
          type="checkbox"
          className={cn("h-4 w-4 rounded accent-[var(--color-primary)]", className)}
          {...props}
        />
        <span>{label}</span>
      </label>
    </FieldWrap>
  );
}
