import { createAddContainerBtn, createContainerElement } from "./objectBuilder.js";
import { createInputElement } from "../utils.js";

export function renderContainers(containers) {
    let containerList = [];
    containers.forEach(container => {
        const containerElement = addContainer(container.id, container.name);

        containerList.push(containerElement);
    });

    return containerList;
}

export function addContainer(containerId, containerName) {
    if (!containerId || !containerName) {
        console.error(`Não foi possível criar o container, ${containerId} ou ${containerName} não possui valor.`);
        return;
    }

    const containerDiv = document.querySelector(".container-div");
    const container = createContainerElement(containerId, containerName);

    containerDiv.appendChild(container);

    return container;
}

export function renderNewContainerBtn() {
    const addContainerBtn = createAddContainerBtn();
    const addContainerBtnDiv = document.querySelector(".container-btn-div");
    addContainerBtnDiv.appendChild(addContainerBtn);

    return addContainerBtnDiv;
}

document.addEventListener("DOMContentLoaded", () => {
    renderNewContainerBtn();

})