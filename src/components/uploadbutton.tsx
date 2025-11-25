"use client";

import { useState } from "react";

export default function SidebarUploadButton({
  onUploaded,
}: {
  onUploaded: (url: string, name: string, type: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await upload.json();
    setUploading(false);

    if (data.secure_url) {
      onUploaded(data.secure_url, file.name, file.type);
    }
  };

  return (
    <label className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      {uploading ? "Uploading..." : "Upload File"}
      <input type="file" className="hidden" onChange={handleUpload} />
    </label>
  );
}
