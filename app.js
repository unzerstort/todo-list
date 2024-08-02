import express from 'express';
import TaskController from './controllers/taskController.js';
import ContainerController from './controllers/containerController.js';

const app = express();
const port = process.env.PORT || 3000;
var uri = `http://localhost:${port}`;

app.use(express.json());

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

// Responde a requisições OPTIONS
app.options('*', (req, res) => {
    res.sendStatus(200);
});

// Rotas
app.get(`/tasks`, TaskController.listTasks);
app.get(`/containers`, ContainerController.listContainers);

app.post(`/tasks/create`, TaskController.createTask);
app.post(`/containers/create`, ContainerController.createContainer);

app.delete(`/tasks/delete/:id`, TaskController.deleteTask);
app.delete(`/containers/delete/:id`, ContainerController.deleteContainer);

app.patch(`/tasks/:id/move`, TaskController.updateContainerId);
app.patch(`/tasks/update`, TaskController.updateTask);
app.put(`/containers/update`, ContainerController.updateContainerName);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});