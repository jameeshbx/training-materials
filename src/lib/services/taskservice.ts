
// ================================
// GET TASKS (Search + Pagination)
// ================================
export async function getTasks({
    search = "",
    page = 1,
    limit = 8
} = {}) {
    const res = await fetch(
        `/api/tasks?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
    );

    return res.json();
}

// ===============
// CREATE TASK
// ===============
export async function createTask(data: any) {
    const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

// ===============
// UPDATE TASK
// ===============
export async function updateTask(data: any) {
    const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

// ===============
// DELETE TASK
// ===============
export async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
    });

    return res.json();
}
