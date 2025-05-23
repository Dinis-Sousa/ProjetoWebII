module.exports = (Sequelize, DataTypes) => {

    const Area = Sequelize.define('area', {
        area_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true 
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
 }, {
    tableName: 'areatematics'
 })
    return Area
}