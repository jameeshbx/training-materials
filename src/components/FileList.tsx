export default function FileList({
  files,
  onDeleteClick,
  getFileIcon,
  pagination,
}: any) {

  if (!files.length)
    return <p className="text-center py-10 text-gray-500">📂 No files yet</p>;

  return (
    <>
      <div className="divide-y">
        {files.map((file: any) => (
          <div key={file.id} className="p-4 flex justify-between items-center">
            <div className="flex gap-4 items-center min-w-0">
              <div className="text-2xl bg-blue-50 p-3 rounded-lg">
                {getFileIcon(file.url)}
              </div>
              <p className="truncate font-semibold">{file.name}</p>
            </div>

            <div className="flex gap-3">
              <a href={file.url} target="_blank" rel="noopener" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                👁️ View
              </a>
              <button onClick={() => onDeleteClick(file)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination}
    </>
  );
}
