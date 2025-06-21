// connect to a MySQL database using Sequelize
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD,{
        host: process.env.HOST,
        dialect: process.env.DIALECT,
        // connection pool settings
        pool: {
            max: 5, // maximum number of connections in pool
            min: 0, // minimum number of connections in pool
            acquire: 30000, // maximum time (in ms) that a connection can be idle before being released
            idle: 10000 // maximum time (in ms) that a connection can be idle before being released
        }
    }
);

if(process.env.NODE_ENV !== 'test'){
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1); // exit the process with a failure code
    }
}
)();
}
const db = {};
db.sequelize = sequelize;

db.School = require('../models/school_models')(sequelize, Sequelize.DataTypes);
db.Utilizador = require('../models/user_models')(sequelize, Sequelize.DataTypes);
db.Atividade = require('../models/atividade_models')(sequelize, Sequelize.DataTypes);
db.Area = require('./areaTematics_models')(sequelize, Sequelize.DataTypes);
db.Sessao = require('./sessao_models')(sequelize, Sequelize.DataTypes);
db.Conquistas = require('./conquistas_models')(sequelize, Sequelize.DataTypes);
db.InscritosSessao = require('./InscricaoVoluntariado_model')(sequelize, Sequelize.DataTypes);

// M user 1 School
db.Utilizador.hasOne(db.School, {foreignKey: 'escola_id', allowNull: false, onDelete: 'CASCADE'});
db.School.belongsTo(db.Utilizador, {foreignKey: 'escola_id',  allowNull: false});

// M Atividade 1 Area
db.Atividade.hasOne(db.Area, {foreignKey: 'area_id', allowNull: false, onDelete: 'CASCADE'});
db.Area.belongsTo(db.Atividade, {foreignKey: 'area_id',  allowNull: false});

// M Sessao 1 Atividade
db.Sessao.hasOne(db.Atividade, {foreignKey: 'atividade_id', allowNull: false, onDelete: 'CASCADE'});
db.Atividade.belongsTo(db.Sessao, {foreignKey: 'atividade_id',  allowNull: false});

// M sessao N users
db.Sessao.belongsToMany(db.Utilizador, {
    through: db.InscritosSessao, foreignKey: 'sessao_id', otherKey : 'user_id', timestamps: false, onDelete: 'CASCADE'
});
db.Utilizador.belongsToMany(db.Sessao, {
    through: db.InscritosSessao, foreignKey: 'user_id', otherKey : 'sessao_id',  timestamps: false,onDelete: 'CASCADE'
});

// M conquistas N users
db.Conquistas.belongsToMany(db.Utilizador, {
    through: 'conuser', timestamps: false
});
db.Utilizador.belongsToMany(db.Conquistas, {
    through: 'conuser', timestamps: false
});

module.exports = db
