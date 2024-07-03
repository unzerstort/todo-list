import express from "express";
import TaskController from "../controllers/taskController.js";

const router = express.Router();

const routes = (app) => {
    app.route('/kanban/create').post(TaskController.createTask);

    app.route('/kanban/list').get(TaskController.listTasks);

    app.use(
        express.json(),
    );
}

export default routes;