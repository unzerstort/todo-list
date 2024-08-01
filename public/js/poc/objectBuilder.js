import { onDrop, onDragOver, onDragStart } from "../draggable.js";

export function createContainerElement(containerId, containerName) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.addEventListener("dragover", onDragOver);
    container.addEventListener("drop", onDrop);
    container.setAttribute("id", `container-${containerId}`);

    const name = document.createElement("h3");
    name.classList.add("container-name");
    name.innerHTML = `${containerName}`;

    container.appendChild(name);

    return container;
}

export function createCardElement(taskId, title) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", true);
    card.addEventListener("dragstart", onDragStart);
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

export function createButtonElement(text, className, clickHandler) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
}