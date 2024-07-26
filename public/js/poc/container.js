
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
    
    const h3 = document.createElement("h3"); //TODO: mover criação de h3 p objectBuilder
    h3.innerHTML = containerName;
    containerDiv.appendChild(h3);

    return containerDiv;
}
