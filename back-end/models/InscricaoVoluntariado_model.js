module.exports = (Sequelize, DataTypes) => {
    const InscritosSessao = Sequelize.define('inscricao', {
        sessao_id : {
            type: DataTypes.INTEGER,
            references : {
                model: 'Sessao',
                key : 'sessao_id'
            }
        },
        user_id : {
            type: DataTypes.INTEGER,
            references : {
                model: 'Utilizador',
                key : 'user_id'
            }
        },
        presenca : DataTypes.BOOLEAN
    },
        {
            tableName: 'InscricaoVoluntariado',
            timestamps: false // Do not add createdAt and updatedAt fields
        }); 
    return InscritosSessao
}