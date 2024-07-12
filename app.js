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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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
app.delete(`/tasks/:id`, TaskController.deleteTask);
app.put(`/tasks/move`, TaskController.updateContainerId);
app.put(`/tasks/update`, TaskController.updateTask);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});