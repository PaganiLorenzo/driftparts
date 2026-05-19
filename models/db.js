const sqlite3 = require("sqlite3").verbose();

class DataBase {

    constructor() {
        this.db = new sqlite3.Database("my.db", sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    addNewUser(newUser, hashedPassword) {
        const sql = `INSERT INTO User(Username, Email, Password, Address, Type)
                     VALUES(?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(
                sql,
                [
                    newUser.username,
                    newUser.email,
                    hashedPassword,
                    newUser.address,
                    "USER"
                ],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID });
                    }
                }
            );
        });
    }

    findUserById(id) {

        const sql = `SELECT * FROM User WHERE ID = ?`;

        return new Promise((resolve, reject) => {

            this.db.get(sql, [id], (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }

            });

        });

    }

    findUserByEmail(email) {
        let sql = `SELECT * FROM User WHERE Email = ?`;
        const params = [email];
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Connessione al database chiusa.");
            }
        });
    }

    findProductssByCategory(category) {

        const sql = `
        SELECT *
        FROM Product
        WHERE Category = ?
    `;

        return new Promise((resolve, reject) => {

            this.db.all(sql, [category], (err, rows) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }

            });

        });

    }
}



module.exports = DataBase;