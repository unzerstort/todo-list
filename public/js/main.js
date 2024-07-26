import {  moveCardToContainer, createFormContainer, createCardInputForm } from "./tasks.js";
import { createInputElement, createButtonElement, createContainerElement, createCardElement, createEditButton, createDeleteButton } from "./utils.js";


/* start of drag n drop */

/* end of drag n drop */

export function addCardToContainer(taskId, title, containerId) {
    const card = createCardElement(taskId, title);

    const container = document.getElementById(`container-${containerId}`);
    
    if (container) {
        container.appendChild(card);
    } else {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }
}

/* REQUESTS */
export function updateTaskContainer(taskId, newContainerId) {
    const idNum = parseInt(newContainerId.split("-")[1]);

    fetch(`${uri}/tasks/${taskId}/move`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: taskId, new_container_id: idNum })
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

export function updateContainerNameOnDatabase(containerId, containerName) {
    const data = { id: containerId, name: containerName };

    fetch(`${uri}/containers/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== "success") {
            console.error('Erro ao atualizar o nome do container.');
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

export function addCardToDatabase(title, containerId) {
    fetch(`${uri}/tasks/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, container_id: containerId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "success") {
                addCardToContainer(data.data.id, title, containerId);
            } else {
                console.error('Erro ao criar a tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

export function updateCardOnDatabase(taskId, newTitle, containerId) {
    const taskData = {
        id: taskId,
        title: newTitle,
        container_id: containerId
    };

    fetch(`${uri}/tasks/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message !== "success") {
                console.error('Erro ao atualizar a tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
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

// Função principal para inicializar o board
document.addEventListener("DOMContentLoaded", async () => {
    createAddContainerBtn();
    await fetchContainers();

    // Load tasks after containers are loaded to ensure containers exist
    const tasks = await fetchTasks();
    if (tasks) {
        renderTasks(tasks);
    }
});

export async function fetchContainers() {
    fetch(`${uri}/containers`)
        .then(response => response.json())
        .then(data => {
            if (data.message === "success") {
                renderContainers(data.data);
            } else {
                throw new Error('Erro ao obter containers');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

export async function fetchTasks() {
    fetch(`${uri}/tasks`)
        .then(response => response.json())
        .then(data => {
            if (data.message === "success") {
                renderTasks(data.data);
            } else {
                console.error('Erro ao obter tarefas');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

export function renderContainers(containers) {
    containers.forEach(container => addContainer(container.id, container.name));
}

export function renderTasks(tasks) {
    tasks.forEach(task => addCardToContainer(task.id, task.title, task.container_id));
}


/* END OF REQUESTS */