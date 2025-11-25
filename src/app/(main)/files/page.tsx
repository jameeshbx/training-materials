

// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// export default function FileDetailPage() {
//     const { id } = useParams();
//     const router = useRouter();

//     const [file, setFile] = useState<any>(null);

//     const loadFile = async () => {
//         const res = await fetch(`/api/files/${id}`);
//         const data = await res.json();
//         setFile(data);
//     };

//     useEffect(() => {
//         loadFile();
//     }, []);

//     if (!file) {
//         return <p className="text-gray-500">Loading...</p>;
//     }

//     return (
//         <div className="max-w-3xl mx-auto space-y-6">

//             {/* Title */}
//             <h1 className="text-3xl font-bold text-green-700">
//                 {file.title}
//             </h1>

//             {/* Description */}
//             <div className="bg-white p-5 rounded-lg shadow border">
//                 <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
//                 <p className="text-gray-800">{file.description || "No description."}</p>
//             </div>

//             {/* Uploaded File + Thumbnail Side by Side */}
//             <div className="bg-white p-5 rounded-lg shadow border flex gap-6 items-start">

//                 {/* Thumbnail */}
//                 {file.thumbnailUrl && (
//                     <img
//                         src={file.thumbnailUrl}
//                         alt="thumbnail"
//                         className="w-32 h-32 object-cover rounded-lg border shadow-sm"
//                     />
//                 )}

//                 {/* File Details */}
//                 <div className="flex flex-col justify-between w-full">
//                     <div>
//                         <h2 className="text-lg font-semibold text-gray-700 mb-1">
//                             Uploaded File
//                         </h2>

//                         <p className="text-gray-600 text-sm mb-3">
//                             {file.fileName}
//                         </p>
//                     </div>

//                     {/* Open File Button */}
//                     <a
//                         href={file.url}
//                         target="_blank"
//                         className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-fit"
//                     >
//                         Open File
//                     </a>
//                 </div>

//             </div>

//             {/* Created Date */}
//             <div className="text-gray-500 text-sm">
//                 Created: {new Date(file.createdAt).toLocaleString()}
//             </div>

//             {/* Delete Button */}
//             <button
//                 onClick={async () => {
//                     if (confirm("Are you sure you want to delete this document?")) {
//                         await fetch(`/api/files/${id}`, { method: "DELETE" });
//                         router.push("/files");
//                     }
//                 }}
//                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//             >
//                 Delete Document
//             </button>

//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";

export default function FilesPage() {
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
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Documents</h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                    + Create New
                </button>
            </div>

            {/* Saved Documents */}
            <h2 className="text-lg font-semibold text-gray-700">Saved Documents</h2>

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


