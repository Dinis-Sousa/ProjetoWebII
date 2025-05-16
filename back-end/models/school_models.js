let getAllSchools = () => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM Escola`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

let addSchool = (nome, morada, codigo, local, tele, email, nivel) => {
    return new Promise((resolve, reject) => {
        con.query(`INSERT INTO Escola(nome, morada, codigoPostal, localidade, telefone, email, nivelCertificacao) VALUES(?,?,?,?,?,?,?)`,[nome, morada, codigo, local, tele, email, nivel], (err) => {
        if (err) throw reject(err);
        resolve(console.log('ADICIONADA COM SUCESSO!!!!!!!!!'));
    });
})};

module.exports = {getAllSchools, addSchool};