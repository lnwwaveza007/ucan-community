import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backoffice | UCAN Community",
};

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


