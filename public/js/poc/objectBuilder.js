
export function createContainerElement(containerId, containerName) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.setAttribute("ondrop", "onDrop(event)");
    container.setAttribute("ondragover", "onDragOver(event)");
    container.setAttribute("id", `container-${containerId}`);

    const name = document.createElement("h3");
    name.classList.add("container-name");
    name.innerHTML = `${containerName}`;

    container.appendChild(name);

    return container;
}