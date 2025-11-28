"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, FileIcon, Upload } from "lucide-react";

export default function DocumentsUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  async function uploadToCloudinary(file: File) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  }

  async function handleUpload() {
    if (!file) return alert("Select a file");

    setLoading(true);

    const uploadedUrl = await uploadToCloudinary(file);

    await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,   // NEW
        title: title,          // NEW
        url: uploadedUrl,
      }),
    });

    setLoading(false);
    window.location.reload();
  }

  return (
    <Card className="p-4 max-w-xl">
      <h1 className="text-xl font-semibold mb-3">Upload Document</h1>

      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <Input
        type="text"
        placeholder="Enter title"
        className="mt-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Button onClick={handleUpload} className="mt-3">
        {loading ? "Uploading..." : "Upload"} <Upload className="w-4 h-4 ml-2" />
      </Button>

      <h2 className="text-lg font-semibold mt-6 mb-2">Uploaded Documents</h2>
      <DocumentsList />
    </Card>
  );
}

// =============================
// 📌 DOCUMENTS LIST COMPONENT
// =============================
function DocumentsList() {
  interface DocumentType {
    id: string;
    fileName?: string | null;
    title?: string | null;
    url: string;
  }

  const [docs, setDocs] = useState<DocumentType[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        return res.json();
      })
      .then((data) => setDocs(data))
      .catch((error) => {
        console.error("Error fetching documents:", error);
        setDocs([]);
      });
  }, []);

  const isImage = (fileName?: string | null) => {
    if (!fileName) return false;
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  };

  async function handleDelete(id: string) {
    if (!confirm("Delete this file?")) return;

    await fetch("/api/documents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setDocs((prev) => prev.filter((f) => f.id !== id));
  }

  if (docs.length === 0)
    return <p className="text-sm text-gray-500">No documents found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
      {docs.map((doc) => (
        <Card key={doc.id} className="p-3 relative">
          {isImage(doc.fileName) ? (
            <img
              src={doc.url}
              className="w-full h-40 object-cover rounded mb-2"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
              <FileIcon className="w-6 h-6 text-gray-600" />
            </div>
          )}

          {/* Show title (if any) OR fileName */}
          <p className="truncate font-medium">
            {doc.title ?? doc.fileName ?? "Untitled"}
          </p>

          <div className="flex justify-between mt-2">
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => window.open(doc.url, "_blank")}
            >
              Open
            </Button>

            <Button
              variant="secondary"
              className="text-red-600 border border-red-500 text-xs"
              onClick={() => handleDelete(doc.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
