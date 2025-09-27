"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    fullname: "",
    nickname: "",
    faculty: "",
    major: "",
    years: "",
    interests: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
    if (!form.fullname) errors.fullname = "Full name is required";
    return errors;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);
      const resp = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await resp.json().catch(() => ({}));
      if (resp.ok && json?.success) {
        setMessage("Thanks! Your registration has been submitted.");
        setForm({
          email: "",
          fullname: "",
          nickname: "",
          faculty: "",
          major: "",
          years: "",
          interests: "",
        });
        setTouched({});
        setFieldErrors({});
      } else {
        setError("Submission failed. Please try again later.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (

    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container-page max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">

          <h1 className="text-3xl font-semibold">Register</h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Join the UCAN community. Fill in your details below.
          </p>
        </div>

        <form onSubmit={onSubmit} className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email<span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-medium mb-1">Full name<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.fullname}
              onChange={(e) => update("fullname", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, fullname: true }))}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
              placeholder="Jane Doe"
              aria-invalid={Boolean(fieldErrors.fullname) || undefined}
              aria-describedby={fieldErrors.fullname ? "fullname-error" : undefined}
              required
            />
            {touched.fullname && fieldErrors.fullname ? (
              <p id="fullname-error" className="mt-1 text-xs text-red-600">{fieldErrors.fullname}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nickname</label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => update("nickname", e.target.value)}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Faculty</label>
            <input
              type="text"
              value={form.faculty}
              onChange={(e) => update("faculty", e.target.value)}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
              placeholder="e.g., Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Major</label>
            <input
              type="text"
              value={form.major}
              onChange={(e) => update("major", e.target.value)}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
              placeholder="e.g., Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Years</label>
            <select
              value={form.years}
              onChange={(e) => update("years", e.target.value)}
              className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
            >
              <option value="">Select year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
              <option value="Graduate">Graduate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interests</label>
            <textarea
              value={form.interests}
              onChange={(e) => update("interests", e.target.value)}
              className="w-full min-h-28 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-muted-50)] border border-[var(--color-muted-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]"
              placeholder="Tell us what you're excited about"
            />
          </div>

          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : null}
          {message ? (
            <div className="text-sm text-green-600">{message}</div>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[999px] px-6 h-11 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <Link href="/" className="text-sm hover:underline">Back to home</Link>
          </div>
        </form>
      </div>
    </div>
  );
}


