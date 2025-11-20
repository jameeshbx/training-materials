export async function getTasks() {
    const res = await fetch("/api/tasks");
    return res.json();
}

export async function createTask(data: any) {
    const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateTask(data: any) {
    const res = await fetch("/api/tasks", {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
    });
    return res.json();
}
