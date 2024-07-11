import db from "../config/database.js";

class Task {
    constructor(title, description, container_id) {
        this.title = title;
        this.description = description;
        this.container_id = container_id;
    }
}

class TaskModel {

    getTasks() {
        let sql = "SELECT * FROM task";

        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log(rows);
                resolve(rows);
            });
        });
    }

    static createTask(title, description, container_id) {
        return new Promise((resolve, reject) => {
            if (!title || !container_id) {
                reject(new Error("O título e o ID do container são obrigatórios!"));
                return;
            }

            const task = new Task(title, description, container_id);
            const sql = "INSERT INTO task (title, description, container_id) VALUES (?, ?, ?)";
            const params = [task.title, task.description, task.container_id];

            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id: this.lastID, ...task });
            });
        });
    }

    static updateTask(id, newTitle, newDescription) {
        return new Promise((resolve, reject) => {
            const checkSql = "SELECT * FROM task WHERE id = ?";
            db.get(checkSql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!row) {
                    reject(new Error("Tarefa não encontrada!"));
                    return;
                }

                const updateSql = "UPDATE task SET title = ?, description = ? WHERE id = ?";
                const params = [newTitle, newDescription, id];

                db.run(updateSql, params, function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve({ id, title: newTitle, description: newDescription });
                });
            });
        });
    }

    static updateContainerId(id, newContainerId) {
        return new Promise((resolve, reject) => {
            if (!id || !newContainerId) {
                reject(new Error("O ID da tarefa e o novo ID do container são obrigatórios!"));
                return;
            }

            const sql = "UPDATE task SET container_id = ? WHERE id = ?";
            const params = [newContainerId, id];

            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ id, newContainerId });
            });
        });
    }

    static deleteTask(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject(new Error("O ID da tarefa é obrigatório!"));
                return;
            }

            const sql = "DELETE FROM task WHERE id = ?";
            const params = [id];

            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ id });
            });
        });
    }

}

export { Task, TaskModel };