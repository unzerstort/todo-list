import express from 'express';
import TaskController from './controllers/taskController.js';

const app = express();
const port = process.env.PORT || 3000;
var uri = `http://localhost:${port}`;

app.use(express.json());

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Ajuste para a URL do frontend
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
app.post(`/tasks/create`, TaskController.createTask);
app.delete(`/tasks/:id`, TaskController.deleteTask);
app.put(`/tasks/move`, TaskController.updateContainerId); // Endpoint para mover a tarefa

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});