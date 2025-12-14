
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FilesPage() {
    const router = useRouter();

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    const loadFiles = async () => {
        const res = await fetch("/api/files");
        const data = await res.json();
        setUploadedFiles(data);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (file) formData.append("file", file);

        await fetch("/api/files", {
            method: "POST",
            body: formData,
        });

        setShowForm(false);
        setTitle("");
        setDescription("");
        setFile(null);

        loadFiles();
        router.replace("/files");
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-black">Documents</h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                    + Create New
                </button>
            </div>

            {/* Saved Documents */}
            <h2 className="text-lg font-semibold text-black">Saved Documents</h2>

            {uploadedFiles.length === 0 ? (
                <p className="text-gray-500 italic">No documents found.</p>
            ) : (
                <div className="space-y-3">
                    {uploadedFiles.map((file: any) => (
                        <div
                            key={file.id}
                            className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 px-5 py-4 rounded-md shadow-sm"
                        >
                            {/* Thumbnail */}
                            <img
                                src={file.thumbnailUrl ?? "/placeholder.png"}
                                alt="thumbnail"
                                className="w-14 h-14 rounded object-cover border"
                            />

                            {/* Title */}
                            <a
                                href={`/files/${file.id}`}
                                className="text-gray-900 font-medium hover:underline flex-1"
                            >
                                {file.title}
                            </a>

                            {/* Delete */}
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm("Delete this document?")) {
                                        const res = await fetch(`/api/files/${file.id}`, {
                                            method: "DELETE",
                                        });

                                        if (res.ok) {
                                            loadFiles();
                                        } else {
                                            alert("Delete failed");
                                        }
                                    }
                                }}
                                className="text-red-600 text-sm hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">
                            Add New Document
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Title */}
                            <div>
                                <label className="block text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                                ></textarea>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-gray-700 mb-1">Upload File</label>

                                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-50">
                                    <input
                                        type="file"
                                        required
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-700 cursor-pointer 
                                        file:mr-4 file:py-2 file:px-4 
                                        file:rounded-md file:border-0 
                                        file:text-sm file:font-medium 
                                        file:bg-black file:text-white 
                                        hover:file:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-md border"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-900"
                                >
                                    Save
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}


