module.exports = (Sequelize, DataTypes) => {

    const Sessao = Sequelize.define('sessao', {
        sessao_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true 
        },
        atividade_id : {
            type: DataTypes.INTEGER,
            
        },
        dataMarcada: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        horaMarcada: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        vagas: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'sessao',
        timestamps: false 
    })
    return Sessao
}