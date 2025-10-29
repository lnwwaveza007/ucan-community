type InterviewMode = "online" | "onsite";

type InterviewSlot = {
  date: string;
  startTime: string;
  endTime: string;
  mode: InterviewMode;
};

type InterviewSlotInputProps = {
  slot: InterviewSlot;
  index: number;
  onUpdate: (index: number, patch: Partial<InterviewSlot>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  hasError: boolean;
  normalizeTimeTo24Hour: (value: string) => string | null;
  onBlur?: () => void;
  labels: {
    dateLabel: string;
    startLabel: string;
    endLabel: string;
    modeLabel: string;
    removeSlot: string;
    timeHint: string;
    modeHint: string;
    modeOptions: {
      online: string;
      onsite: string;
    };
  };
};

export default function InterviewSlotInput({
  slot,
  index,
  onUpdate,
  onRemove,
  canRemove,
  hasError,
  normalizeTimeTo24Hour,
  onBlur,
  labels,
}: InterviewSlotInputProps) {
  const timeInputClass =
    "w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border focus:outline-none focus:ring-2 " +
    (hasError ? "border-red-400 focus:ring-red-400" : "border-[var(--color-muted-200)] focus:ring-[var(--color-accent-orange)]");

  return (
    <div
      className={
        "rounded-[var(--radius-md)] border p-4 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] " +
        (hasError ? "border-red-300 bg-red-50/40" : "border-[var(--color-muted-200)]")
      }
      aria-invalid={hasError || undefined}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            {labels.dateLabel}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={slot.date}
            onChange={(e) => onUpdate(index, { date: e.target.value })}
            onBlur={onBlur}
            className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              {labels.startLabel}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => onUpdate(index, { startTime: e.target.value })}
              onBlur={onBlur}
              aria-invalid={hasError || undefined}
              className={timeInputClass}
              required
            />
            {slot.startTime && (
              <p className="text-sm text-[var(--muted-foreground)] mt-2 text-center opacity-70">
                {labels.timeHint} {normalizeTimeTo24Hour(slot.startTime)}.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {labels.endLabel}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => onUpdate(index, { endTime: e.target.value })}
              onBlur={onBlur}
              aria-invalid={hasError || undefined}
              className={timeInputClass}
              required
            />
            {slot.endTime && (
              <p className="text-sm text-[var(--muted-foreground)] mt-2 text-center opacity-70">
                {labels.timeHint} {normalizeTimeTo24Hour(slot.endTime)}.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">
            {labels.modeLabel}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={slot.mode}
            onChange={(e) => onUpdate(index, { mode: e.target.value as InterviewMode })}
            onBlur={onBlur}
            className="w-full md:w-48 h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
          >
            <option value="online">{labels.modeOptions.online}</option>
            <option value="onsite">{labels.modeOptions.onsite}</option>
          </select>
          <p className="text-sm text-[var(--muted-foreground)] mt-3 text-center opacity-70">{labels.modeHint}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="inline-flex items-center justify-center rounded-full px-4 h-10 text-sm font-medium border border-[var(--color-muted-300)] text-[var(--muted-foreground)] hover:bg-[var(--color-muted-200)] disabled:opacity-60"
          disabled={!canRemove}
        >
          {labels.removeSlot}
        </button>
      </div>
    </div>
  );
}
