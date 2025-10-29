"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { TextInput, TextArea, Select, SelectWithCustom } from "@/components/form";

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
  interests: string;
  reason: string;
  hasStartupExperience: string;
};

const YEAR_OPTIONS = ["1", "2", "3", "4"] as const;

export default function StartupPlayground4Page() {
  const router = useRouter();
  
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
    interests: "",
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

    if (requiredFields.includes(key) && !value.trim()) {
      return "กรุณากรอกข้อมูล";
    }

    // Email validation
    if (key === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "รูปแบบอีเมลไม่ถูกต้อง";
      }
    }

    // Phone validation
    if (key === "phone" && value) {
      const phoneRegex = /^[0-9]{9,10}$/;
      if (!phoneRegex.test(value.replace(/[-\s]/g, ""))) {
        return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
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
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);

    // Mock submission - just log the data
    console.log("Form submitted:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);

    // Navigate to success page
    router.push("/startup-playground-4/success");
  };

  const majorOptions = formData.faculty
    ? (FACULTY_TO_MAJORS[formData.faculty] || []).map((m) => ({ value: m, label: m }))
    : [];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container-page max-w-4xl mx-auto px-4 py-10 mb-20">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--color-accent-orange)] transition-colors mb-6"
        >
          <IoArrowBack className="text-xl" />
          <span>กลับสู่หน้าหลัก</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">KMUTT Startup Playground 4</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            ลงทะเบียนเข้าร่วมกิจกรรม
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 space-y-8">
          {/* Section 1: Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IoIosInformationCircleOutline className="text-2xl text-[var(--color-accent-orange)]" />
              <h2 className="text-2xl font-semibold">ข้อมูลพื้นฐาน</h2>
            </div>

            <div className="space-y-4">
              <TextInput
                label="ชื่อ-นามสกุล"
                value={formData.fullname}
                onChange={(value) => handleChange("fullname", value)}
                onBlur={() => handleBlur("fullname")}
                placeholder="กรอกชื่อ-นามสกุล"
                required
                error={validateField("fullname")}
                touched={touched.fullname}
              />

              <TextInput
                label="ชื่อเล่น"
                value={formData.nickname}
                onChange={(value) => handleChange("nickname", value)}
                onBlur={() => handleBlur("nickname")}
                placeholder="กรอกชื่อเล่น"
                required
                error={validateField("nickname")}
                touched={touched.nickname}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <SelectWithCustom
                  label="คณะ"
                  value={formData.faculty}
                  onChange={(value) => {
                    handleChange("faculty", value);
                    handleChange("major", ""); // Reset major when faculty changes
                  }}
                  onBlur={() => handleBlur("faculty")}
                  options={Object.keys(FACULTY_TO_MAJORS).map((f) => ({ value: f, label: f }))}
                  placeholder="เลือกคณะ"
                  customValue={formData.customFaculty}
                  onCustomValueChange={(value) => handleChange("customFaculty", value)}
                  customPlaceholder="ระบุคณะอื่นๆ"
                  otherOptionValue={OTHER_VALUE}
                  otherOptionLabel="อื่นๆ (โปรดระบุ)"
                  required
                  error={validateField("faculty")}
                  touched={touched.faculty}
                />

                <SelectWithCustom
                  label="สาขา"
                  value={formData.major}
                  onChange={(value) => handleChange("major", value)}
                  onBlur={() => handleBlur("major")}
                  options={majorOptions}
                  placeholder={formData.faculty ? "เลือกสาขา" : "เลือกคณะก่อน"}
                  customValue={formData.customMajor}
                  onCustomValueChange={(value) => handleChange("customMajor", value)}
                  customPlaceholder="ระบุสาขาอื่นๆ"
                  otherOptionValue={OTHER_VALUE}
                  otherOptionLabel="อื่นๆ (โปรดระบุ)"
                  required
                  error={validateField("major")}
                  touched={touched.major}
                />
              </div>

              <Select
                label="ชั้นปี"
                value={formData.year}
                onChange={(value) => handleChange("year", value)}
                onBlur={() => handleBlur("year")}
                options={YEAR_OPTIONS.map((y) => ({ value: y, label: `ปี ${y}` }))}
                placeholder="เลือกชั้นปี"
                required
                error={validateField("year")}
                touched={touched.year}
              />

              <TextInput
                label="อีเมล"
                type="email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                onBlur={() => handleBlur("email")}
                placeholder="example@mail.kmutt.ac.th"
                required
                error={validateField("email")}
                touched={touched.email}
              />

              <TextInput
                label="เบอร์โทรศัพท์"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleChange("phone", value)}
                onBlur={() => handleBlur("phone")}
                placeholder="0812345678"
                required
                error={validateField("phone")}
                touched={touched.phone}
              />

              <TextInput
                label="LINE ID"
                value={formData.lineId}
                onChange={(value) => handleChange("lineId", value)}
                onBlur={() => handleBlur("lineId")}
                placeholder="กรอก LINE ID"
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
              <h2 className="text-2xl font-semibold">ความสนใจและแรงบันดาลใจ</h2>
            </div>

            <div className="space-y-4">
              <TextArea
                label="สนใจเรื่องใดเป็นพิเศษ"
                value={formData.interests}
                onChange={(value) => handleChange("interests", value)}
                onBlur={() => handleBlur("interests")}
                placeholder="เช่น ธุรกิจ, การเงิน, เทคโนโลยี, AI, การตลาด ฯลฯ"
                required
                error={validateField("interests")}
                touched={touched.interests}
                minHeight="min-h-24"
              />

              <TextArea
                label="เหตุผลที่อยากเข้าร่วมกิจกรรมนี้"
                value={formData.reason}
                onChange={(value) => handleChange("reason", value)}
                onBlur={() => handleBlur("reason")}
                placeholder="กรอกเหตุผล 1-2 ประโยคพอ"
                required
                error={validateField("reason")}
                touched={touched.reason}
                minHeight="min-h-24"
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  เคยมีประสบการณ์ในการทำ Startup มาก่อนหรือไม่
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
                    <span>เคย</span>
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
                    <span>ไม่เคย</span>
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
              {isSubmitting ? "กำลังส่ง..." : "ลงทะเบียน"}
            </button>
          </div>
        </form>

        {/* Note */}
        <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          <p>ข้อมูลของคุณจะถูกใช้เพื่อการติดต่อและแจ้งข่าวสารเกี่ยวกับกิจกรรมเท่านั้น</p>
        </div>
      </div>

      <ContactFooter />
    </div>
  );
}
