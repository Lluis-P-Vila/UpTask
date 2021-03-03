const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail=require('../handlers/email');


exports.autenticarUsuario=passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Cal informar els dos camps'
});

//funció per a revisar si l'usuari està autenticat
exports.usuarioAutenticado=(req, res, next)=>{

    //si l'usuari està utenticat endevant
    if(req.isAuthenticated()){
        return next();
    }
    //si l'usuari no està autenticat redirigir al formulari
    return res.redirect('/iniciar-sesion');
};

//funcio per a Tancar Sessió
exports.cerrarSesion=(req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
}

//Genera un token si l'usuari és vàlid
exports.enviarToken= async(req, res)=>{
    //verificar que l'usurai existeix
    const{email}=req.body;
    const usuario = await Usuarios.findOne({where:{email: email}});
    
    //Si no existeix l'usuari
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    } else {
        //L'usuari esixteix
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;
        
        //Desar a la base de dades
        await usuario.save();

        //url de reset
        const resetUrl  = `http://${req.headers.host}/reestablecer/${usuario.token}`;
        
        //Enviar el correu amb el token
        await enviarEmail.enviar({
            usuario,
            subject:'Password reset',
            resetUrl,
            archivo: 'reestablecer-password'
        });

        //Acabar flux
        req.flash('correcto', 'S\'ha enviat un missatge al teu correu');
        res.redirect('/iniciar-sesion');
    }
}

exports.validarToken=async(req, res)=>{
    const usuario= await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    });
    if(!usuario){
        req.flash('error', 'Invàlid');
        res.redirect('/reestablecer');
    }

    //formulario para reestablecer password
    res.render('resetPassword', {
        nombrePagina: 'Reestablir contrasenya'
    })
    //  console.log(usuario);
}

//Canviar el password per un de nou
exports.actualizarPassword= async(req, res)=>{
   
    const usuario=await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte]:Date.now()
            }
        }
    });

    //Verifiquem si l'usuari existeix
    if(!usuario){
        req.flash('error', 'Invàlid');
        res.redirect('/reestablecer');
    }

    //Hashear el nou password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token=null;
    usuario.expiracion=null;

    //guardem el nou password
    await usuario.save();

    req.flash('correcto', 'El teu password s\'ha actualitzat correctament');
    res.redirect('/iniciar-sesion');
}
 