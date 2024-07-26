import { fetchContainers } from "./requests.js";
import { renderContainers } from "./container.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchContainers()
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Something went wrong on API server!");
            }
        })
        .then(data => {
            return renderContainers(data.data);
        })
        .then(containerDiv => {
            // TODO: agora é pra renderizar as tasks no html de cada container
            console.log(containerDiv);
        })
        .catch(error => {
            console.log("catch: " + error);
        });
})
