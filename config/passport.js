const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

//Referenciem el model on anira la autenticació
const Usuarios = require('../models/Usuarios');

//localStrategy - login amb credencials pròpies -usuari(email) i password-
passport.use(
    new LocalStrategy(
        //passport espera per defecte usuari i password. A continuació ho redefinim:
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1
                    }
                });

                //el usuario existe, ahora verificamos el password
                console.log('Aquest es el password del config ', password)
                if(!usuario.verificarPassword(password)){
                    return done(null, false,{
                        message:'Password incorrecte'
                    })
                }
                //L'usuari existeix i el password és correcte
                return done(null, usuario);
            } catch (error) {
                //Entrem aqui quan l'usuari introduït no existeix
                return done(null, false,{
                    message:'Aquest compte no està registrat'
                })

            }
        }
    )
);

//serialitzar usuari
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});

//deserialitzar usuari
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);    
});

//exportar
module.exports= passport;
