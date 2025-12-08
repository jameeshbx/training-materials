"use client";

export function setUserLocale(locale: "en" | "es") {
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    window.location.reload();
}
