"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { TextInput, TextArea, Select, SelectWithCustom, RoleCard } from "@/components/form";
import { useI18n } from "@/lib/i18n/context";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Faculties and majors (departments/programs) for KMUTT
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
  ],
  "Faculty of Science": [
    "Department of Mathematics",
    "Department of Microbiology",
    "Department of Chemistry",
    "Department of Physics",
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
  customFaculty: string;
  customMajor: string;
  email: string;
  phone: string;
  lineId: string;
  interests: string[];
  customInterest: string;
  reason: string;
  hasStartupExperience: string;
};

const YEAR_OPTIONS = ["1", "2", "3", "4"] as const;

const INTEREST_OPTIONS = [
  "ธุรกิจ (Business)",
  "การเงิน (Finance)",
  "เทคโนโลยี (Technology)",
  "AI (Artificial Intelligence)",
  "การตลาด (Marketing)",
  "การออกแบบ (Design)",
  "การพัฒนาผลิตภัณฑ์ (Product Development)",
  "Sustainability",
  "Social Impact",
] as const;

export default function StartupPlayground4Page() {
  const router = useRouter();
  const { messages } = useI18n();
  
  const [formData, setFormData] = useState<FormState>({
    fullname: "",
    nickname: "",
    year: "",
    faculty: "",
    major: "",
    customFaculty: "",
    customMajor: "",
    email: "",
    phone: "",
    lineId: "",
    interests: [],
    customInterest: "",
    reason: "",
    hasStartupExperience: "",
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    fullname: false,
    nickname: false,
    year: false,
    faculty: false,
    major: false,
    customFaculty: false,
    customMajor: false,
    email: false,
    phone: false,
    lineId: false,
    interests: false,
    customInterest: false,
    reason: false,
    hasStartupExperience: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const validateField = (key: keyof FormState): string => {
    const value = formData[key];

    // Required field validation
    const requiredFields: (keyof FormState)[] = [
      "fullname",
      "nickname",
      "year",
      "faculty",
      "major",
      "email",
      "phone",
      "lineId",
      "interests",
      "reason",
      "hasStartupExperience",
    ];

    // Special validation for interests array
    if (key === "interests" && Array.isArray(value) && value.length === 0) {
      return messages.startupPlayground.errors.interestsRequired;
    }

    if (requiredFields.includes(key) && !Array.isArray(value) && typeof value === "string" && !value.trim()) {
      return messages.startupPlayground.errors.required;
    }

    // Email validation
    if (key === "email" && typeof value === "string" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return messages.startupPlayground.errors.emailInvalid;
      }
    }

    // Phone validation
    if (key === "phone" && typeof value === "string" && value) {
      const phoneRegex = /^[0-9]{9,10}$/;
      if (!phoneRegex.test(value.replace(/[-\s]/g, ""))) {
        return messages.startupPlayground.errors.phoneInvalid;
      }
    }

    return "";
  };

  const validateForm = (): boolean => {
    const fields: (keyof FormState)[] = [
      "fullname",
      "nickname",
      "year",
      "faculty",
      "major",
      "email",
      "phone",
      "lineId",
      "interests",
      "reason",
      "hasStartupExperience",
    ];

    let isValid = true;
    const newTouched: Record<keyof FormState, boolean> = { ...touched };

    for (const field of fields) {
      newTouched[field] = true;
      if (validateField(field)) {
        isValid = false;
      }
    }

    setTouched(newTouched);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(messages.startupPlayground.errors.required);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the payload
      const interestsList = [...formData.interests];
      if (formData.customInterest.trim()) {
        interestsList.push(`${messages.startupPlayground.labels.customInterest}: ${formData.customInterest.trim()}`);
      }

      const payload = {
        fullname: formData.fullname,
        nickname: formData.nickname,
        faculty: formData.faculty === OTHER_VALUE ? formData.customFaculty : formData.faculty,
        major: formData.major === OTHER_VALUE ? formData.customMajor : formData.major,
        year: formData.year,
        email: formData.email,
        phone: formData.phone,
        lineId: formData.lineId,
        interests: interestsList.join(", "),
        reason: formData.reason,
        hasStartupExperience: formData.hasStartupExperience,
      };

      console.log("Submitting form:", payload);

      const response = await fetch("/api/startup-playground-4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit form");
      }

      // Navigate to success page
      router.push("/startup-playground-4/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(messages.startupPlayground.errors.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const majorOptions = formData.faculty
    ? (FACULTY_TO_MAJORS[formData.faculty] || []).map((m) => ({ value: m, label: m }))
    : [];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container-page px-4 py-3 flex items-center justify-end">
        <LanguageSwitcher />
      </div>
      <div className="container-page max-w-4xl mx-auto px-4 py-10 mb-20">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--color-accent-orange)] transition-colors mb-6"
        >
          <IoArrowBack className="text-xl" />
          <span>{messages.startupPlayground.backToHome}</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">{messages.startupPlayground.title}</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            {messages.startupPlayground.subtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 space-y-8">
          {/* Section 1: Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IoIosInformationCircleOutline className="text-2xl text-[var(--color-accent-orange)]" />
              <h2 className="text-2xl font-semibold">{messages.startupPlayground.section1Title}</h2>
            </div>

            <div className="space-y-4">
              <TextInput
                label={messages.startupPlayground.labels.fullname}
                value={formData.fullname}
                onChange={(value) => handleChange("fullname", value)}
                onBlur={() => handleBlur("fullname")}
                placeholder={messages.startupPlayground.placeholders.fullname}
                required
                error={validateField("fullname")}
                touched={touched.fullname}
              />

              <TextInput
                label={messages.startupPlayground.labels.nickname}
                value={formData.nickname}
                onChange={(value) => handleChange("nickname", value)}
                onBlur={() => handleBlur("nickname")}
                placeholder={messages.startupPlayground.placeholders.nickname}
                required
                error={validateField("nickname")}
                touched={touched.nickname}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <SelectWithCustom
                  label={messages.startupPlayground.labels.faculty}
                  value={formData.faculty}
                  onChange={(value) => {
                    handleChange("faculty", value);
                    handleChange("major", ""); // Reset major when faculty changes
                  }}
                  onBlur={() => handleBlur("faculty")}
                  options={Object.keys(FACULTY_TO_MAJORS).map((f) => ({ value: f, label: f }))}
                  placeholder={messages.startupPlayground.selectFaculty}
                  customValue={formData.customFaculty}
                  onCustomValueChange={(value) => handleChange("customFaculty", value)}
                  customPlaceholder={messages.startupPlayground.placeholders.faculty}
                  otherOptionValue={OTHER_VALUE}
                  otherOptionLabel={messages.startupPlayground.other}
                  required
                  error={validateField("faculty")}
                  touched={touched.faculty}
                />

                <SelectWithCustom
                  label={messages.startupPlayground.labels.major}
                  value={formData.major}
                  onChange={(value) => handleChange("major", value)}
                  onBlur={() => handleBlur("major")}
                  options={majorOptions}
                  placeholder={formData.faculty ? messages.startupPlayground.selectMajor : messages.startupPlayground.placeholders.selectFacultyFirst}
                  customValue={formData.customMajor}
                  onCustomValueChange={(value) => handleChange("customMajor", value)}
                  customPlaceholder={messages.startupPlayground.placeholders.major}
                  otherOptionValue={OTHER_VALUE}
                  otherOptionLabel={messages.startupPlayground.other}
                  required
                  error={validateField("major")}
                  touched={touched.major}
                />
              </div>

              <Select
                label={messages.startupPlayground.labels.year}
                value={formData.year}
                onChange={(value) => handleChange("year", value)}
                onBlur={() => handleBlur("year")}
                options={YEAR_OPTIONS.map((y) => ({ value: y, label: `${messages.startupPlayground.labels.year} ${y}` }))}
                placeholder={messages.startupPlayground.selectYear}
                required
                error={validateField("year")}
                touched={touched.year}
              />

              <TextInput
                label={messages.startupPlayground.labels.email}
                type="email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                onBlur={() => handleBlur("email")}
                placeholder={messages.startupPlayground.placeholders.email}
                required
                error={validateField("email")}
                touched={touched.email}
              />

              <TextInput
                label={messages.startupPlayground.labels.phone}
                type="tel"
                value={formData.phone}
                onChange={(value) => handleChange("phone", value)}
                onBlur={() => handleBlur("phone")}
                placeholder={messages.startupPlayground.placeholders.phone}
                required
                error={validateField("phone")}
                touched={touched.phone}
              />

              <TextInput
                label={messages.startupPlayground.labels.lineId}
                value={formData.lineId}
                onChange={(value) => handleChange("lineId", value)}
                onBlur={() => handleBlur("lineId")}
                placeholder={messages.startupPlayground.placeholders.lineId}
                required
                error={validateField("lineId")}
                touched={touched.lineId}
              />
            </div>
          </div>

          {/* Section 2: Interests and Motivation */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MdOutlineQuestionAnswer className="text-2xl text-[var(--color-accent-orange)]" />
              <h2 className="text-2xl font-semibold">{messages.startupPlayground.section2Title}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  {messages.startupPlayground.labels.interests}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {INTEREST_OPTIONS.map((interest) => (
                    <RoleCard
                      key={interest}
                      title={interest}
                      description=""
                      checked={formData.interests.includes(interest)}
                      onToggle={() => {
                        const newInterests = formData.interests.includes(interest)
                          ? formData.interests.filter((i) => i !== interest)
                          : [...formData.interests, interest];
                        handleChange("interests", newInterests);
                        handleBlur("interests");
                      }}
                      inputId={`interest-${interest.replace(/\s+/g, "-").toLowerCase()}`}
                    />
                  ))}
                </div>
                <TextInput
                  label={messages.startupPlayground.labels.customInterest}
                  value={formData.customInterest}
                  onChange={(value) => handleChange("customInterest", value)}
                  onBlur={() => handleBlur("customInterest")}
                  placeholder={messages.startupPlayground.placeholders.customInterest}
                />
                {touched.interests && validateField("interests") && (
                  <p className="mt-1 text-xs text-red-600">{validateField("interests")}</p>
                )}
              </div>

              <TextArea
                label={messages.startupPlayground.labels.reason}
                value={formData.reason}
                onChange={(value) => handleChange("reason", value)}
                onBlur={() => handleBlur("reason")}
                placeholder={messages.startupPlayground.placeholders.reason}
                required
                error={validateField("reason")}
                touched={touched.reason}
                minHeight="min-h-24"
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  {messages.startupPlayground.labels.hasStartupExperience}
                  <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasStartupExperience"
                      value="yes"
                      checked={formData.hasStartupExperience === "yes"}
                      onChange={(e) => handleChange("hasStartupExperience", e.target.value)}
                      onBlur={() => handleBlur("hasStartupExperience")}
                      className="w-4 h-4 text-[var(--color-accent-orange)] focus:ring-[var(--color-accent-orange)]"
                    />
                    <span>{messages.startupPlayground.experienceOptions.yes}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasStartupExperience"
                      value="no"
                      checked={formData.hasStartupExperience === "no"}
                      onChange={(e) => handleChange("hasStartupExperience", e.target.value)}
                      onBlur={() => handleBlur("hasStartupExperience")}
                      className="w-4 h-4 text-[var(--color-accent-orange)] focus:ring-[var(--color-accent-orange)]"
                    />
                    <span>{messages.startupPlayground.experienceOptions.no}</span>
                  </label>
                </div>
                {touched.hasStartupExperience && validateField("hasStartupExperience") && (
                  <p className="mt-1 text-xs text-red-600">{validateField("hasStartupExperience")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[999px] px-8 h-12 inline-flex items-center justify-center bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? messages.startupPlayground.submitting : messages.startupPlayground.submitButton}
            </button>
          </div>
        </form>

        {/* Note */}
        <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          <p>{messages.startupPlayground.footerNote}</p>
        </div>
      </div>

      <ContactFooter />
    </div>
  );
}
