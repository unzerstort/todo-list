import db from "../config/database.js";
import { Task, TaskModel } from "../models/Task.js";

class TaskController {
    static listTasks = async (req, res) => {
        try {
            const rows = new TaskModel();
            rows.getTasks().then(data => {
                res.json({
                    "message": "success",
                    "data": data
                })
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor!" });
        }
    }

    static createTask = async (req, res) => {
        try {
            const { title, description, container_id } = req.body;

            const newTask = await TaskModel.createTask(title, description, container_id);

            res.json({
                message: "success",
                data: newTask
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor", error: err.message });
        }
    }

    static updateTask = async (req, res) => {
        try {
            const { id, title, description } = req.body;
            if (!id) {
                return res.status(400).json({ message: "O ID da tarefa é obrigatório!" });
            }

            const updatedTask = await TaskModel.updateTask(id, title, description);

            res.json({
                message: "success",
                data: updatedTask
            });
        } catch (err) {
            if (err.message === "Tarefa não encontrada!") {
                return res.status(404).json({ message: "Tarefa não encontrada!" });
            }
            res.status(500).json({ message: "Erro interno no servidor", error: err.message });
        }
    }

    static deleteTask = async (req, res) => {
        try {
            const { id } = req.params;

            await TaskModel.deleteTask(id);

            res.json({
                message: "success",
                data: { id }
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor", error: err.message });
        }
    }

    static updateContainerId = async (req, res) => {
        try {
            const { id, new_container_id } = req.body;

            await TaskModel.updateContainerId(id, new_container_id);

            res.json({
                message: "success",
                data: { id, new_container_id }
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor", error: err.message });
        }
    }
}

export default TaskController;