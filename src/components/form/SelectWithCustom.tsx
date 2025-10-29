type SelectOption = {
  value: string;
  label: string;
};

type SelectWithCustomProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  id?: string;
  customValue: string;
  onCustomValueChange: (value: string) => void;
  customPlaceholder?: string;
  otherOptionValue?: string;
  otherOptionLabel?: string;
  hint?: string;
};

export default function SelectWithCustom({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  required = false,
  error,
  touched = false,
  id,
  customValue,
  onCustomValueChange,
  customPlaceholder,
  otherOptionValue = "__OTHER__",
  otherOptionLabel = "Other",
  hint,
}: SelectWithCustomProps) {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={inputId}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {hint && (
        <p className="text-sm text-[var(--muted-foreground)] opacity-70 mb-1">{hint}</p>
      )}
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        required={required}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        <option value={otherOptionValue}>{otherOptionLabel}</option>
      </select>
      {value === otherOptionValue && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomValueChange(e.target.value)}
          placeholder={customPlaceholder}
          className="mt-2 w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
        />
      )}
      {touched && error ? (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
