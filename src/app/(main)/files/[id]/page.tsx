
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function FileDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [file, setFile] = useState<any>(null);

    const loadFile = async () => {
        const res = await fetch(`/api/files/${id}`);
        const data = await res.json();
        setFile(data);
    };

    
    useEffect(() => {
        if (!id) return; // <-- wait until id is ready
        loadFile();
    }, [id]);

    if (!file) {
        return <p className="text-gray-500">Loading...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Title */}
            <h1 className="text-3xl font-bold text-green-700">
                {file.title}
            </h1>

            {/* Description */}
            <div className="bg-white p-5 rounded-lg shadow border">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
                <p className="text-gray-800">{file.description || "No description."}</p>
            </div>

            {/* Uploaded File + Thumbnail Side by Side */}
            <div className="bg-white p-5 rounded-lg shadow border flex gap-6 items-start">

                {/* Thumbnail */}
                {file.thumbnailUrl && (
                    <img
                        src={file.thumbnailUrl}
                        alt="thumbnail"
                        className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                    />
                )}

                {/* File Details */}
                <div className="flex flex-col justify-between w-full">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-1">
                            Uploaded File
                        </h2>

                        <p className="text-gray-600 text-sm mb-3">
                            {file.fileName}
                        </p>
                    </div>

                    {/* Open File Button */}
                    <a
                        href={file.url}
                        target="_blank"
                        className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-fit"
                    >
                        Open File
                    </a>
                </div>

            </div>

            {/* Created Date */}
            <div className="text-gray-500 text-sm">
                Created: {new Date(file.createdAt).toLocaleString()}
            </div>

            {/* Delete Button */}
            <button
                onClick={async () => {
                    if (confirm("Are you sure you want to delete this document?")) {
                        await fetch(`/api/files/${id}`, { method: "DELETE" });
                        router.push("/files");
                    }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Delete Document
            </button>

        </div>
    );
}

