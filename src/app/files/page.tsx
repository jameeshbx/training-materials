"use client";

import { useEffect, useState } from "react";

type Attachment = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
};

function getIcon(type: string) {
  if (type.includes("image")) return "🖼️";
  if (type.includes("pdf")) return "📕";
  if (type.includes("word")) return "📄";
  if (type.includes("excel")) return "📊";
  if (type.includes("zip")) return "🗂️";
  return "📁";
}

type UploadButtonProps = {
  onUploaded: () => void;
};

function UploadButton({ onUploaded }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);

    const res = await fetch("/api/files", {
      method: "POST",
      body: form,
    });

    setUploading(false);
    if (res.ok) onUploaded();
  }

  return (
    <label className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      {uploading ? "Uploading..." : "Upload File"}
      <input type="file" className="hidden" onChange={handleChange} />
    </label>
  );
}

export default function FilesPage() {
  const [files, setFiles] = useState<Attachment[]>([]);

  async function loadFiles() {
    const res = await fetch("/api/files");
    setFiles(await res.json());
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function deleteFile(id: string) {
    if (!confirm("Delete this file?")) return;

    await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadFiles();
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-5 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">

        {/* Upload Card */}
        <div className="bg-[#171717] border border-gray-800/70 shadow-xl rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold">Upload Documents</h2>
          <p className="text-gray-400 text-sm mt-1 mb-4">
            Select a file to upload.
          </p>
          <UploadButton onUploaded={loadFiles} />
        </div>

        {/* Files Section */}
        <div className="bg-[#171717] border border-gray-600/70 shadow-xl rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col"
              >
                {/* File Row */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getIcon(file.fileType)}</span>
                  <p className="font-medium text-sm text-gray-200 truncate">
                    {file.fileName}
                  </p>
                </div>

                {/* Image Preview */}
                {file.fileType.includes("image") && (
                  <img
                    src={file.fileUrl}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-700 mt-3"
                  />
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteFile(file.id)}
                  className="mt-3 w-max px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
