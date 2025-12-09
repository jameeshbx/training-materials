"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    function switchLanguage(locale: "en" | "es") {
        const segments = pathname.split("/");

        // If no locale exists in URL, insert one
        if (segments[1] !== "en" && segments[1] !== "es") {
            segments.splice(1, 0, locale);
        } else {
            segments[1] = locale;
        }

        router.push(segments.join("/"));
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={() => switchLanguage("en")}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
                EN
            </button>

            <button
                onClick={() => switchLanguage("es")}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
                ES
            </button>
        </div>
    );
}
