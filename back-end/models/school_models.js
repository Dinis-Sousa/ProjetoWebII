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
        allowNull: false
    },
    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nivelCertificacao: {
        type: DataTypes.ENUM('BÁSICO', 'MÉDIO', 'AVANÇADO'),
        allowNull: false,
        field: 'nivelCertificacao',
         validate: {
            isIn: {
               args: [['BÁSICO', 'MÉDIO', 'AVANÇADO']],
               msg: "Role must be one of the following: BÁSICO, MÉDIO ou AVANÇADO "
            }
         }
    }
 }, {
    tableName: 'escola',
    timestamps: false // Do not add createdAt and updatedAt fields
 })
    return School
}