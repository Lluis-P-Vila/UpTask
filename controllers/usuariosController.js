const Usuarios=require('../models/Usuarios');
const enviarEmail=require('../handlers/email');

exports.formCrearCuenta=(req, res)=>{
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    })
}

exports.formIniciarSesion=(req, res)=>{
    const {error}= res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesion en UpTask',
        error: error
    })
}

exports.crearCuenta=async(req, res)=>{
    //llegir les dades
    const{email, password}=req.body;

    try {
         //crear l'usuari
        await Usuarios.create({
            email,
            password
        })

        //Crear URL de confirmació
        const confirmarUrl  = `http://${req.headers.host}/confirmar/${email}`;
        //Crear Objecte usuari
        const usuario={
            email
        }
        
        //Enviar email
        await enviarEmail.enviar({
            usuario,
            subject:'Confirma el teu compte UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        
        //Redirigir a l'usuari
        req.flash('correcto', 'Per a finalitzar el procés cal que confirmeu el correu que us hem enviat');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error=>error.message));
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email: email,
            password: password
        })

    }
}
exports.formRestablecerPassword =(req, res) => {
    res.render('reestablecer',{
        nombrePagina: 'Restablecer tu Contraseña'
    })
}

//Canviar l'estat d'un compte
exports.confirmarCuenta=async(req, res)=>{
    const usuario= await Usuarios.findOne({
        where:{
            email:req.params.correo
        }
    });

    //Si no existeix l'usuari
    if(!usuario){
        req.flash('error', 'Invàlid');
        res.redirect('/crear-cuenta');
    }

    //si, efectivament, existeix
    usuario.activo=1;
    await usuario.save();

    req.flash('correcto', 'Compte activat correctament');
    res.redirect('/iniciar-sesion');
}