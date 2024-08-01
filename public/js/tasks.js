import { createCardElement } from "./poc/objectBuilder.js";
import { updateTaskContainer } from "./poc/requests.js";

export function renderTasks(tasks) {
    let cardList = [];
    tasks.forEach(task => {
        const card = addCard(task.id, task.title, task.container_id);

        cardList.push(card);
    });

    return cardList;
}

export function addCard(taskId, taskTitle, containerId) {
    const card = createCardElement(taskId, taskTitle);
    card.dataset.containerId = containerId;

    const container = document.getElementById(`container-${containerId}`);
    
    if (container) {
        container.appendChild(card);
    } else {
        console.error(`Container with ID ${container} not found`);
        return;
    }

    return card;
}

export function moveCardToContainer(taskId, containerId) {
    const container = document.getElementById(`${containerId}`);

    if (container) {
        updateTaskContainer(taskId, containerId);
    } else {
        console.error(`Container with ID ${containerId} not found on moveCardToContainer()`);
        return;
    }
}

export function createFormContainer() {
    const form = document.createElement("form");
    form.classList.add("input-form");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    form.appendChild(buttonContainer);

    return { form, buttonContainer };
}

export function createCardInputForm(containerId, addButton) {
    const { form, buttonContainer } = createFormContainer();
    form.setAttribute("id", "create-card-form");

    const titleInput = createInputElement("card-title-input", "Enter a title for this card...");

    const saveButton = createButtonElement("Add card", "submit-button", () => {
        const title = titleInput.value.trim();
        if (title) {
            addCardToDatabase(title, containerId);
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

    form.insertBefore(buttonContainer, titleInput.nextSibling);

    return form;
}

export function createEditCardForm(card) {
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

    form.insertBefore(buttonContainer, titleInput.nextSibling);

    return form;
}