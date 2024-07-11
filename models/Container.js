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
                    console.error('Erro ao obter containers:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }
}

export { Container, ContainerModel };