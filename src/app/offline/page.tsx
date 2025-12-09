"use client";

import Link from "next/link";

export default function OfflinePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
            <h1 className="text-2xl font-bold">You are offline</h1>

            <p className="text-sm text-gray-600 max-w-md">
                It looks like you don’t have an internet connection right now.
                You can still access some pages you visited earlier.
            </p>

            <div className="flex gap-3 mt-4">
                <Link
                    href="/"
                    className="px-4 py-2 rounded-md border text-sm hover:bg-gray-100"
                >
                    Go to Home
                </Link>

                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-md border text-sm hover:bg-gray-100"
                >
                    Retry
                </button>
            </div>
        </main>
    );
}
