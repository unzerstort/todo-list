import db from "../config/database.js";

// TODO: importar modelo task
class TaskController {
    static listTasks = async (req, res) => {
        try {
            var sql = "select * from task"
            var params = []
            
            db.all(sql, params, (err, rows) => {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                res.json({
                    "message": "success",
                    "data": rows
                })
            });
        } catch (erro) {
            res.status(500).json({ message: "Erro interno no servidor" });
        }
    }
}

export default TaskController;