const Sequelize = require('sequelize');
const db= require('../config/db');
const Proyectos= require('../models/Proyectos');
const bcrypt=require('bcrypt-nodejs');
const passport = require('passport');
const { INTEGER } = require('sequelize');

const Usuarios= db.define('usuarios', {
    id:{
        type: Sequelize.INTEGER(7),
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(63),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Indroduiu un correu valid'
            },
            notEmpty: {
                msg: "Cal informar un correu"
            }
        },
        unique: {
            args: true,
            msg: 'Correu registrat anteriorment'
        }
    },
    password: {
        type: Sequelize.STRING(63),
        allowNull: false, 
        validate: {
            notEmpty:{
                msg: 'Cal informar un password'
            }
        }
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks:{
        beforeCreate(usuario){
            usuario.password=bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});


// Métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos, {
    foreignKey: 'usuarioid'
});

module.exports=Usuarios;