module.exports = (Sequelize, DataTypes) => {
    const School = Sequelize.define('school', {
    escola_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    morada: {
        type: DataTypes.STRING,
        autoIncrement: false,
        allowNull: true,
    },
    codigoPostal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    localidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pontos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nivelCertificação: {
        type: DataTypes.ENUM('BÁSICO', 'MÉDIO', 'AVANÇADO'),
        allowNull: false,
         validate: {
            isIn: {
               args: [['BÁSICO', 'MÉDIO', 'AVANÇADO']],
               msg: "Role must be one of the following: BÁSICO, MÉDIO ou AVANÇADO "
            }
         }
    }
})
    return School
}