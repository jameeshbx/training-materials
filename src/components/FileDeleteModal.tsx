"use client";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  createdAt?: string;
}

interface DeleteConfirmModalProps {
  show: boolean;
  file: UploadedFile | null;
  deletingId: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
  getFileIcon: (fileUrl: string) => string;
}

export default function DeleteConfirmModal({
  show,
  file,
  deletingId,
  onCancel,
  onConfirm,
  getFileIcon,
}: DeleteConfirmModalProps) {
  if (!show || !file) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            Confirm Delete
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="text-3xl p-3 bg-white rounded-lg">
              {getFileIcon(file.url)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {file.name}
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this file?
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
            <span>🚫</span>
            This action cannot be undone. The file will be permanently removed.
          </p>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              onClick={onCancel}
              disabled={deletingId === file.id}
            >
              <span>↩️</span>
              Cancel
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={deletingId === file.id}
              onClick={() => onConfirm(file.id)}
            >
              {deletingId === file.id ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <span>🗑️</span>
                  Delete File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}