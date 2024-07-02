import express from "express";
import TaskController from "../controllers/taskController.js";

const router = express.Router();

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send("To Do List");
    });

    app.route('/kanban/create').get((req, res) => {
        res.status(200).send("Create kanban");
    });

    app.route('/kanban/list').get(TaskController.listTasks);

    app.use(
        express.json(),
    );
}

export default routes;