import DocumentsUpload from "@/app/(dashboard)/documents/upload";

export default function DocumentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      <DocumentsUpload />
    </div>
  );
}
