// export async function DELETE(_, { params }) {
//   const session = await getServerSession(authOptions);

//   if (session.user.role !== "ADMIN")
//     return Response.json({ error: "Unauthorized" }, { status: 403 });

//   await prisma.auditLog.delete({
//     where: { id: params.id }
//   });

//   return Response.json({ success: true });
// }
