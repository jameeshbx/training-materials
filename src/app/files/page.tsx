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

    if (res.ok) {
      onUploaded();
    }
  }

  return (
    <label className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
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

  async function saveToDB(url: string, name: string, type: string) {
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: name,
        fileUrl: url,
        fileType: type,
      }),
    });

    loadFiles();
  }

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
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Upload Box */}
      <div className="bg-black text-white shadow-lg rounded-xl p-6 border">
        <h2 className="text-2xl font-semibold mb-3">Upload Your Documents</h2>
        <p className="text-gray-300 mb-4">Select a file to upload.</p>
        <UploadButton onUploaded={loadFiles} />
      </div>

      {/* Uploaded Files */}
      <div className="bg-white shadow-lg rounded-xl p-6 border text-black">
        <h2 className="text-xl font-semibold mb-5">Uploaded Files</h2>

        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getIcon(file.fileType)}</span>

                <div>
                  <p className="font-medium">{file.fileName}</p>

                  {file.fileType.includes("image") && (
                    <img
                      src={file.fileUrl}
                      alt="preview"
                      className="w-24 h-24 rounded object-cover mt-2 border"
                    />
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteFile(file.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
