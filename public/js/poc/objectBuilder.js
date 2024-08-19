import { onDrop, onDragOver, onDragStart } from "../draggable.js";
import { deleteTaskFromDatabase, addTaskToDatabase, updateTaskOnDatabase, addContainerToDatabase, updateContainerOnDatabase, deleteContainerFromDatabase } from "./requests.js";
import { createInputElement } from "../utils.js";

export function createContainerElement(containerId, containerName) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.addEventListener("dragover", onDragOver);
    container.addEventListener("drop", onDrop);
    container.setAttribute("id", `container-${containerId}`);

    const containerHeader = createContainerHeader(containerName, containerId);
    container.appendChild(containerHeader);

    const containerContent = document.createElement("div");
    containerContent.classList.add("container-content");
    containerContent.setAttribute("id", `${containerId}`);
    container.appendChild(containerContent);
    

    const addCardBtn = createAddCardBtn(containerId);
    const footer = document.createElement("footer");
    footer.classList.add("container-footer");
    footer.appendChild(addCardBtn);
    
    container.appendChild(footer);

    return container;
}

export function createContainerHeader(containerName, containerId) {
    const containerHeader = document.createElement("div");
    containerHeader.classList.add("container-header");

    const name = document.createElement("h3");
    name.classList.add("container-name");
    name.innerHTML = `${containerName}`;
    
    const deleteContainerBtn = createButtonElement("&times;", "delete-container-btn", () => {
        if (containerId) {
            if (confirm("Are you sure you want to delete this list?")) {
                const container = document.getElementById(`container-${containerId}`);
                container.remove();
                deleteContainerFromDatabase(containerId);
            }
        } else {
            console.error(`Container with ID ${containerId} not found`);
        }
    });

    name.addEventListener("click", () => handleTitleClick(name, containerName, containerId));

    containerHeader.appendChild(name);
    containerHeader.appendChild(deleteContainerBtn);

    return containerHeader;
}

export function handleTitleClick(title, containerName, containerId) {
    const input = createInputElement("edit-container-name", "", `${containerName}`);
    title.replaceWith(input);
    input.focus();

    const saveNewName = () => {
        const newName = input.value.trim();
        if (newName) {
            containerName = newName;
            title.textContent = newName;
            updateContainerOnDatabase(containerId, newName);
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

export function createCardInputForm(containerId, addButton) {
    const { form, buttonContainer } = createFormContainer();
    form.setAttribute("id", "create-card-form");

    const titleInput = createInputElement("card-title-input", "Enter a title for this card...");

    const saveButton = createButtonElement("Add card", "submit-button", () => {
        const title = titleInput.value.trim();
        if (title) {
            addTaskToDatabase(title, containerId);
            form.remove();
            addButton.style.display = "block";
        } else {
            alert("Card title cannot be empty.");
        }
    });

    const cancelButton = createButtonElement("Cancel", "cancel-button", () => {
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
    
    const formDiv = document.createElement("div");
    formDiv.setAttribute("class", "card");
    
    const titleInput = createInputElement("card-title-input", '', card.querySelector(".card-title").textContent);
    
    const saveButton = createButtonElement("Save", "submit-button", (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        if (title) {
            updateTaskOnDatabase(card.getAttribute("data-task-id"), title);
            formDiv.remove();
            card.style.display = "block";
            card.querySelector(".card-title").textContent = title;
        } else {
            alert("Card title cannot be empty.");
        }
    });

    const cancelButton = createButtonElement("Cancel", "cancel-button", (e) => {
        e.preventDefault();
        formDiv.remove();
        card.style.display = "block";
    });
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    
    form.appendChild(titleInput);
    
    form.insertBefore(buttonContainer, titleInput.nextSibling);

    formDiv.appendChild(form);
    formDiv.appendChild(buttonContainer);

    return formDiv;
}

export function createEditButton(card) {
    const content = `<span class="material-symbols-outlined">edit</span>`;
    const editButton = createButtonElement(`${content}`, "edit-btn", () => {
        card.style.display = "none";
        const editForm = createEditCardForm(card);
        card.parentElement.insertBefore(editForm, card.nextSibling);
    })
    
    return editButton;
}

export function createDeleteButton(card, taskId) {
    const content = `<span class="material-symbols-outlined">delete</span>`;
    const deleteButton = createButtonElement(`${content}`, "delete-btn",  (e) => {
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

export function createAddCardBtn(containerId) {
    const addCardBtn = createButtonElement("&plus; Add a card", "add-card-button", () => {
        addCardBtn.style.display = "none";
        const inputForm = createCardInputForm(containerId, addCardBtn);
        addCardBtn.parentElement.appendChild(inputForm);
    })

    return addCardBtn;
}

export function createAddContainerBtn() {
    const addContainerBtn = createButtonElement("&plus; Add another list", "add-container-btn", () => {
        addContainerBtn.style.display = "none";
        const inputForm = createContainerInputForm(addContainerBtn);
        addContainerBtn.parentElement.appendChild(inputForm);
    })

    return addContainerBtn;
}

export function createContainerInputForm(addButton) {
    const { form, buttonContainer } = createFormContainer();
    form.setAttribute("id", "create-container-form");

    const titleInput = createInputElement("container-title-input", "Enter list title...");

    const saveButton = createButtonElement("Add list", "submit-button", () => {
        const title = titleInput.value.trim();
        if (title) {
            addContainerToDatabase(title);
            form.remove();
            addButton.style.display = "block";
        } else {
            alert("Container title cannot be empty.");
        }
    });

    const cancelButton = createButtonElement("Cancel", "cancel-button", () => {
        form.remove();
        addButton.style.display = "block";
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    form.appendChild(titleInput);

    form.insertBefore(buttonContainer, titleInput.nextSibling);

    return form;
}

export function createFormContainer() {
    const form = document.createElement("form");
    form.classList.add("input-form");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    form.appendChild(buttonContainer);

    return { form, buttonContainer };
}
