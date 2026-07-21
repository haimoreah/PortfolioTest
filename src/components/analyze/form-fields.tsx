import type { ReactNode, SelectHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBaseClass =
  "h-[var(--h-input,3.25rem)] w-full rounded-[var(--radius-input)] border bg-muted px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 disabled:opacity-60";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  missing?: boolean;
  error?: string;
  children: ReactNode;
}

function FieldWrapper({ label, htmlFor, missing, error, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {label}
        {missing ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-bold text-warning">
            <AlertCircle className="h-3 w-3" aria-hidden />
            لم يُقرأ من الصورة
          </span>
        ) : null}
      </label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  missing?: boolean;
  error?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: string;
}

export function NumberField({ id, label, value, onChange, missing, error, suffix, min, max, step = "any" }: NumberFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} missing={missing} error={error}>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value ?? ""}
          onChange={(event) => {
            const raw = event.target.value;
            onChange(raw === "" ? undefined : Number(raw));
          }}
          className={cn(inputBaseClass, error ? "border-destructive" : "border-border", suffix && "pl-12")}
        />
        {suffix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </FieldWrapper>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  missing?: boolean;
  error?: string;
  placeholder?: string;
}

export function TextField({ id, label, value, onChange, missing, error, placeholder }: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} missing={missing} error={error}>
      <input
        id={id}
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputBaseClass, error ? "border-destructive" : "border-border")}
      />
    </FieldWrapper>
  );
}

interface SelectFieldProps<T extends string> extends Pick<SelectHTMLAttributes<HTMLSelectElement>, "disabled"> {
  id: string;
  label: string;
  value: T | undefined;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  missing?: boolean;
  error?: string;
}

export function SelectField<T extends string>({ id, label, value, onChange, options, missing, error, disabled }: SelectFieldProps<T>) {
  return (
    <FieldWrapper label={label} htmlFor={id} missing={missing} error={error}>
      <select
        id={id}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(inputBaseClass, error ? "border-destructive" : "border-border")}
      >
        <option value="" disabled>
          اختر...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
