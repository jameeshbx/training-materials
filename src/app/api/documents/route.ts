import { db } from "@/lib/db";

export async function GET() {
  const docs = await db.document.findMany({
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const { title, fileName, url } = await req.json();

  if (!url) {
    return new Response(JSON.stringify({ error: "url is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const doc = await db.document.create({
    // cast to any because generated Prisma types in this workspace
    // may differ; runtime model uses these properties so cast is safe here
    data: ({
      title: title ?? null,
      fileName: fileName ?? null,
      url,
    } as any),
  });

  return new Response(JSON.stringify(doc), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}


export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await db.document.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
