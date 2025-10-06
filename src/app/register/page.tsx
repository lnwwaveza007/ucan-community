"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { AiOutlineTeam } from "react-icons/ai";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { useRouter } from "next/navigation";

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
  const stepLabels = useMemo(() => ["General Info", "Select Roles", "Open Questions"], []);
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
    if (!form.fullname) errors.fullname = "Full name is required";
    if (!form.nickname) errors.nickname = "Nickname is required";
    const facultyFinal = form.faculty === OTHER_VALUE ? customFaculty.trim() : form.faculty;
    const majorFinal = form.major === OTHER_VALUE ? customMajor.trim() : form.major;
    if (!facultyFinal) errors.faculty = "Faculty is required";
    if (!majorFinal) errors.major = "Major is required";
    if (!form.phone) errors.phone = "Phone number is required";
    if (!form.email) errors.email = "E-mail is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email format";
    const selectedRoles = Object.values(form.roles).some(Boolean);
    if (!selectedRoles) errors.roles = "Please select at least one role";
    if (!form.qWhy) errors.qWhy = "Please tell us why you're interested (required)";
    if (!form.qHowHelp) errors.qHowHelp = "Please share how you can help the team (required)";
    return errors;
  }

  function validateStep(s: 1 | 2 | 3) {
    const errors: Record<string, string> = {};
    if (s === 1) {
      if (!form.fullname) errors.fullname = "Full name is required";
      if (!form.nickname) errors.nickname = "Nickname is required";
      const facultyFinal = form.faculty === OTHER_VALUE ? customFaculty.trim() : form.faculty;
      const majorFinal = form.major === OTHER_VALUE ? customMajor.trim() : form.major;
      if (!facultyFinal) errors.faculty = "Faculty is required";
      if (!majorFinal) errors.major = "Major is required";
      if (!form.phone) errors.phone = "Phone number is required";
      if (!form.email) errors.email = "E-mail is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email format";
    } else if (s === 2) {
      const selectedRoles = Object.values(form.roles).some(Boolean);
      if (!selectedRoles) errors.roles = "Please select at least one role";
    } else if (s === 3) {
      if (!form.qWhy) errors.qWhy = "Please tell us why you're interested (required)";
      if (!form.qHowHelp) errors.qHowHelp = "Please share how you can help the team (required)";
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
        throw new Error("Failed to submit form");
      }
      router.push("/register/success");
    } catch {
      setSubmitting(false);
      setError("Failed to redirect. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container-page max-w-2xl mx-auto px-4 py-10 mb-30">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Apply to join UCAN Community</h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Applications open from 7 - 11 October 2025
          </p>
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
            <h2 className="text-xl font-semibold mb-3">Section 1: General Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.fullname}
                  onChange={(e) => update("fullname", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, fullname: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="e.g., Jane Doe"
                  aria-invalid={Boolean(fieldErrors.fullname) || undefined}
                  aria-describedby={fieldErrors.fullname ? "fullname-error" : undefined}
                  required
                />
                {touched.fullname && fieldErrors.fullname ? (
                  <p id="fullname-error" className="mt-1 text-xs text-red-600">{fieldErrors.fullname}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nickname<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => update("nickname", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, nickname: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="e.g., Boat"
                  aria-invalid={Boolean(fieldErrors.nickname) || undefined}
                  aria-describedby={fieldErrors.nickname ? "nickname-error" : undefined}
                  required
                />
                {touched.nickname && fieldErrors.nickname ? (
                  <p id="nickname-error" className="mt-1 text-xs text-red-600">{fieldErrors.nickname}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Faculty<span className="text-red-500">*</span></label>
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
                  <option value="">Select faculty</option>
                  {Object.keys(FACULTY_TO_MAJORS).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                  <option value={OTHER_VALUE}>Other</option>
                </select>
                {form.faculty === OTHER_VALUE ? (
                  <input
                    type="text"
                    value={customFaculty}
                    onChange={(e) => setCustomFaculty(e.target.value)}
                    placeholder="Enter your faculty"
                    className="mt-2 w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  />
                ) : null}
                {touched.faculty && fieldErrors.faculty ? (
                  <p id="faculty-error" className="mt-1 text-xs text-red-600">{fieldErrors.faculty}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Major<span className="text-red-500">*</span></label>
                <p className="text-sm text-[var(--muted-foreground)] opacity-70 mb-1">Select from list or choose Other to type your major</p>
                <select
                  value={form.major}
                  onChange={(e) => update("major", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, major: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  aria-invalid={Boolean(fieldErrors.major) || undefined}
                  aria-describedby={fieldErrors.major ? "major-error" : undefined}
                  required
                >
                  <option value="">Select major</option>
                  {(form.faculty && form.faculty !== OTHER_VALUE ? FACULTY_TO_MAJORS[form.faculty] : []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value={OTHER_VALUE}>Other</option>
                </select>
                {form.major === OTHER_VALUE || !form.faculty ? (
                  <input
                    type="text"
                    value={customMajor}
                    onChange={(e) => setCustomMajor(e.target.value)}
                    placeholder="Enter your major"
                    className="mt-2 w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  />
                ) : null}
                {touched.major && fieldErrors.major ? (
                  <p id="major-error" className="mt-1 text-xs text-red-600">{fieldErrors.major}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number<span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                  className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="e.g., 08x-xxx-xxxx"
                  aria-invalid={Boolean(fieldErrors.phone) || undefined}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  required
                />
                {touched.phone && fieldErrors.phone ? (
                  <p id="phone-error" className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                ) : null}
              </div>

          <div>
                <label className="block text-sm font-medium mb-1">E-mail<span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
              placeholder="you@example.com"
              aria-invalid={Boolean(fieldErrors.email) || undefined}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              required
            />
            {touched.email && fieldErrors.email ? (
              <p id="email-error" className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div>
                <label className="block text-sm font-medium mb-1">Other contact (Line/IG/Facebook)</label>
            <input
              type="text"
                  value={form.contactOther}
                  onChange={(e) => update("contactOther", e.target.value)}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="Add handle or link"
            />
              </div>
            </div>
          </section>
            ) : null}

          {step === 2 ? (
          <section>
            <h2 className="text-xl font-semibold mb-3">Section 2: Roles of Interest (you can select more than 1)</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-3">Select one or more roles and read each description to understand the responsibilities.</p>
            <div className="mb-10"></div>
            <fieldset className="space-y-5">
              <legend className="sr-only">Roles of interest</legend>

              <div>
                <div className="font-medium mb-2">Outreach Team</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title="Sponsor"
                    description="หาผู้สนับสนุนทั้งด้านเงินทุนหรือทรัพยากร และดูแลความสัมพันธ์กับสปอนเซอร์"
                    checked={form.roles.outreach_sponsor}
                    onToggle={() => toggleRole("outreach_sponsor")}
                    inputId="role-outreach-sponsor"
                  />
                </div>
              </div>

              <div>
                <div className="font-medium mb-2">Knowledge Team</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title="Knowledge"
                    description="ค้นคว้าและจัดทำเนื้อหาความรู้เพื่อใช้ในกิจกรรมหรือโครงการของ UCAN"
                    checked={form.roles.knowledge_knowledge}
                    onToggle={() => toggleRole("knowledge_knowledge")}
                    inputId="role-knowledge-knowledge"
                  />
                  <RoleCard
                    title="Learning Design"
                    description="ออกแบบกระบวนการเรียนรู้หรือเวิร์กช็อปให้เหมาะสมกับผู้เข้าร่วม"
                    checked={form.roles.knowledge_learning_design}
                    onToggle={() => toggleRole("knowledge_learning_design")}
                    inputId="role-knowledge-learning-design"
                  />
                 
                </div>
          </div>

          <div>
                <div className="font-medium mb-2">Marketing Team</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title="Video Editor"
                    description="ตัดต่อวิดีโอโปรโมท กิจกรรม หรือคอนเทนต์ต่าง ๆ"
                    checked={form.roles.marketing_video_editor}
                    onToggle={() => toggleRole("marketing_video_editor")}
                    inputId="role-marketing-video-editor"
                  />
                  <RoleCard
                    title="Graphic Designer"
                    description="ออกแบบสื่อกราฟิก เช่น โปสเตอร์ อินโฟกราฟิก โลโก้"
                    checked={form.roles.marketing_graphic_designer}
                    onToggle={() => toggleRole("marketing_graphic_designer")}
                    inputId="role-marketing-graphic-designer"
                  />
                  <RoleCard
                    title="Photographer"
                    description="ถ่ายภาพกิจกรรมและเก็บภาพสำหรับสื่อประชาสัมพันธ์"
                    checked={form.roles.marketing_photographer}
                    onToggle={() => toggleRole("marketing_photographer")}
                    inputId="role-marketing-photographer"
                  />
                  <RoleCard
                    title="Content Writer"
                    description="เขียนบทความ โพสต์โซเชียล และเนื้อหาประชาสัมพันธ์"
                    checked={form.roles.marketing_content_writer}
                    onToggle={() => toggleRole("marketing_content_writer")}
                    inputId="role-marketing-content-writer"
                  />
                </div>
          </div>

          <div>
                <div className="font-medium mb-2">Operation Team</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <RoleCard
                    title="Sustainability"
                    description="พัฒนาแนวทางและกิจกรรมที่ส่งเสริมความยั่งยืนทั้งด้านสิ่งแวดล้อมและสังคม"
                    checked={form.roles.operation_sustainability}
                    onToggle={() => toggleRole("operation_sustainability")}
                    inputId="role-operation-sustainability"
                  />
                  <RoleCard
                    title="Finance"
                    description="จัดการเรื่องงบประมาณ การเงิน และบัญชี"
                    checked={form.roles.operation_finance}
                    onToggle={() => toggleRole("operation_finance")}
                    inputId="role-operation-finance"
                  />
                  <RoleCard
                    title="Human Resource (HR)"
                    description="ดูแลสมาชิกทีม รับสมัคร และสวัสดิการภายใน"
                    checked={form.roles.operation_hr}
                    onToggle={() => toggleRole("operation_hr")}
                    inputId="role-operation-hr"
                  />
                  <RoleCard
                    title="Document"
                    description="จัดเก็บและดูแลเอกสารสำคัญ เช่น รายงานประชุม ข้อมูลโครงการ"
                    checked={form.roles.operation_document}
                    onToggle={() => toggleRole("operation_document")}
                    inputId="role-operation-document"
                  />
                </div>
          </div>

          <div>
                <div className="font-medium mb-2">Event Organizer</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard
                    title="Event Organizer"
                    description="วางแผนและจัดการกิจกรรม ตั้งแต่การออกแบบงาน กำหนดเวลา ประสานงาน ไปจนถึงการจัดงานจริง"
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
            <h2 className="text-xl font-semibold mb-3">Section 3: Open Questions</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Why are you interested in joining UCAN Community?<span className="text-red-500">*</span></label>
                <textarea
                  value={form.qWhy}
                  onChange={(e) => update("qWhy", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, qWhy: true }))}
                  className="w-full min-h-28 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="Share your motivation and expectations"
                  aria-invalid={Boolean(fieldErrors.qWhy) || undefined}
                  aria-describedby={fieldErrors.qWhy ? "qWhy-error" : undefined}
                  required
                />
                {touched.qWhy && fieldErrors.qWhy ? (
                  <p id="qWhy-error" className="mt-1 text-xs text-red-600">{fieldErrors.qWhy}</p>
                ) : null}
          </div>

          <div>
                <label className="block text-sm font-medium mb-1">How do you think you can help the team(s) you selected? (skills/experience)<span className="text-red-500">*</span></label>
                <textarea
                  value={form.qHowHelp}
                  onChange={(e) => update("qHowHelp", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, qHowHelp: true }))}
                  className="w-full min-h-28 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="Describe relevant skills, experience, or work"
                  aria-invalid={Boolean(fieldErrors.qHowHelp) || undefined}
                  aria-describedby={fieldErrors.qHowHelp ? "qHowHelp-error" : undefined}
                  required
                />
                {touched.qHowHelp && fieldErrors.qHowHelp ? (
                  <p id="qHowHelp-error" className="mt-1 text-xs text-red-600">{fieldErrors.qHowHelp}</p>
                ) : null}
          </div>

          <div>
                <label className="block text-sm font-medium mb-1">Do you have any portfolio or experience to share? (you can attach links)</label>
            <textarea
                  value={form.qPortfolio}
                  onChange={(e) => update("qPortfolio", e.target.value)}
                  className="w-full min-h-24 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="Paste portfolio links or share relevant experience"
            />
          </div>

              <div>
                <label className="block text-sm font-medium mb-1">What would you like to get from UCAN? (e.g., experience, connections, new skills, etc.)</label>
                <textarea
                  value={form.qExpect}
                  onChange={(e) => update("qExpect", e.target.value)}
                  className="w-full min-h-24 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
                  placeholder="Tell us what you expect from joining UCAN"
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
                  ย้อนกลับ
                </button>
              ) : (
                <Link href="/" className="text-sm hover:underline">Back to home</Link>
              )}
            </div>
          <div className="flex items-center gap-3">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="rounded-[999px] px-6 h-11 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)]"
                >
                  Next
                </button>
              ) : (
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[999px] px-6 h-11 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] disabled:opacity-60"
            >
                  {submitting ? "Submitting..." : "Submit application"}
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


