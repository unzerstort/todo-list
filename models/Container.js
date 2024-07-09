import db from "../config/database.js";

class Container {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class ContainerModel {
    getContainers() {
        let sql = "SELECT * FROM container";

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

export { Container, ContainerModel };