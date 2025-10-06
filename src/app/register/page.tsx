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
  faculty: string;
  major: string;
  phone: string;
  email: string;
  contactOther: string;
  roles: Record<RoleKey, boolean>;
  qWhy: string;
  qHowHelp: string;
  qPortfolio: string;
  qExpect: string;
};

type RoleCardProps = {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  inputId: string;
};

function RoleCard({ title, description, checked, onToggle, inputId }: RoleCardProps) {
  return (
    <label
      htmlFor={inputId}
      className={
        "block rounded-[var(--radius-lg)] border transition-all cursor-pointer select-none " +
        (checked
          ? "border-[var(--color-accent-orange)] bg-[color-mix(in_oklab,var(--color-accent-orange)_12%,transparent)] shadow-sm"
          : "border-[var(--color-muted-200)] hover:border-[var(--color-accent-orange)]")
      }
    >
      <input id={inputId} type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <div className="p-4 flex items-start gap-3">
        <span
          aria-hidden="true"
          className={
            "mt-1 inline-flex w-5 h-5 items-center justify-center rounded-md border transition-colors " +
            (checked
              ? "bg-[var(--color-accent-orange)] border-[var(--color-accent-orange)] text-white"
              : "bg-white border-[var(--color-muted-300)] text-transparent")
          }
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>
          <div className="font-medium">{title}</div>
          <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
        </span>
      </div>
    </label>
  );
}

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
    faculty: "",
    major: "",
    phone: "",
    email: "",
    contactOther: "",
    roles: emptyRoles,
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

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.fullname) errors.fullname = messages.register.errors.fullname;
    if (!form.nickname) errors.nickname = messages.register.errors.nickname;
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
    return errors;
  }

  function validateStep(s: 1 | 2 | 3) {
    const errors: Record<string, string> = {};
    if (s === 1) {
      if (!form.fullname) errors.fullname = messages.register.errors.fullname;
      if (!form.nickname) errors.nickname = messages.register.errors.nickname;
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
    if (step === 1) markTouched(["fullname", "nickname", "faculty", "major", "phone", "email"]);
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
    if (Object.keys(errors).length > 0) {
      // jump to first step that has errors
      if (errors.fullname || errors.nickname || errors.facultyMajor || errors.phone || errors.email) setStep(1);
      else if (errors.roles) setStep(2);
      else setStep(3);
      return;
    }

    try {
      setSubmitting(true);

      const facultyFinal = form.faculty === OTHER_VALUE ? customFaculty.trim() : form.faculty;
      const majorFinal = form.major === OTHER_VALUE ? customMajor.trim() : form.major;

      const params = new URLSearchParams();
      params.set("fullname", String(form.fullname ?? ""));
      params.set("nickname", String(form.nickname ?? ""));
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

      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: form.fullname,
          nickname: form.nickname,
          faculty: facultyFinal,
          major: majorFinal,
          phone: form.phone,
          email: form.email,
          contactOther: form.contactOther,
          roles: selectedRoleLabels,
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
              <div>
                <label className="block text-sm font-medium mb-1">{messages.register.labels.fullname}<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.fullname}
                  onChange={(e) => update("fullname", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, fullname: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.fullname}
                  aria-invalid={Boolean(fieldErrors.fullname) || undefined}
                  aria-describedby={fieldErrors.fullname ? "fullname-error" : undefined}
                  required
                />
                {touched.fullname && fieldErrors.fullname ? (
                  <p id="fullname-error" className="mt-1 text-xs text-red-600">{fieldErrors.fullname}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{messages.register.labels.nickname}<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => update("nickname", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, nickname: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.nickname}
                  aria-invalid={Boolean(fieldErrors.nickname) || undefined}
                  aria-describedby={fieldErrors.nickname ? "nickname-error" : undefined}
                  required
                />
                {touched.nickname && fieldErrors.nickname ? (
                  <p id="nickname-error" className="mt-1 text-xs text-red-600">{fieldErrors.nickname}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{messages.register.labels.faculty}<span className="text-red-500">*</span></label>
                <select
                  value={form.faculty}
                  onChange={(e) => {
                    const value = e.target.value;
                    update("faculty", value);
                    // Reset major when faculty changes
                    update("major", "");
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, faculty: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  aria-invalid={Boolean(fieldErrors.faculty) || undefined}
                  aria-describedby={fieldErrors.faculty ? "faculty-error" : undefined}
                  required
                >
                  <option value="">{messages.register.selectFaculty}</option>
                  {Object.keys(FACULTY_TO_MAJORS).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                  <option value={OTHER_VALUE}>{messages.register.other}</option>
                </select>
                {form.faculty === OTHER_VALUE ? (
                  <input
                    type="text"
                    value={customFaculty}
                    onChange={(e) => setCustomFaculty(e.target.value)}
                    placeholder={messages.register.placeholders.enterFaculty}
                    className="mt-2 w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  />
                ) : null}
                {touched.faculty && fieldErrors.faculty ? (
                  <p id="faculty-error" className="mt-1 text-xs text-red-600">{fieldErrors.faculty}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{messages.register.labels.major}<span className="text-red-500">*</span></label>
                <p className="text-sm text-[var(--muted-foreground)] opacity-70 mb-1">{messages.register.selectMajorHint}</p>
                <select
                  value={form.major}
                  onChange={(e) => update("major", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, major: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  aria-invalid={Boolean(fieldErrors.major) || undefined}
                  aria-describedby={fieldErrors.major ? "major-error" : undefined}
                  required
                >
                  <option value="">{messages.register.selectMajor}</option>
                  {(form.faculty && form.faculty !== OTHER_VALUE ? FACULTY_TO_MAJORS[form.faculty] : []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value={OTHER_VALUE}>{messages.register.other}</option>
                </select>
                {form.major === OTHER_VALUE ? (
                  <input
                    type="text"
                    value={customMajor}
                    onChange={(e) => setCustomMajor(e.target.value)}
                    placeholder={messages.register.placeholders.enterMajor}
                    className="mt-2 w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  />
                ) : null}
                {touched.major && fieldErrors.major ? (
                  <p id="major-error" className="mt-1 text-xs text-red-600">{fieldErrors.major}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{messages.register.labels.phone}<span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.phone}
                  aria-invalid={Boolean(fieldErrors.phone) || undefined}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  required
                />
                {touched.phone && fieldErrors.phone ? (
                  <p id="phone-error" className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                ) : null}
              </div>

          <div>
                <label className="block text-sm font-medium mb-1">{messages.register.labels.email}<span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
              placeholder={messages.register.placeholders.email}
              aria-invalid={Boolean(fieldErrors.email) || undefined}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              required
            />
            {touched.email && fieldErrors.email ? (
              <p id="email-error" className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div>
                <label className="block text-sm font-medium mb-1">{messages.register.labels.otherContact}</label>
            <input
              type="text"
                  value={form.contactOther}
                  onChange={(e) => update("contactOther", e.target.value)}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.otherContact}
            />
              </div>
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
              <div>
                <label className="block text-sm font-medium mb-1">{messages.register.qWhyLabel}<span className="text-red-500">*</span></label>
                <textarea
                  value={form.qWhy}
                  onChange={(e) => update("qWhy", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, qWhy: true }))}
                  className="w-full min-h-28 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.qWhy}
                  aria-invalid={Boolean(fieldErrors.qWhy) || undefined}
                  aria-describedby={fieldErrors.qWhy ? "qWhy-error" : undefined}
                  required
                />
                {touched.qWhy && fieldErrors.qWhy ? (
                  <p id="qWhy-error" className="mt-1 text-xs text-red-600">{fieldErrors.qWhy}</p>
                ) : null}
          </div>

          <div>
                <label className="block text-sm font-medium mb-1">{messages.register.qHowHelpLabel}<span className="text-red-500">*</span></label>
                <textarea
                  value={form.qHowHelp}
                  onChange={(e) => update("qHowHelp", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, qHowHelp: true }))}
                  className="w-full min-h-28 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.qHowHelp}
                  aria-invalid={Boolean(fieldErrors.qHowHelp) || undefined}
                  aria-describedby={fieldErrors.qHowHelp ? "qHowHelp-error" : undefined}
                  required
                />
                {touched.qHowHelp && fieldErrors.qHowHelp ? (
                  <p id="qHowHelp-error" className="mt-1 text-xs text-red-600">{fieldErrors.qHowHelp}</p>
                ) : null}
          </div>

          <div>
                <label className="block text-sm font-medium mb-1">{messages.register.qPortfolioLabel}</label>
            <textarea
                  value={form.qPortfolio}
                  onChange={(e) => update("qPortfolio", e.target.value)}
                  className="w-full min-h-24 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.qPortfolio}
            />
          </div>

              <div>
                <label className="block text-sm font-medium mb-1">{messages.register.qExpectLabel}</label>
                <textarea
                  value={form.qExpect}
                  onChange={(e) => update("qExpect", e.target.value)}
                  className="w-full min-h-24 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder={messages.register.placeholders.qExpect}
                />
              </div>
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


