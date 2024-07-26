import { } from ""

export function createInputElement(className, placeholder = '', value = '') {
    const input = document.createElement("input");
    input.classList.add(className);
    input.placeholder = placeholder;
    input.value = value;
    return input;
}

export function createButtonElement(text, className, clickHandler) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
}

export function createContainerElement(containerId) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.setAttribute("ondrop", "onDrop(event)");
    container.setAttribute("ondragover", "onDragOver(event)");
    container.setAttribute("id", `container-${containerId}`);

    return container;
}

export function createCardElement(taskId, title) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", true);
    card.setAttribute("ondragstart", "onDragStart(event)");
    card.setAttribute("data-task-id", taskId);
    card.setAttribute("id", `card-${taskId}`);

    const cardTitle = document.createElement("h4");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = title;

    const editButton = createEditButton(card);
    const deleteButton = createDeleteButton(card, taskId);

    card.appendChild(cardTitle);
    card.appendChild(editButton);
    card.appendChild(deleteButton);

    return card;
}

export function createEditButton(card) {
    const editButton = createButtonElement("Edit", "edit-btn", () => {
        card.style.display = "none";
        const editForm = createEditCardForm(card);
        card.parentElement.insertBefore(editForm, card.nextSibling);
    })
    
    return editButton;
}

export function createDeleteButton(card, taskId) {
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