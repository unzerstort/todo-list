import db from "../config/database.js";

class Container {
    constructor(name) {
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

    // TODO: add deleteContainer, editContainerTitle, moveContainer

    static createContainer(name) {
        return new Promise((resolve, reject) => {
            if (!name) {
                reject(new Error("O nome do container é obrigatório!"));
                return;
            }

            const container = new Container(name);
            const sql = "INSERT INTO container (name) VALUES (?)";
            const params = [container.name];

            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id: this.lastID, ...container });
            });
        });
    }

    static deleteContainer(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject(new Error("O ID do container é obrigatório!"));
                return;
            }

            const sql = "DELETE FROM container WHERE id = ?";
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

export { Container, ContainerModel };