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

    findProductsByCategory(category) {

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

    async findProductsByModel(Car) {
    return new Promise((resolve, reject) => {
        this.db.all(
            `SELECT * FROM Product WHERE Car = ? OR Car = 'ALL'`,
            [Car],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

async getOrCreateCart(userId) {
    return new Promise((resolve, reject) => {
        this.db.get(
            `SELECT * FROM Cart WHERE user_id = ?`,
            [userId],
            (err, row) => {
                if (err) return reject(err);

                if (row) {
                    resolve(row);
                } else {
                    this.db.run(
                        `INSERT INTO Cart (user_id) VALUES (?)`,
                        [userId],
                        function (err) {
                            if (err) return reject(err);

                            resolve({
                                id: this.lastID,
                                user_id: userId
                            });
                        }
                    );
                }
            }
        );
    });
}

async addToCart(cartId, productId) {
    return new Promise((resolve, reject) => {
        this.db.run(
            `
            INSERT INTO CartItems (cart_id, product_id, quantity)
            VALUES (?, ?, 1)
            ON CONFLICT(cart_id, product_id)
            DO UPDATE SET quantity = quantity + 1
            `,
            [cartId, productId],
            function (err) {
                if (err) return reject(err);
                resolve(true);
            }
        );
    });
}

async removeFromCart(cartId, productId) {
    return new Promise((resolve, reject) => {
        this.db.run(
            `
            DELETE FROM CartItems
            WHERE cart_id = ? AND product_id = ?
            `,
            [cartId, productId],
            function (err) {
                if (err) return reject(err);
                resolve(true);
            }
        );
    });
}

async getCartProducts(userId) {
    return new Promise((resolve, reject) => {
        this.db.all(
            `
            SELECT p.*, ci.quantity
            FROM CartItems ci
            JOIN Cart c ON c.id = ci.cart_id
            JOIN Product p ON p.ID = ci.product_id
            WHERE c.user_id = ?
            `,
            [userId],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}

}

module.exports = DataBase;