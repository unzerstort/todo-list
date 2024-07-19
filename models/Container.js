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
    
            const deleteTaskSql = "DELETE FROM task WHERE container_id = ?";
            const deleteContainerSql = "DELETE FROM container WHERE id = ?";
    
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
    
                db.run(deleteTaskSql, [id], function (err) {
                    if (err) {
                        db.run("ROLLBACK", (rollbackErr) => {
                            if (rollbackErr) {
                                console.error("Erro ao fazer rollback:", rollbackErr);
                            }
                            reject(err);
                        });
                        return;
                    }
    
                    db.run(deleteContainerSql, [id], function (err) {
                        if (err) {
                            db.run("ROLLBACK", (rollbackErr) => {
                                if (rollbackErr) {
                                    console.error("Erro ao fazer rollback:", rollbackErr);
                                }
                                reject(err);
                            });
                            return;
                        }
    
                        db.run("COMMIT", (commitErr) => {
                            if (commitErr) {
                                db.run("ROLLBACK", (rollbackErr) => {
                                    if (rollbackErr) {
                                        console.error("Erro ao fazer rollback:", rollbackErr);
                                    }
                                    reject(commitErr);
                                });
                                return;
                            }
                            resolve({ id });
                        });
                    });
                });
            });
        });
    }
    

    static updateContainerName(id, name) {
        return new Promise((resolve, reject) => {
            const checkSql = "SELECT * FROM container WHERE id = ?";
            db.get(checkSql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!row) {
                    reject(new Error("Container não encontrado!"));
                    return;
                }

                const updateSql = "UPDATE container SET name = ? WHERE id = ?";
                const params = [name, id];

                db.run(updateSql, params, function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve({ id, name: name });
                });
            });
        });
    }
}

export { Container, ContainerModel };