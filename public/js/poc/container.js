import { createContainerElement } from "./objectBuilder.js";

export function renderContainers(containers) {
    let containerList = [];
    containers.forEach(container => {
        const containerDiv = addContainer(container.id, container.name);

        containerList.push(containerDiv);
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
