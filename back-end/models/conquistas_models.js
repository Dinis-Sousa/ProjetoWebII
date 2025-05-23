module.exports = (Sequelize, DataTypes) => {

    const Conquistas = Sequelize.define('conquista', {
        conqiusta_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true 
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pontosN: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        badge: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
 }, {
    tableName: 'conquistas',
    timestamps: false // Do not add createdAt and updatedAt fields
 })
    return Conquistas
}