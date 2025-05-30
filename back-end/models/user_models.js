module.exports = (Sequelize, DataTypes) => {
    const Utilizador = Sequelize.define('Utilizador', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true 
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        perfil: {
            type: DataTypes.ENUM('ADMIN', 'ALUNO', 'COLABORADOR'),
             validate: {
                isIn: {
                   args: [['ADMIN', 'ALUNO', 'COLABORADOR']],
                   msg: "O tipo de utilizador tem de pertencer a um destes 3: ADMIN, ALUNO ou COLABORADOR "
                }
             }
          },
        
        dataRegisto: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        pontos: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
        {
            tableName: 'utilizador',
            timestamps: false 

})
    return Utilizador
}