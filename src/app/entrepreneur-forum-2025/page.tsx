"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { TextInput } from "@/components/form";
import { useI18n } from "@/lib/i18n/context";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type FormState = {
  fullname: string;
  phone: string;
  email: string;
  affiliation: string;
  affiliationDetail: string;
  hasReadPosters: boolean;
};

type AffiliationOption = {
  value: string;
  labelTh: string;
  labelEn: string;
  needsDetail: boolean;
};

const AFFILIATION_OPTIONS: AffiliationOption[] = [
  {
    value: "kmutt_startup_playground",
    labelTh: "นักศึกษา มจธ. (KMUTT Startup Playground)",
    labelEn: "KMUTT Students (KMUTT Startup Playground)",
    needsDetail: false,
  },
  {
    value: "kmutt_personnel",
    labelTh: "นักศึกษาและบุคลากล มจธ.",
    labelEn: "KMUTT Students and Personnel",
    needsDetail: true,
  },
  {
    value: "club_tiger",
    labelTh: "ผู้ประกอบการ Club Tiger",
    labelEn: "Club Tiger Entrepreneurs",
    needsDetail: false,
  },
  {
    value: "thai_university_startup",
    labelTh: "สมาพันธ์สตาร์ทอัพนิสิตนักศึกษาแห่งประเทศไทย Thai University Startup Association",
    labelEn: "Thai University Startup Association",
    needsDetail: true,
  },
  {
    value: "midi",
    labelTh: "MIDI",
    labelEn: "MIDI",
    needsDetail: false,
  },
  {
    value: "staff",
    labelTh: "Staff",
    labelEn: "Staff",
    needsDetail: false,
  },
];

export default function EntrepreneurForum2025Page() {
  const router = useRouter();
  const { messages, locale } = useI18n();
  
  const [formData, setFormData] = useState<FormState>({
    fullname: "",
    phone: "",
    email: "",
    affiliation: "",
    affiliationDetail: "",
    hasReadPosters: false,
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    fullname: false,
    phone: false,
    email: false,
    affiliation: false,
    affiliationDetail: false,
    hasReadPosters: false,
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
      "phone",
      "email",
      "affiliation",
      "hasReadPosters",
    ];

    if (requiredFields.includes(key) && typeof value === "string" && !value.trim()) {
      return messages.entrepreneurForum.errors.required;
    }

    // Boolean field validation for hasReadPosters
    if (key === "hasReadPosters" && !formData.hasReadPosters) {
      return messages.entrepreneurForum.errors.required;
    }

    // Conditional validation for affiliationDetail
    if (key === "affiliationDetail") {
      const selectedOption = AFFILIATION_OPTIONS.find(opt => opt.value === formData.affiliation);
      
      if (selectedOption?.needsDetail && typeof value === "string" && !value.trim()) {
        return messages.entrepreneurForum.errors.required;
      }
    }

    // Email validation
    if (key === "email" && typeof value === "string" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return messages.entrepreneurForum.errors.emailInvalid;
      }
    }

    // Phone validation
    if (key === "phone" && typeof value === "string" && value) {
      const phoneRegex = /^[0-9]{9,10}$/;
      if (!phoneRegex.test(value.replace(/[-\s]/g, ""))) {
        return messages.entrepreneurForum.errors.phoneInvalid;
      }
    }

    return "";
  };

  const validateForm = (): boolean => {
    const fields: (keyof FormState)[] = [
      "fullname",
      "phone",
      "email",
      "affiliation",
      "affiliationDetail",
      "hasReadPosters",
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
      alert(messages.entrepreneurForum.errors.required);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the payload
      const selectedOption = AFFILIATION_OPTIONS.find(opt => opt.value === formData.affiliation);
      const affiliationLabel = selectedOption 
        ? (locale === "th" ? selectedOption.labelTh : selectedOption.labelEn)
        : formData.affiliation;
      
      const affiliation = formData.affiliationDetail.trim()
        ? `${affiliationLabel} (${formData.affiliationDetail})`
        : affiliationLabel;

      const payload = {
        fullname: formData.fullname,
        phone: formData.phone,
        email: formData.email,
        affiliation: affiliation,
      };

      console.log("Submitting form:", payload);

      const response = await fetch("/api/entrepreneur-forum-2025", {
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
      router.push("/entrepreneur-forum-2025/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(messages.entrepreneurForum.errors.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAffiliationOption = AFFILIATION_OPTIONS.find(opt => opt.value === formData.affiliation);
  const needsAffiliationDetail = selectedAffiliationOption?.needsDetail || false;

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
          <span>{messages.entrepreneurForum.backToHome}</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{messages.entrepreneurForum.title}</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            {messages.entrepreneurForum.subtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IoIosInformationCircleOutline className="text-2xl text-[var(--color-accent-orange)]" />
              <h2 className="text-2xl font-semibold">{messages.entrepreneurForum.section1Title}</h2>
            </div>

            <div className="space-y-4">
              <TextInput
                label={messages.entrepreneurForum.labels.fullname}
                value={formData.fullname}
                onChange={(value) => handleChange("fullname", value)}
                onBlur={() => handleBlur("fullname")}
                placeholder={messages.entrepreneurForum.placeholders.fullname}
                required
                error={validateField("fullname")}
                touched={touched.fullname}
              />

              <div>
                <h3 className="text-sm font-medium mb-3">{messages.entrepreneurForum.labels.contact}</h3>
                <div className="space-y-4">
                  <TextInput
                    label={messages.entrepreneurForum.labels.phone}
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => handleChange("phone", value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder={messages.entrepreneurForum.placeholders.phone}
                    required
                    error={validateField("phone")}
                    touched={touched.phone}
                  />

                  <TextInput
                    label={messages.entrepreneurForum.labels.email}
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleChange("email", value)}
                    onBlur={() => handleBlur("email")}
                    placeholder={messages.entrepreneurForum.placeholders.email}
                    required
                    error={validateField("email")}
                    touched={touched.email}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  {messages.entrepreneurForum.labels.affiliation}
                  <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {AFFILIATION_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="affiliation"
                        value={option.value}
                        checked={formData.affiliation === option.value}
                        onChange={(e) => {
                          handleChange("affiliation", e.target.value);
                          handleBlur("affiliation");
                          // Reset detail when changing affiliation
                          const newOption = AFFILIATION_OPTIONS.find(opt => opt.value === e.target.value);
                          if (!newOption?.needsDetail) {
                            handleChange("affiliationDetail", "");
                          }
                        }}
                        className="w-4 h-4 mt-0.5 text-[var(--color-accent-orange)] focus:ring-[var(--color-accent-orange)]"
                      />
                      <span className="text-sm">{locale === "th" ? option.labelTh : option.labelEn}</span>
                    </label>
                  ))}
                </div>
                {touched.affiliation && validateField("affiliation") && (
                  <p className="mt-1 text-xs text-red-600">{validateField("affiliation")}</p>
                )}

                {needsAffiliationDetail && (
                  <div className="mt-4">
                    <TextInput
                      label={messages.entrepreneurForum.labels.affiliationDetail}
                      value={formData.affiliationDetail}
                      onChange={(value) => handleChange("affiliationDetail", value)}
                      onBlur={() => handleBlur("affiliationDetail")}
                      placeholder={messages.entrepreneurForum.placeholders.affiliationDetail}
                      required
                      error={validateField("affiliationDetail")}
                      touched={touched.affiliationDetail}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Poster Confirmation Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IoIosInformationCircleOutline className="text-2xl text-[var(--color-accent-orange)]" />
              <h2 className="text-2xl font-semibold">{messages.entrepreneurForum.posterSection.title}</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                {messages.entrepreneurForum.posterSection.description}
              </p>

              {/* Poster Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                  <img
                    src="/images/register-forum-2025/poster1.jpg"
                    alt="Entrepreneur Forum 2025 Poster 1"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                  <img
                    src="/images/register-forum-2025/poster2.jpg"
                    alt="Entrepreneur Forum 2025 Poster 2"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-[var(--border)] hover:border-[var(--color-accent-orange)] transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasReadPosters}
                    onChange={(e) => {
                      handleChange("hasReadPosters", e.target.checked);
                      handleBlur("hasReadPosters");
                    }}
                    className="w-5 h-5 mt-0.5 text-[var(--color-accent-orange)] focus:ring-[var(--color-accent-orange)] rounded"
                  />
                  <span className="text-sm">
                    {messages.entrepreneurForum.posterSection.confirmation}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {touched.hasReadPosters && validateField("hasReadPosters") && (
                  <p className="mt-1 text-xs text-red-600">{validateField("hasReadPosters")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[var(--radius-lg)] px-6 h-12 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? messages.entrepreneurForum.submitting : messages.entrepreneurForum.submitButton}
            </button>
            <p className="text-xs text-[var(--muted-foreground)] text-center mt-3">
              {messages.entrepreneurForum.footerNote}
            </p>
          </div>
        </form>
      </div>
      <ContactFooter />
    </div>
  );
}
