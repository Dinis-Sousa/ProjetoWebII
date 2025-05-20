module.exports = (Sequelize, DataTypes) => {
    const User = Sequelize.define('user', {
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
        passwordHssh: {
            type: DataTypes.STRING,
            allowNull: false
        },
        perfil: {
            type: DataTypes.ENUM('ADMIN', 'ALUNO', 'COLABORADOR'),
             allowNull: false,
             validate: {
                isIn: {
                   args: [['ADMIN', 'ALUNO', 'COLABORADOR']],
                   msg: "Role must be one of the following: ADMIN, ALUNO ou COLABORADOR "
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

})
    return User
}