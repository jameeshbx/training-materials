import { db } from "@/lib/db";

export default async function TeamsPage() {
  const team = await db.team.findFirst();

  if (!team) {
    return <p>No team found</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">{team.name}</h1>
      <p className="text-gray-400 mt-3">Team Members & tasks will show here.</p>
    </div>
  );
}
