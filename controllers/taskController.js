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
            const { title, description } = req.body;
            if (!title) {
                res.status(400).json({ message: "O título é obrigatório!" });
                return;
            }
            
            const task = new Task(title, description);
            const sql = "INSERT INTO task (title, description) VALUES (?, ?)";
            const params = [task.title, task.description];
            
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
    
}

export default TaskController;