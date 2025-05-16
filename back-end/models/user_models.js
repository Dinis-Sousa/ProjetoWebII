const con = require('../connect')

let getAllUsers = () => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Utilizador`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

let getUsers = (id) => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Utilizador WHERE user_id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            
            // Convert RowDataPacket to plain JS object
            const [plainResults] = results.map(row => ({ ...row }));
            resolve(plainResults);
            console.log(plainResults)
        });
    });
};

module.exports = {getAllUsers, getUsers }