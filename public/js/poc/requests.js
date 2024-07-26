
var uri = "http://localhost:3000";


export async function fetchContainers() {
    return fetch(`${uri}/containers`)
}

export async function fetchTasks() {
    return fetch(`${uri}/tasks`);
}

// export async function fetchContainers() {
//     fetch(`${uri}/containers`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.message === "success") {
//                 renderContainers(data.data);
//             } else {
//                 throw new Error('Erro ao obter containers');
//             }
//         })
//         .catch(error => {
//             alert('Erro:', error);
//         });
// }
