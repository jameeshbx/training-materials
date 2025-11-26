"use client";

import { useState, useEffect } from "react";
import UploadModal from "../../../components/FileUploadModal";
import DeleteConfirmModal from "../../../components/FileDeleteModal";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  createdAt?: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; file: UploadedFile | null }>({
    show: false,
    file: null,
  });

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/uploads");
      const data = await res.json();
      console.log(data,"Fetched files data");
      setUploadedFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      alert("Please enter a title and choose a file!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_PRESET!);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();

      await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          url: cloudData.secure_url,
        }),
      });

      setPreview(null);
      setTitle("");
      setFile(null);
      setOpenModal(false);
      await fetchFiles();
      setCurrentPage(1);
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/uploads?id=${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete file");
      }
      
      await fetchFiles();
      
      const totalPages = Math.ceil((uploadedFiles.length - 1) / filesPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(Math.max(1, totalPages));
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
      setDeleteConfirm({ show: false, file: null });
    }
  };

  const showDeleteConfirm = (file: UploadedFile) => {
    setDeleteConfirm({ show: true, file });
  };

  // Update preview when file changes
  useEffect(() => {
    if (file?.type.startsWith("image")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [file]);

  // Pagination logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = uploadedFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(uploadedFiles.length / filesPerPage);

  const getFileIcon = (fileUrl: string) => {
    const ext = fileUrl.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      pdf: "📑",doc: "📄",  docx: "📄",  txt: "📝",  zip: "📦",  rar: "📦",  jpg: "🖼️",jpeg: "🖼️",png: "🖼️",  gif: "🖼️",  svg: "🖼️",  mp4: "🎥",
      mov: "🎥", avi: "🎥", mp3: "🎵", wav: "🎵", xls: "📊", xlsx: "📊", ppt: "📊", pptx: "📊",};
    return icons[ext || ""] || "📁";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  📂
                </div>
                File Manager
              </h1>
              <p className="text-gray-600 mt-2">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              onClick={() => setOpenModal(true)}
            >
              <span className="text-lg">📤</span>
              Upload File
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {currentFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No files uploaded yet</h3>
              <p className="text-gray-500 mb-4">Start by uploading your first file</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                onClick={() => setOpenModal(true)}
              >
                <span>📤</span>
                Upload File
              </button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {currentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-2xl p-3 bg-blue-50 rounded-lg">
                          {getFileIcon(file.url)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {file.name}
                          </h3>
                          {file.createdAt && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <span>📅</span>
                              Uploaded {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          <span>👁️</span>
                          View
                        </a>
                        <button
                          onClick={() => showDeleteConfirm(file)}
                          disabled={deletingId === file.id}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          <span>🗑️</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <span>📊</span>
                      Showing {indexOfFirstFile + 1} to {Math.min(indexOfLastFile, uploadedFiles.length)} of{" "}
                      {uploadedFiles.length} files
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <span>⬅️</span>
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        Next
                        <span>➡️</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        file={file}
        setFile={setFile}
        title={title}
        setTitle={setTitle}
        preview={preview}
        loading={loading}
        onUpload={handleUpload}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={deleteConfirm.show}
        file={deleteConfirm.file}
        deletingId={deletingId}
        onCancel={() => setDeleteConfirm({ show: false, file: null })}
        onConfirm={handleDelete}
        getFileIcon={getFileIcon}
      />
    </div>
  );
}