type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  minHeight?: string;
  id?: string;
};

export default function TextArea({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  touched = false,
  minHeight = "min-h-28",
  id,
}: TextAreaProps) {
  const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={inputId}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full ${minHeight} px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]`}
        placeholder={placeholder}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        required={required}
      />
      {touched && error ? (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
