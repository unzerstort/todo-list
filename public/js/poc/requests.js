import { addCard } from "../tasks.js";
import { addContainer } from "./container.js";

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

export function deleteTaskFromDatabase(taskId) {
    fetch(`${uri}/tasks/delete/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== "success") {
            console.error('Erro ao deletar a tarefa.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

export function updateTaskOnDatabase(taskId, newTitle, containerId) {
    const taskData = {
        id: taskId,
        title: newTitle,
        container_id: containerId
    };

    fetch(`${uri}/tasks/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message !== "success") {
                console.error('Erro ao atualizar a tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

export function addTaskToDatabase(title, containerId) {
    const taskData = {
        title: title,
        container_id: containerId
    };

    fetch(`${uri}/tasks/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "success") {
                addCard(data.data.id, title, containerId);
            } else {
                console.error('Erro ao criar a tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

export function addContainerToDatabase(name) {
    const data = { name: name };

    fetch(`${uri}/containers/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "success") {
                addContainer(data.data.id, name);
            } else {
                console.error('Erro ao criar o container');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

export function updateContainerOnDatabase(containerId, containerName) {
    const data = { id: containerId, name: containerName };

    fetch(`${uri}/containers/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== "success") {
            console.log(containerName)
            console.error('Erro ao atualizar o nome do container.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

export function deleteContainerFromDatabase(containerId) {
    fetch(`${uri}/containers/delete/${containerId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar o container e suas tasks.');
        }
        return response.json();
    })
    .then(data => {
        if (data.message === "success") {
            console.log(`Container ${containerId} e suas tasks foram deletados com sucesso.`);
        } else {
            console.error('Erro ao deletar o container e suas tasks:', data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}