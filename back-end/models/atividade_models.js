module.exports = (Sequelize, DataTypes) => {
    const Atividade = Sequelize.define('atividade', {
        atividade_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true 
        },
        area_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dataInicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dataFim: {
            type: DataTypes.DATE,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('CONCLUIDA', 'EM PROGRESSO', 'PENDENTE'),
            allowNull: true,
            validate: {
                isIn: {
                   args: [['CONCLUIDA', 'EM PROGRESSO', 'PENDENTE']],
                   msg: "Role must be one of the following: 'CONCLUIDA', 'EM PROGRESSO', 'PENDENTE'"
                }
             }
        },
    },{
        tableName: 'atividade',
        timestamps: false // Do not add createdAt and updatedAt fields
    })
    return Atividade
}