"use client";

import { useTranslations } from "next-intl";
import DocumentsUpload from "@/app/(dashboard)/documents/upload";

export default function DocumentsPage() {
  const t = useTranslations("DocumentsPage");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t("heading")}</h1>
      <DocumentsUpload />
    </div>
  );
}
