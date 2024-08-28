import { moveCardToContainer } from "./tasks.js";

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

export function getDragAfterElement(container, y) {
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

export function onDragOver(ev) {
    ev.preventDefault();
}

export function onDragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

export function onDrop(ev) {
    ev.preventDefault();

    const cardId = ev.dataTransfer.getData("text/plain");
    const card = document.getElementById(cardId);
    const newContainerId = ev.target.id;

    if (card && newContainerId) {
        ev.target.appendChild(card);
        const taskId = card.getAttribute("data-task-id");

        // Update the container_id in the database

        moveCardToContainer(taskId, newContainerId);
    }
}