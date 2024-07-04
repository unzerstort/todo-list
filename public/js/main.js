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

    let data = ev.dataTransfer.getData("text");

    if (ev.target.className === "container") {
        ev.target.appendChild(document.getElementById(data));

    }
}

/* end of drag n drop */

function addCard() {
    const newDiv = document.createElement("div");
    newDiv.classList.add("card");
    newDiv.setAttribute("draggable", true);
    newDiv.setAttribute("ondragstart", "onDragStart(event)");
    newDiv.setAttribute("id", incrementNextElementId('card'));
    
    const container = document.getElementById("container-1");
    container.appendChild(newDiv);
}

function incrementNextElementId(elementIdPrefix) {
    const elements = document.querySelectorAll(`[id^='${elementIdPrefix}']`);

    if (elements.length > 0) {
        let maxSuffix = 0;

        elements.forEach(element => {
            const id = element.id;
            const suffix = parseInt(id.split('-')[1]);

            if(!isNaN(suffix) && suffix > maxSuffix) {
                maxSuffix = suffix;
            }
        });
        
        const nextId = `${elementIdPrefix}-${maxSuffix + 1}`;
        return nextId;
    } else {
        return `${elementIdPrefix}-1`;
    }
}

// const taskModal = document.getElementById('task-modal');
// const taskModalBtn = document.getElementById('task-modal-btn');
// const span = document.getElementsByClassName("close")[0];

// taskModalBtn.onclick = function () {
//     taskModal.style.display = "block";
// }

// span.onclick = function () {
//     taskModal.style.display = "none";
// }

// window.onclick = function (event) {
//     if (event.target == taskModal) {
//         taskModal.style.display = "none";
//     }
// } 