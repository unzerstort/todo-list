/* start of drag n drop */
const cards = document.querySelectorAll('.card');
const containers = document.querySelectorAll('.container');

cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    })

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const card = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(card);
        } else {
            container.insertBefore(card, afterElement);
        }
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function onDragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function onDragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function onDrop(ev) {
    ev.preventDefault();

    const cardId = ev.dataTransfer.getData("text/plain");
    const card = document.getElementById(cardId);
    const newContainerId = ev.target.id;

    if (ev.target.className === "container") {
        ev.target.appendChild(document.getElementById(cardId));

    }

    if (card && newContainerId.startsWith("container-")) {
        ev.target.appendChild(card);
        const taskId = card.getAttribute("data-task-id");

        // Update the container_id in the database
        updateTaskContainer(taskId, newContainerId.split("-")[1]);
    }
}

function updateTaskContainer(taskId, newContainerId) {
    fetch(`${uri}/tasks/move`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: taskId, new_container_id: newContainerId })
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
/* end of drag n drop */

function addContainer(containerId) {
    const container = document.createElement("div");
    const containerDiv = document.querySelector(".container-div");

    container.classList.add("container");
    container.setAttribute("ondrop", "onDrop(event)");
    container.setAttribute("ondragover", "onDragOver(event)");

    if (containerId) {
        container.setAttribute("id", containerId);

        // Criação do botão de adicionar cartão
        const addButton = document.createElement("button");
        addButton.textContent = "Add a card";
        addButton.classList.add("add-card-button");
        addButton.addEventListener("click", () => {
            addButton.style.display = "none";
            const inputForm = createCardInputForm(containerId, addButton);
            container.appendChild(inputForm);
        });

        // Adiciona o container e depois o botão para garantir que o botão fique na parte inferior
        containerDiv.appendChild(container);
        container.appendChild(addButton);
    } else {
        console.error(`Não foi possível criar o container, ${containerId} não possui valor.`);
    }
}

/* Card forms */
function createCardInputForm(containerId, addButton) {
    const form = document.createElement("form");
    form.setAttribute("id", "create-card-form");
    form.classList.add("card-input-form");

    const titleInput = document.createElement("input");
    titleInput.classList.add("card-title-input");
    titleInput.placeholder = "Enter a title for this card...";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Add card";
    saveButton.classList.add("submit-card-button");
    saveButton.addEventListener("click", () => {
        const title = titleInput.value.trim();
        if (title) {
            addCardToDatabase(title, "", containerId);
            form.remove();
            addButton.style.display = "block";
        } else {
            alert("Card title cannot be empty.");
        }
    });

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "&times;";
    cancelButton.classList.add("cancel-card-button");
    cancelButton.addEventListener("click", () => {
        form.remove();
        addButton.style.display = "block";
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    form.appendChild(titleInput);
    form.appendChild(buttonContainer);

    return form;
}

function createEditCardForm(card, containerId) {
    const form = document.createElement("form");
    form.setAttribute("id", "edit-card-form");
    form.classList.add("card-input-form");

    const titleInput = document.createElement("input");
    titleInput.classList.add("card-title-input");
    titleInput.value = card.querySelector(".card-title").textContent; // Preenche o input com o título atual

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("submit-card-button");
    saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        if (title) {
            updateCardInDatabase(card.getAttribute("data-task-id"), title, "");
            form.remove();
            card.style.display = "block";
            card.querySelector(".card-title").textContent = title;
        } else {
            alert("Card title cannot be empty.");
        }
    });

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "&times;";
    cancelButton.classList.add("cancel-card-button");
    cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        form.remove();
        card.style.display = "block";
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    form.appendChild(titleInput);
    form.appendChild(buttonContainer);

    return form;
}

/* end of card forms */

function addCardToDatabase(title, description, containerId) {
    const taskData = {
        title: title,
        description: description,
        container_id: parseInt(containerId.split("-")[1])
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
                addCardToContainer(data.data.id, title, description, containerId);
            } else {
                console.error('Erro ao criar a tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function updateCardInDatabase(taskId, newTitle, newDescription, containerId) {
    // Função para atualizar o card no banco de dados
    const taskData = {
        id: taskId,
        title: newTitle,
        description: newDescription,
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

function addCardToContainer(taskId, title, description, containerId) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", true);
    card.setAttribute("ondragstart", "onDragStart(event)");
    card.setAttribute("data-task-id", taskId);
    card.setAttribute("id", `card-${taskId}`);
    // card.setAttribute("id", incrementNextElementId('card'));


    const content = cardContent(title, description);
    card.appendChild(content);

    const container = document.getElementById(containerId);

    if (container) {
        container.appendChild(card);
    } else {
        console.error(`Container with ID ${containerId} not found`);
    }

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.innerHTML = "Edit";
    editButton.addEventListener("click", () => {
        card.style.display = "none";
        const editForm = createEditCardForm(card, containerId);
        card.parentElement.insertBefore(editForm, card.nextSibling);
    });

    card.appendChild(editButton);
}

function cardContent(title, description) {
    const content = document.createElement("div");
    const contentTitle = document.createElement("h4");
    const contentDescription = document.createElement("p");

    content.classList.add("card-content");
    contentTitle.classList.add("card-title");
    contentDescription.classList.add("card-description");

    contentTitle.textContent = title;
    contentDescription.textContent = description;

    content.appendChild(contentTitle);
    content.appendChild(contentDescription);

    return content;
}

function incrementNextElementId(elementIdPrefix) {
    const elements = document.querySelectorAll(`[id^='${elementIdPrefix}']`);

    if (elements.length > 0) {
        let maxSuffix = 0;

        elements.forEach(element => {
            const id = element.id;
            const suffix = parseInt(id.split('-')[1]);

            if (!isNaN(suffix) && suffix > maxSuffix) {
                maxSuffix = suffix;
            }
        });

        const nextId = `${elementIdPrefix}-${maxSuffix + 1}`;
        return nextId;
    } else {
        return `${elementIdPrefix}-1`;
    }
}

var uri = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
    fetch(`${uri}/containers`)
        .then(response => response.json())
        .then(data => {
            if (data.message === "success") {
                renderContainers(data.data);

                return fetch(`${uri}/tasks`);
            } else {
                throw new Error('Erro ao obter containers');
            }
        })
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

    function renderContainers(containers) {
        containers.forEach(container => {
            const containerId = `container-${container.id}`;
            addContainer(containerId);
        });
    }

    function renderTasks(tasks) {
        tasks.forEach(task => {
            const containerId = `container-${task.container_id}`;
            addCardToContainer(task.id, task.title, task.description, containerId);
        });
    }
});
