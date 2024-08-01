
var uri = "http://localhost:3000";


export async function fetchContainers() {
    return fetch(`${uri}/containers`)
}

export async function fetchTasks() {
    return fetch(`${uri}/tasks`);
}

export function updateTaskContainer(taskId, newContainerId) {
    const containerIdNum = parseInt(newContainerId.split("-")[1]);

    fetch(`${uri}/tasks/${taskId}/move`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: taskId, new_container_id: containerIdNum })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message !== "success") {
                console.error("Erro ao atualizar o container da tarefa");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
        });
}