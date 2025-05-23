module.exports = (Sequelize, DataTypes) => {

    const Sessao = Sequelize.define('sessao', {
        sessao_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true 
        },
        dataMarcada: {
            type: DataTypes.DATE,
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
        tableName: 'sessao'
    })
    return Sessao
}