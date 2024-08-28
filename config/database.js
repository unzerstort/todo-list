import sqlite3 from 'sqlite3';

const DBSOURCE = "database.sqlite";

let db = new sqlite3.Database(DBSOURCE);

db.serialize(() => {
    db.run(`CREATE TABLE container (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        )`);

    db.run(`CREATE TABLE task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, 
        container_id INTEGER NOT NULL,
        FOREIGN KEY(container_id) REFERENCES container(id)
        )`);

    let insertContainer = 'INSERT INTO container (name) VALUES (?)';
    db.run(insertContainer, ["To do"]);
    db.run(insertContainer, ["Doing"]);
    db.run(insertContainer, ["Done"]);


    let insertTask = 'INSERT INTO task (title, container_id) VALUES (?,?)';
    db.run(insertTask, ["Ir ao supermercado", 1]);
    db.run(insertTask, ["Estudar para o exame de matemática", 2]);
    db.run(insertTask, ["Ir à academia", 3]);

});


export default db;