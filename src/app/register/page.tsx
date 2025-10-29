"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { AiOutlineTeam } from "react-icons/ai";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { TextInput, TextArea, Select, SelectWithCustom, RoleCard, InterviewSlotInput } from "@/components/form";

type RoleKey =
  | "outreach_sponsor"
  | "knowledge_knowledge"
  | "knowledge_learning_design"
  | "marketing_video_editor"
  | "marketing_graphic_designer"
  | "marketing_photographer"
  | "marketing_content_writer"
  | "operation_sustainability"
  | "operation_finance"
  | "operation_hr"
  | "operation_document"
  | "event_organizer";

const ROLE_LABELS: Record<RoleKey, string> = {
  outreach_sponsor: "Sponsor",
  knowledge_knowledge: "Knowledge",
  knowledge_learning_design: "Learning Design",
  marketing_video_editor: "Video Editor",
  marketing_graphic_designer: "Graphic Designer",
  marketing_photographer: "Photographer",
  marketing_content_writer: "Content Writer",
  operation_sustainability: "Sustainability",
  operation_finance: "Finance",
  operation_hr: "Human Resource (HR)",
  operation_document: "Document",
  event_organizer: "Event Organizer",
};

// Faculties and majors (departments/programs) for KMUTT. Users can still choose "Other".
const OTHER_VALUE = "__OTHER__";

const FACULTY_TO_MAJORS: Record<string, string[]> = {
  "Faculty of Engineering": [
    "Department of Electrical Engineering",
    "Department of Computer Engineering",
    "Department of Electronic and Telecommunication Engineering",
    "Department of Control System and Instrumentation Engineering",
    "Department of Mechanical Engineering",
    "Department of Civil Engineering",
    "Department of Environmental Engineering",
    "Department of Production Engineering",
    "Department of Tool and Material Engineering",
    "Department of Chemical Engineering",
    "Department of Food Engineering",
  ],
  "Faculty of Industrial Education and Technology": [
    "Department of Civil Technology Education",
    "Department of Electrical Technology Education",
    "Mechanical Technology Education",
    "Department of Production Technology Education",
    "Educational Communication and Technology Department",
    "Division of Computer and Information Technology",
    "Department of Printing and Packaging Technology",
  ],
  "School of Energy, Environment and Materials": [
    "Energy Technology",
    "Energy Management Technology",
    "Materials Technology / Integrated Product Design and Manufacturing",
    "Environmental Technology",
    "Thermal Technology",
    "Polymer Processing and Flow Research Group (P-PROF)",
    "EnConLab (Energy Conservation Laboratory)",
  ],
  "Faculty of Science": [
    "Department of Mathematics",
    "Department of Microbiology",
    "Department of Chemistry",
    "Department of Physics",
    "Scientific Instrument Center for Standard and Industry",
    "Science Integrated Center",
  ],
  "School of Liberal Arts": [
    "Office of General Education (GenEd)",
  ],
  "School of Information Technology": [
    "Information Technology",
    "Computer Science (English Program)",
    "Digital Service Innovation",
  ],
  "School of Bioresources and Technology": [
    "Biotechnology",
    "Postharvest Technology",
  ],
  "School of Architecture and Design": [
    "Media Arts and Technology",
  ],
  "Graduate School of Management and Innovation": [],
  "Institute of Field Robotics (FIBO)": [],
};

type FormState = {
  fullname: string;
  nickname: string;
  year: string;
  faculty: string;
  major: string;
  phone: string;
  email: string;
  contactOther: string;
  roles: Record<RoleKey, boolean>;
  interviewSlots: InterviewSlot[];
  qWhy: string;
  qHowHelp: string;
  qPortfolio: string;
  qExpect: string;
};

type InterviewMode = "online" | "onsite";

type InterviewSlot = {
  date: string;
  startTime: string;
  endTime: string;
  mode: InterviewMode;
};

const YEAR_OPTIONS = ["1", "2", "3", "4"] as const;

const createInterviewSlot = (): InterviewSlot => ({
  date: "",
  startTime: "",
  endTime: "",
  mode: "onsite",
});

const MODE_SUMMARY_LABEL: Record<InterviewMode, string> = {
  online: "Online",
  onsite: "Onsite",
};

const normalizeTimeTo24Hour = (value: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const ampmMatch = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2];
    const period = ampmMatch[4].toUpperCase();
    if (hours === 12) hours = period === "AM" ? 0 : 12;
    else if (period === "PM") hours += 12;
    if (hours < 0 || hours > 23) return null;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  const twentyFourMatch = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (twentyFourMatch) {
    const hours = parseInt(twentyFourMatch[1], 10);
    const minutes = twentyFourMatch[2];
    if (Number.isNaN(hours) || hours < 0 || hours > 23) return null;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  return null;
};

const timeToMinutes = (value: string): number | null => {
  const normalized = normalizeTimeTo24Hour(value);
  if (!normalized) return null;
  const [hours, minutes] = normalized.split(":");
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const formatInterviewSlotForSummary = (slot: InterviewSlot): string | null => {
  const normalizedStart = normalizeTimeTo24Hour(slot.startTime);
  const normalizedEnd = normalizeTimeTo24Hour(slot.endTime);
  if (!slot.date || !normalizedStart || !normalizedEnd) return null;
  const [year, month, day] = slot.date.split("-");
  if (!year || !month || !day) return null;
  const formattedDate = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  return `${formattedDate}+${normalizedStart}-${normalizedEnd}+${MODE_SUMMARY_LABEL[slot.mode]}`;
};

export default function RegisterPage() {
  const router = useRouter();
  const { messages } = useI18n();
  const emptyRoles: Record<RoleKey, boolean> = useMemo(
    () => ({
      outreach_sponsor: false,
      knowledge_knowledge: false,
      knowledge_learning_design: false,
      marketing_video_editor: false,
      marketing_graphic_designer: false,
      marketing_photographer: false,
      marketing_content_writer: false,
      operation_sustainability: false,
      operation_finance: false,
      operation_hr: false,
      operation_document: false,
      event_organizer: false,
    }),
    []
  );

  const [form, setForm] = useState<FormState>({
    fullname: "",
    nickname: "",
    year: "",
    faculty: "",
    major: "",
    phone: "",
    email: "",
    contactOther: "",
    roles: emptyRoles,
    interviewSlots: [createInterviewSlot()],
    qWhy: "",
    qHowHelp: "",
    qPortfolio: "",
    qExpect: "",
  });
  const [customFaculty, setCustomFaculty] = useState<string>("");
  const [customMajor, setCustomMajor] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const stepLabels = useMemo(() => [messages.register.steps.s1, messages.register.steps.s2, messages.register.steps.s3], [messages.register.steps]);
  // Width (in % of container) from center of step 1 to current step position (centers at 1/6, 3/6, 5/6)
  // Base connector spans 2/3 (≈66.6667%) of container, starting at 1/6 (≈16.6667%) from the left
  const fillWidthPct = useMemo(() => ((step - 1) / 2) * 66.6667, [step]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRole(key: RoleKey) {
    setForm((prev) => ({
      ...prev,
      roles: { ...prev.roles, [key]: !prev.roles[key] },
    }));
  }

  function updateInterviewSlot(index: number, patch: Partial<InterviewSlot>) {
    setForm((prev) => {
      const nextSlots = prev.interviewSlots.map((slot, i) => {
        if (i !== index) return slot;
        const nextSlot: InterviewSlot = { ...slot };
        if (patch.date !== undefined) nextSlot.date = patch.date;
        if (patch.startTime !== undefined) {
          nextSlot.startTime = patch.startTime ? normalizeTimeTo24Hour(patch.startTime) ?? patch.startTime : "";
        }
        if (patch.endTime !== undefined) {
          nextSlot.endTime = patch.endTime ? normalizeTimeTo24Hour(patch.endTime) ?? patch.endTime : "";
        }
        if (patch.mode !== undefined) nextSlot.mode = patch.mode;
        return nextSlot;
      });
      return { ...prev, interviewSlots: nextSlots };
    });
  }

  function addInterviewSlot() {
    setForm((prev) => ({ ...prev, interviewSlots: [...prev.interviewSlots, createInterviewSlot()] }));
  }

  function removeInterviewSlot(index: number) {
    setForm((prev) => {
      const nextSlots = prev.interviewSlots.filter((_, i) => i !== index);
      return { ...prev, interviewSlots: nextSlots.length > 0 ? nextSlots : [createInterviewSlot()] };
    });
  }

  const interviewSummary = useMemo(() => {
    const formatted = form.interviewSlots.map((slot) => formatInterviewSlotForSummary(slot)).filter((value): value is string => Boolean(value));
    return formatted.join("\n");
  }, [form.interviewSlots]);

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.fullname) errors.fullname = messages.register.errors.fullname;
    if (!form.nickname) errors.nickname = messages.register.errors.nickname;
    if (!form.year) errors.year = messages.register.errors.year;
    const facultyFinal = form.faculty === OTHER_VALUE ? customFaculty.trim() : form.faculty;
    const majorFinal = form.major === OTHER_VALUE ? customMajor.trim() : form.major;
    if (!facultyFinal) errors.faculty = messages.register.errors.faculty;
    if (!majorFinal) errors.major = messages.register.errors.major;
    if (!form.phone) errors.phone = messages.register.errors.phone;
    if (!form.email) errors.email = messages.register.errors.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = messages.register.errors.emailInvalid;
    const selectedRoles = Object.values(form.roles).some(Boolean);
    if (!selectedRoles) errors.roles = messages.register.errors.roles;
    if (!form.qWhy) errors.qWhy = messages.register.errors.qWhy;
    if (!form.qHowHelp) errors.qHowHelp = messages.register.errors.qHowHelp;
    const missingSlotIndices: number[] = [];
    const invalidSlotIndices: number[] = [];
    form.interviewSlots.forEach((slot, index) => {
      if (!slot.date) {
        missingSlotIndices.push(index);
        return;
      }
      const start = timeToMinutes(slot.startTime);
      const end = timeToMinutes(slot.endTime);
      if (start === null || end === null) {
        missingSlotIndices.push(index);
        return;
      }
      if (end <= start) {
        invalidSlotIndices.push(index);
      }
    });
    if (form.interviewSlots.length === 0 || missingSlotIndices.length > 0) {
      errors.interviewSlots = messages.register.errors.interviewSlotsRequired;
    }
    if (invalidSlotIndices.length > 0) {
      for (const idx of invalidSlotIndices) {
        errors[`interviewSlot.${idx}`] = messages.register.errors.interviewSlotRange;
      }
      if (!errors.interviewSlots) {
        errors.interviewSlots = messages.register.errors.interviewSlotRange;
      }
    }
    return errors;
  }

  function validateStep(s: 1 | 2 | 3) {
    const errors: Record<string, string> = {};
    if (s === 1) {
      if (!form.fullname) errors.fullname = messages.register.errors.fullname;
      if (!form.nickname) errors.nickname = messages.register.errors.nickname;
      if (!form.year) errors.year = messages.register.errors.year;
      const facultyFinal = form.faculty === OTHER_VALUE ? customFaculty.trim() : form.faculty;
      const majorFinal = form.major === OTHER_VALUE ? customMajor.trim() : form.major;
      if (!facultyFinal) errors.faculty = messages.register.errors.faculty;
      if (!majorFinal) errors.major = messages.register.errors.major;
      if (!form.phone) errors.phone = messages.register.errors.phone;
      if (!form.email) errors.email = messages.register.errors.email;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = messages.register.errors.emailInvalid;
    } else if (s === 2) {
      const selectedRoles = Object.values(form.roles).some(Boolean);
      if (!selectedRoles) errors.roles = messages.register.errors.roles;
    } else if (s === 3) {
      if (!form.qWhy) errors.qWhy = messages.register.errors.qWhy;
      if (!form.qHowHelp) errors.qHowHelp = messages.register.errors.qHowHelp;
      const missingSlotIndices: number[] = [];
      const invalidSlotIndices: number[] = [];
      form.interviewSlots.forEach((slot, index) => {
        if (!slot.date) {
          missingSlotIndices.push(index);
          return;
        }
        const start = timeToMinutes(slot.startTime);
        const end = timeToMinutes(slot.endTime);
        if (start === null || end === null) {
          missingSlotIndices.push(index);
          return;
        }
        if (end <= start) {
          invalidSlotIndices.push(index);
        }
      });
      if (form.interviewSlots.length === 0 || missingSlotIndices.length > 0) {
        errors.interviewSlots = messages.register.errors.interviewSlotsRequired;
      }
      if (invalidSlotIndices.length > 0) {
        for (const idx of invalidSlotIndices) {
          errors[`interviewSlot.${idx}`] = messages.register.errors.interviewSlotRange;
        }
        if (!errors.interviewSlots) {
          errors.interviewSlots = messages.register.errors.interviewSlotRange;
        }
      }
    }
    return errors;
  }

  function markTouched(keys: string[]) {
    setTouched((prev) => {
      const next: Record<string, boolean> = { ...prev };
      for (const k of keys) next[k] = true;
      return next;
    });
  }

  function onNext() {
    const errs = validateStep(step);
    setFieldErrors(errs);
    if (step === 1) markTouched(["fullname", "nickname", "year", "faculty", "major", "phone", "email"]);
    if (step === 2) markTouched(["roles"]);
    if (Object.keys(errs).length === 0) setStep((s) => (s === 3 ? 3 : ((s + 1) as 2 | 3)));
  }

  function onBack() {
    setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const errors = validate();
    setFieldErrors(errors);
    markTouched([
      "fullname",
      "nickname",
      "year",
      "faculty",
      "major",
      "phone",
      "email",
      "roles",
      "qWhy",
      "qHowHelp",
      "interviewSlots",
    ]);
    if (Object.keys(errors).length > 0) {
      // jump to first step that has errors
      if (errors.fullname || errors.nickname || errors.year || errors.faculty || errors.major || errors.phone || errors.email) setStep(1);
      else if (errors.roles) setStep(2);
      else setStep(3);
      return;
    }

    try {
      setSubmitting(true);

      const facultyFinal = form.faculty === OTHER_VALUE ? customFaculty.trim() : form.faculty;
      const majorFinal = form.major === OTHER_VALUE ? customMajor.trim() : form.major;
      const normalizedSlotsForSubmit = form.interviewSlots.map((slot) => ({
        ...slot,
        startTime: slot.startTime ? normalizeTimeTo24Hour(slot.startTime) ?? slot.startTime : "",
        endTime: slot.endTime ? normalizeTimeTo24Hour(slot.endTime) ?? slot.endTime : "",
      }));
      const summaryForSubmit = normalizedSlotsForSubmit
        .map((slot) => formatInterviewSlotForSummary(slot))
        .filter((value): value is string => Boolean(value))
        .join("\n");

      const params = new URLSearchParams();
      params.set("fullname", String(form.fullname ?? ""));
      params.set("nickname", String(form.nickname ?? ""));
      params.set("year", String(form.year ?? ""));
      params.set("faculty", String(facultyFinal ?? ""));
      params.set("major", String(majorFinal ?? ""));
      params.set("phone", String(form.phone ?? ""));
      params.set("email", String(form.email ?? ""));
      params.set("contactOther", String(form.contactOther ?? ""));

      const selectedRoleLabels = Object.entries(form.roles)
        .filter(([, isSelected]) => Boolean(isSelected))
        .map(([key]) => ROLE_LABELS[key as RoleKey]);
      params.set("roles", selectedRoleLabels.join(","));

      params.set("qWhy", String(form.qWhy ?? ""));
      params.set("qHowHelp", String(form.qHowHelp ?? ""));
      params.set("qPortfolio", String(form.qPortfolio ?? ""));
      params.set("qExpect", String(form.qExpect ?? ""));
      params.set("interviewSummary", summaryForSubmit);

      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: form.fullname,
          nickname: form.nickname,
          year: form.year,
          faculty: facultyFinal,
          major: majorFinal,
          phone: form.phone,
          email: form.email,
          contactOther: form.contactOther,
          roles: selectedRoleLabels,
          interviewSummary: summaryForSubmit,
          interviewSlots: normalizedSlotsForSubmit,
          qWhy: form.qWhy,
          qHowHelp: form.qHowHelp,
          qPortfolio: form.qPortfolio,
          qExpect: form.qExpect,
        }),
      });
      if (!res.ok) {
        throw new Error(messages.register.errors.submitFailed);
      }
      router.push("/register/success");
    } catch {
      setSubmitting(false);
      setError(messages.register.errors.redirectFailed);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container-page px-4 py-3 flex items-center justify-end">
        <LanguageSwitcher />
      </div>
      <div className="container-page max-w-2xl mx-auto px-4 py-10 mb-30">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">{messages.register.title}</h1>
          <p className="text-[var(--muted-foreground)] mt-2">{messages.register.subtitle}</p>
        </div>

        {/* Modern stepper progress */}
        <div className="mb-6 relative">
          {/* Base connector from center of step 1 to center of step 3 */}
          <div
            className="absolute top-5 h-1 bg-[var(--color-muted-200)] rounded-full"
            style={{ left: "16.6667%", width: "66.6667%" }}
          />
          {/* Filled connector up to current step */}
          <div
            className="absolute top-5 h-1 rounded-full transition-all shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
            style={{
              left: "16.6667%",
              width: `${fillWidthPct}%`,
              backgroundImage: "linear-gradient(90deg, var(--color-accent-orange), var(--color-accent-orange-600))",
            }}
            aria-hidden="true"
          />
          <ol className="relative z-10 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => {
              const active = i <= step;
              return (
                <li key={i} className="flex flex-col items-center">
                  <div
                    className={
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors " +
                      (active
                        ? "bg-[var(--color-accent-orange)] text-white ring-4 ring-[color-mix(in_oklab,var(--color-accent-orange)_20%,transparent)]"
                        : "bg-[var(--color-muted-200)] text-[var(--muted-foreground)]")
                    }
                    aria-current={active && step === i ? "step" : undefined}
                  >
                    {i === 1 ? <IoIosInformationCircleOutline size={20} /> : i === 2 ? <AiOutlineTeam size={20} /> : <MdOutlineQuestionAnswer size={20} />}
                  </div>
                  <span className={"mt-2 text-xs text-center " + (active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]")}>
                    {stepLabels[i - 1]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <form onSubmit={onSubmit} className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 space-y-8">
          {step === 1 ? (
          <section>
            <h2 className="text-xl font-semibold mb-3">{messages.register.section1Title}</h2>
            <div className="space-y-5">
              <TextInput
                label={messages.register.labels.fullname}
                value={form.fullname}
                onChange={(value) => update("fullname", value)}
                onBlur={() => setTouched((t) => ({ ...t, fullname: true }))}
                placeholder={messages.register.placeholders.fullname}
                required
                error={fieldErrors.fullname}
                touched={touched.fullname}
              />

              <TextInput
                label={messages.register.labels.nickname}
                value={form.nickname}
                onChange={(value) => update("nickname", value)}
                onBlur={() => setTouched((t) => ({ ...t, nickname: true }))}
                placeholder={messages.register.placeholders.nickname}
                required
                error={fieldErrors.nickname}
                touched={touched.nickname}
              />

              <Select
                label={messages.register.labels.year}
                value={form.year}
                onChange={(value) => update("year", value)}
                onBlur={() => setTouched((t) => ({ ...t, year: true }))}
                options={YEAR_OPTIONS.map((y) => ({ value: y, label: y }))}
                placeholder={messages.register.selectYear}
                required
                error={fieldErrors.year}
                touched={touched.year}
              />

              <SelectWithCustom
                label={messages.register.labels.faculty}
                value={form.faculty}
                onChange={(value) => {
                  update("faculty", value);
                  update("major", "");
                }}
                onBlur={() => setTouched((t) => ({ ...t, faculty: true }))}
                options={Object.keys(FACULTY_TO_MAJORS).map((f) => ({ value: f, label: f }))}
                placeholder={messages.register.selectFaculty}
                required
                error={fieldErrors.faculty}
                touched={touched.faculty}
                customValue={customFaculty}
                onCustomValueChange={setCustomFaculty}
                customPlaceholder={messages.register.placeholders.enterFaculty}
                otherOptionLabel={messages.register.other}
              />

              <SelectWithCustom
                label={messages.register.labels.major}
                value={form.major}
                onChange={(value) => update("major", value)}
                onBlur={() => setTouched((t) => ({ ...t, major: true }))}
                options={(form.faculty && form.faculty !== OTHER_VALUE ? FACULTY_TO_MAJORS[form.faculty] : []).map((m) => ({ value: m, label: m }))}
                placeholder={messages.register.selectMajor}
                required
                error={fieldErrors.major}
                touched={touched.major}
                customValue={customMajor}
                onCustomValueChange={setCustomMajor}
                customPlaceholder={messages.register.placeholders.enterMajor}
                otherOptionLabel={messages.register.other}
                hint={messages.register.selectMajorHint}
              />

              <TextInput
                label={messages.register.labels.phone}
                value={form.phone}
                onChange={(value) => update("phone", value)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder={messages.register.placeholders.phone}
                required
                error={fieldErrors.phone}
                touched={touched.phone}
                type="tel"
              />

              <TextInput
                label={messages.register.labels.email}
                value={form.email}
                onChange={(value) => update("email", value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder={messages.register.placeholders.email}
                required
                error={fieldErrors.email}
                touched={touched.email}
                type="email"
              />

              <TextInput
                label={messages.register.labels.otherContact}
                value={form.contactOther}
                onChange={(value) => update("contactOther", value)}
                placeholder={messages.register.placeholders.otherContact}
              />
            </div>
          </section>
            ) : null}

          {step === 2 ? (
          <section>
            <h2 className="text-xl font-semibold mb-3">{messages.register.section2Title}</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-3">{messages.register.section2Intro}</p>
            <div className="mb-10"></div>
            <fieldset className="space-y-5">
              <legend className="sr-only">{messages.register.section2Legend}</legend>

              <div>
                <div className="font-medium mb-2">{messages.register.teams.outreach}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title={messages.register.roleCards.outreach_sponsor.title}
                    description={messages.register.roleCards.outreach_sponsor.description}
                    checked={form.roles.outreach_sponsor}
                    onToggle={() => toggleRole("outreach_sponsor")}
                    inputId="role-outreach-sponsor"
                  />
                </div>
              </div>

              <div>
                <div className="font-medium mb-2">{messages.register.teams.knowledge}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title={messages.register.roleCards.knowledge_knowledge.title}
                    description={messages.register.roleCards.knowledge_knowledge.description}
                    checked={form.roles.knowledge_knowledge}
                    onToggle={() => toggleRole("knowledge_knowledge")}
                    inputId="role-knowledge-knowledge"
                  />
                  <RoleCard
                    title={messages.register.roleCards.knowledge_learning_design.title}
                    description={messages.register.roleCards.knowledge_learning_design.description}
                    checked={form.roles.knowledge_learning_design}
                    onToggle={() => toggleRole("knowledge_learning_design")}
                    inputId="role-knowledge-learning-design"
                  />
                 
                </div>
          </div>

          <div>
                <div className="font-medium mb-2">{messages.register.teams.marketing}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title={messages.register.roleCards.marketing_video_editor.title}
                    description={messages.register.roleCards.marketing_video_editor.description}
                    checked={form.roles.marketing_video_editor}
                    onToggle={() => toggleRole("marketing_video_editor")}
                    inputId="role-marketing-video-editor"
                  />
                  <RoleCard
                    title={messages.register.roleCards.marketing_graphic_designer.title}
                    description={messages.register.roleCards.marketing_graphic_designer.description}
                    checked={form.roles.marketing_graphic_designer}
                    onToggle={() => toggleRole("marketing_graphic_designer")}
                    inputId="role-marketing-graphic-designer"
                  />
                  <RoleCard
                    title={messages.register.roleCards.marketing_photographer.title}
                    description={messages.register.roleCards.marketing_photographer.description}
                    checked={form.roles.marketing_photographer}
                    onToggle={() => toggleRole("marketing_photographer")}
                    inputId="role-marketing-photographer"
                  />
                  <RoleCard
                    title={messages.register.roleCards.marketing_content_writer.title}
                    description={messages.register.roleCards.marketing_content_writer.description}
                    checked={form.roles.marketing_content_writer}
                    onToggle={() => toggleRole("marketing_content_writer")}
                    inputId="role-marketing-content-writer"
                  />
                </div>
          </div>

          <div>
                <div className="font-medium mb-2">{messages.register.teams.operation}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <RoleCard
                    title={messages.register.roleCards.operation_sustainability.title}
                    description={messages.register.roleCards.operation_sustainability.description}
                    checked={form.roles.operation_sustainability}
                    onToggle={() => toggleRole("operation_sustainability")}
                    inputId="role-operation-sustainability"
                  />
                  <RoleCard
                    title={messages.register.roleCards.operation_finance.title}
                    description={messages.register.roleCards.operation_finance.description}
                    checked={form.roles.operation_finance}
                    onToggle={() => toggleRole("operation_finance")}
                    inputId="role-operation-finance"
                  />
                  <RoleCard
                    title={messages.register.roleCards.operation_hr.title}
                    description={messages.register.roleCards.operation_hr.description}
                    checked={form.roles.operation_hr}
                    onToggle={() => toggleRole("operation_hr")}
                    inputId="role-operation-hr"
                  />
                  <RoleCard
                    title={messages.register.roleCards.operation_document.title}
                    description={messages.register.roleCards.operation_document.description}
                    checked={form.roles.operation_document}
                    onToggle={() => toggleRole("operation_document")}
                    inputId="role-operation-document"
                  />
                </div>
          </div>

          <div>
                <div className="font-medium mb-2">{messages.register.teams.event}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title={messages.register.roleCards.event_organizer.title}
                    description={messages.register.roleCards.event_organizer.description}
                    checked={form.roles.event_organizer}
                    onToggle={() => toggleRole("event_organizer")}
                    inputId="role-event-organizer"
                  />
                </div>
              </div>

              {fieldErrors.roles ? (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.roles}</p>
              ) : null}
            </fieldset>
          </section>
          ) : null}

          {step === 3 ? (
          <section>
            <h2 className="text-xl font-semibold mb-3">{messages.register.section3Title}</h2>
            <div className="space-y-5">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-muted-200)] bg-[var(--color-muted-50)]/40 p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <span>{messages.register.interview.heading}</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{messages.register.interview.description}</p>
                </div>
                <div className="space-y-4">
                  {form.interviewSlots.map((slot, index) => {
                    const slotErrorKey = `interviewSlot.${index}`;
                    const slotError = touched.interviewSlots ? fieldErrors[slotErrorKey] : undefined;
                    const slotHasError = Boolean(slotError);
                    return (
                      <InterviewSlotInput
                        key={index}
                        slot={slot}
                        index={index}
                        onUpdate={updateInterviewSlot}
                        onRemove={removeInterviewSlot}
                        canRemove={form.interviewSlots.length > 1}
                        hasError={slotHasError}
                        normalizeTimeTo24Hour={normalizeTimeTo24Hour}
                        onBlur={() => setTouched((t) => ({ ...t, interviewSlots: true }))}
                        labels={messages.register.interview}
                      />
                    );
                  })}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={addInterviewSlot}
                    className="inline-flex items-center justify-center rounded-full px-5 h-10 bg-[var(--color-accent-orange)] text-white text-sm font-medium hover:bg-[var(--color-accent-orange-600)]"
                  >
                    {messages.register.interview.addSlot}
                  </button>
                </div>
                {touched.interviewSlots && fieldErrors.interviewSlots ? (
                  <p className="text-xs text-red-600">{fieldErrors.interviewSlots}</p>
                ) : null}
              </div>

              <TextArea
                label={messages.register.qWhyLabel}
                value={form.qWhy}
                onChange={(value) => update("qWhy", value)}
                onBlur={() => setTouched((t) => ({ ...t, qWhy: true }))}
                placeholder={messages.register.placeholders.qWhy}
                required
                error={fieldErrors.qWhy}
                touched={touched.qWhy}
              />

              <TextArea
                label={messages.register.qHowHelpLabel}
                value={form.qHowHelp}
                onChange={(value) => update("qHowHelp", value)}
                onBlur={() => setTouched((t) => ({ ...t, qHowHelp: true }))}
                placeholder={messages.register.placeholders.qHowHelp}
                required
                error={fieldErrors.qHowHelp}
                touched={touched.qHowHelp}
              />

              <TextArea
                label={messages.register.qPortfolioLabel}
                value={form.qPortfolio}
                onChange={(value) => update("qPortfolio", value)}
                placeholder={messages.register.placeholders.qPortfolio}
                minHeight="min-h-24"
              />

              <TextArea
                label={messages.register.qExpectLabel}
                value={form.qExpect}
                onChange={(value) => update("qExpect", value)}
                placeholder={messages.register.placeholders.qExpect}
                minHeight="min-h-24"
              />
            </div>
          </section>
          ) : null}

          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : null}
          {message ? (
            <div className="text-sm text-green-600">{message}</div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-[999px] px-5 h-11 bg-[var(--color-muted-200)] text-[var(--foreground)] hover:bg-[var(--color-muted-300)]"
                >
                  {messages.register.buttons.back}
                </button>
              ) : (
                <Link href="/" className="text-sm hover:underline">{messages.register.buttons.backToHome}</Link>
              )}
            </div>
          <div className="flex items-center gap-3">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="rounded-[999px] px-6 h-11 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)]"
                >
                  {messages.register.buttons.next}
                </button>
              ) : (
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[999px] px-6 h-11 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] disabled:opacity-60"
            >
                  {submitting ? messages.register.buttons.submitting : messages.register.buttons.submit}
            </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <ContactFooter />
    </div>
  );
}


