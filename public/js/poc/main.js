import { fetchContainers, fetchTasks } from "./requests.js";
import { renderContainers } from "./container.js";
import { renderTasks } from "../tasks.js";

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
    .then(() => {
        fetchTasks()
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Something went wrong on API server!");
            }
        })
        .then(data => {
            return renderTasks(data.data);
        })
    })
    .catch(error => {
        console.log("catch: " + error);
    });
})
