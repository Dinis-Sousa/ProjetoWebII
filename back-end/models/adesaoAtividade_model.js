module.exports = (Sequelize, DataTypes) => {
    const AdesaoAtividade = Sequelize.define('adesao', {
        atividade_id : {
            type: DataTypes.INTEGER,
            references : {
                model: 'Atividade',
                key: 'atividade_id'
            }
        },
        escola_id : {
            type: DataTypes.INTEGER,
            references : {
                model : 'School',
                key : 'escola_id'
            }
        },
        aderiu : DataTypes.BOOLEAN
    }, {
        tableName : 'adesaoAtividade',
        timestamps: false 
    });
    return AdesaoAtividade
}