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
            res.status(500).json({ message: "Erro interno no servidor!"});
        }
    }

    static createTask = async (req, res) => {
        try {
            const { title, description, container_id } = req.body;
            if (!title || !container_id) {
                res.status(400).json({ message: "O título e o ID do container são obrigatórios!" });
                return;
            }
            
            const task = new Task(title, description, container_id);
            const sql = "INSERT INTO task (title, description, container_id) VALUES (?, ?, ?)";
            const params = [task.title, task.description, task.container_id];
            
            db.run(sql, params, function(err) {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                res.json({
                    "message": "success",
                    "data": { id: this.lastID, ...task }
                });
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    }

    static deleteTask = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "O ID da tarefa é obrigatório!" });
            }
            
            const sql = "DELETE FROM task WHERE id = ?";
            const params = [id];
            
            db.run(sql, params, function(err) {
                if (err) {
                    return res.status(400).json({ "error": err.message });
                }
                
                res.json({
                    "message": "success",
                    "data": { id }
                });
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    }

    static updateContainerId = async (req, res) => {
        try {
            const { id, new_container_id } = req.body;
            if (!id || !new_container_id) {
                return res.status(400).json({ message: "O ID da tarefa e o novo ID do container são obrigatórios!" });
            }

            const sql = "UPDATE task SET container_id = ? WHERE id = ?";
            const params = [new_container_id, id];
            
            db.run(sql, params, function(err) {
                if (err) {
                    return res.status(400).json({ "error": err.message });
                }
                
                res.json({
                    "message": "success",
                    "data": { id, new_container_id }
                });
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    }
}

export default TaskController;