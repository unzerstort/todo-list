import { createCardElement, createFormContainer } from "./poc/objectBuilder.js";
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
        const containerContent = document.getElementById(`${containerId}`);
        containerContent.appendChild(card);
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