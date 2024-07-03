import db from "../config/database.js";

class Task {
    constructor(title, description) {
        this.title = title;
        this.description = description;
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

}

export { Task, TaskModel };