export async function emitActivity(teamId: string, activity: any) {
  try {
    await fetch("http://localhost:4000/emit-activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamId, activity }),
    });
  } catch (err) {
    console.error("Failed to emit activity", err);
  }
}
