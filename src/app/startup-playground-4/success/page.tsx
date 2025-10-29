"use client";

import Link from "next/link";
import ContactFooter from "@/components/ContactFooter";
import { IoCheckmarkCircle } from "react-icons/io5";
import { motion } from "framer-motion";

export default function StartupPlayground4SuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container-page max-w-2xl mx-auto px-4 py-10 mb-30 h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 space-y-6 text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold">ลงทะเบียนสำเร็จ!</h1>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <IoCheckmarkCircle className="text-[var(--color-accent-orange)] text-4xl" size={80} />
            <p className="text-[var(--muted-foreground)]">
              ขอบคุณที่สมัครเข้าร่วม KMUTT Startup Playground 4
              <br /><br />
              <span className="font-bold">ทีมงานจะติดต่อกลับไปเพื่อแจ้งรายละเอียดเพิ่มเติมผ่านช่องทางที่คุณให้ไว้</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/"
                className="rounded-[999px] px-6 h-11 inline-flex items-center justify-center bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)]"
              >
                กลับสู่หน้าหลัก
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <ContactFooter />
    </div>
  );
}
