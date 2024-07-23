var uri = "http://localhost:3000";

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
/* end of drag n drop */

/* UTILS */
function createInputElement(className, placeholder = '', value = '') {
    const input = document.createElement("input");
    input.classList.add(className);
    input.placeholder = placeholder;
    input.value = value;
    return input;
}

function createButtonElement(text, className, clickHandler) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
}

function createContainerElement(containerId) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.setAttribute("ondrop", "onDrop(event)");
    container.setAttribute("ondragover", "onDragOver(event)");
    container.setAttribute("id", `container-${containerId}`);

    return container;
}

function createCardElement(taskId, title, description) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", true);
    card.setAttribute("ondragstart", "onDragStart(event)");
    card.setAttribute("data-task-id", taskId);
    card.setAttribute("id", `card-${taskId}`);

    const content = cardContent(title, description);
    card.appendChild(content);

    return card;
}
/* END OF UTILS */

/* CARDS */

function createEditButton(card, containerId) {
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.innerHTML = "Edit";
    editButton.addEventListener("click", () => {
        card.style.display = "none";
        const editForm = createEditCardForm(card, containerId);
        card.parentElement.insertBefore(editForm, card.nextSibling);
    });
    return editButton;
}

function createDeleteButton(card, taskId) {
    const deleteButton = createButtonElement("Delete", "delete-btn",  (e) => {
        if (confirm("Are you sure you want to delete this card?")) {
            // Remove card from DOM
            card.remove();

            // Remove task from database
            deleteTaskFromDatabase(taskId);
        }
    });

    return deleteButton;
}

function addCardToContainer(taskId, title, description, containerId) {
    const card = createCardElement(taskId, title, description);

    const container = document.getElementById(containerId);
    if (container) {
        container.appendChild(card);
    } else {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    const editButton = createEditButton(card, containerId);
    card.appendChild(editButton);

    const deleteButton = createDeleteButton(card, taskId);
    card.appendChild(deleteButton);
}

function cardContent(title, description) {
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("card-content");

    const titleElement = document.createElement("h4");
    titleElement.classList.add("card-title");
    titleElement.textContent = title;

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("card-description");
    descriptionElement.textContent = description;

    contentDiv.appendChild(titleElement);
    contentDiv.appendChild(descriptionElement);

    return contentDiv;
}

function createFormContainer() {
    const form = document.createElement("form");
    form.classList.add("input-form");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    form.appendChild(buttonContainer);

    return { form, buttonContainer };
}

function createCardInputForm(containerId, addButton) {
    const { form, buttonContainer } = createFormContainer();
    form.setAttribute("id", "create-card-form");

    const titleInput = createInputElement("card-title-input", "Enter a title for this card...");

    const saveButton = createButtonElement("Add card", "submit-button", () => {
        const title = titleInput.value.trim();
        if (title) {
            addCardToDatabase(title, "", containerId);
            form.remove();
            addButton.style.display = "block";
        } else {
            alert("Card title cannot be empty.");
        }
    });

    const cancelButton = createButtonElement("&times;", "cancel-button", () => {
        form.remove();
        addButton.style.display = "block";
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    form.appendChild(titleInput);

    return form;
}

function createEditCardForm(card) {
    const { form, buttonContainer } = createFormContainer();
    form.setAttribute("id", "edit-card-form");

    const titleInput = createInputElement("card-title-input", '', card.querySelector(".card-title").textContent);

    const saveButton = createButtonElement("Save", "submit-button", (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        if (title) {
            updateCardOnDatabase(card.getAttribute("data-task-id"), title, "");
            form.remove();
            card.style.display = "block";
            card.querySelector(".card-title").textContent = title;
        } else {
            alert("Card title cannot be empty.");
        }
    });

    const cancelButton = createButtonElement("&times;", "cancel-button", (e) => {
        e.preventDefault();
        form.remove();
        card.style.display = "block";
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    form.appendChild(titleInput);

    return form;
}

/* END OF CARDS */

/* CONTAINERS */

function createAddContainerBtn() {
    const addContainerButton = createButtonElement("Add a new list", "add-container-btn", () => {
        addContainerButton.style.display = "none";
        const inputForm = createContainerInputForm(addContainerButton);
        addContainerButton.parentElement.appendChild(inputForm);
    })

    const containerBtnDiv = document.querySelector("#container-btn-div");
    containerBtnDiv.appendChild(addContainerButton);
    
    return addContainerButton;
}

function createContainerInputForm(addContainerButton) {
    const { form, buttonContainer } = createFormContainer();
    form.setAttribute("id", "create-container-form");

    const nameInput = createInputElement("container-title-input", "Enter list title...");

    const saveButton = createButtonElement("Add list", "submit-button", () => {
        const name = nameInput.value.trim();
        if (name) {
            addContainerToDatabase(name);
            form.remove();
            addContainerButton.style.display = "block";
        } else {
            alert("List title cannot be empty.");
        }
    });

    const cancelButton = createButtonElement("&times;", "cancel-button", (e) => {
        e.preventDefault();
        form.remove();
        addContainerButton.style.display = "block";
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    form.appendChild(nameInput);

    return form;
}

function createContainerTitle(containerName, containerId) {
    const title = document.createElement("h3");
    title.textContent = containerName;
    title.classList.add("container-title");

    title.addEventListener("click", () => handleTitleClick(title, containerName, containerId));

    return title;
}

function handleTitleClick(title, containerName, containerId) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = containerName;
    input.classList.add("edit-container-name");
    
    title.replaceWith(input);
    input.focus();

    const saveNewName = () => {
        const newName = input.value.trim();
        if (newName) {
            containerName = newName;
            title.textContent = newName;
            updateContainerNameOnDatabase(containerId, newName);
        }
        input.replaceWith(title);
    };

    input.addEventListener("blur", saveNewName);
    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            saveNewName();
        }
    });
}

function createAddCardButton(containerId) {
    const addButton = document.createElement("button");
    addButton.textContent = "Add a card";
    addButton.classList.add("add-card-button");

    addButton.addEventListener("click", () => {
        addButton.style.display = "none";
        const inputForm = createCardInputForm(containerId, addButton);
        addButton.parentElement.appendChild(inputForm);
    });

    return addButton;
}

function addContainer(containerId, containerName) {
    if (!containerId || !containerName) {
        console.error(`Não foi possível criar o container, ${containerId} ou ${containerName} não possui valor.`);
        return;
    }

    const containerDiv = document.querySelector(".container-div");
    const container = createContainerElement(containerId);
    const title = createContainerTitle(containerName, containerId);
    const addButton = createAddCardButton(containerId);

    container.appendChild(title);
    container.appendChild(addButton);
    containerDiv.appendChild(container);
}
/* END OF CONTAINERS */

/* REQUESTS */
function updateTaskContainer(taskId, newContainerId) {
    fetch(`${uri}/tasks/${taskId}/move`, {
        method: "PATCH",
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

function updateContainerNameOnDatabase(containerId, containerName) {
    const idNum = parseInt(containerId.split("-")[1]);
    const data = { id: idNum, name: containerName };

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

function addContainerToDatabase(name) {
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

function deleteContainerFromDatabase(containerId) {
    fetch(`${uri}/containers/${containerId}`, {
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

function addCardToDatabase(title, description, containerId) {
    const taskData = {
        title: title,
        description: description,
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
                addCardToContainer(data.data.id, title, description, containerId);
            } else {
                console.error('Erro ao criar a tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function updateCardOnDatabase(taskId, newTitle, newDescription, containerId) {
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

function deleteTaskFromDatabase(taskId) {
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

createAddContainerBtn();
fetchContainers();
fetchTasks();

function fetchContainers() {
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

function fetchTasks() {
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

function renderContainers(containers) {
    containers.forEach(container => {
        const containerId = container.id;
        const containerName = `${container.name}`
        addContainer(containerId, containerName);
    });
}

function renderTasks(tasks) {
    tasks.forEach(task => {
        const containerId = `container-${task.container_id}`;
        addCardToContainer(task.id, task.title, task.description, containerId);
    });
}

/* END OF REQUESTS */