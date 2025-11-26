"use client";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
  setFile: (file: File | null) => void;
  title: string;
  setTitle: (title: string) => void;
  preview: string | null;
  loading: boolean;
  onUpload: () => void;
}

export default function UploadModal({
  open,
  onClose,
  file,
  setFile,
  title,
  setTitle,
  preview,
  loading,
  onUpload,
}: UploadModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-500">📤</span>
            Upload File
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>📝</span>
              File Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter a descriptive title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>📎</span>
              Choose File *
            </label>
            <input
              type="file"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                const picked = e.target.files?.[0];
                setFile(picked || null);
              }}
            />
          </div>

          {preview && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                <span>🖼️</span>
                Preview:
              </div>
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-48 object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              onClick={onClose}
              disabled={loading}
            >
              <span>❌</span>
              Cancel
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading || !file || !title.trim()}
              onClick={onUpload}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Upload File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}