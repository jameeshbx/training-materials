"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function changeLocale(locale: string) {
    startTransition(() => {
      document.cookie = `locale=${locale}; path=/`;
      router.refresh();
    });
  }

  return (
    <div className="flex justify-center gap-2 px-4 py-2">
      <button
        onClick={() => changeLocale("en")}
        className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
      >
        EN
      </button>

      <button
        onClick={() => changeLocale("es")}
        className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
      >
        ES
      </button>
    </div>
  );
}
