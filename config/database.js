import sqlite3 from 'sqlite3';

const DBSOURCE = "database.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE task (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text NOT NULL, 
            description text, 
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO task (title, description) VALUES (?,?)'
                    db.run(insert, ["Ir ao supermercado", "Comprar itens básicos para a semana"])
                    db.run(insert, ["Estudar para o exame de matemática", "Revisar álgebra e geometria"])
                    db.run(insert, ["Ir à academia", ""])
                }
            });
    }
});

export default db;