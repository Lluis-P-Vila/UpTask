const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const { usuarioAutenticado } = require('./authController');

exports.proyectosHome= async(req, res) => {
    
    const usuarioid = res.locals.usuario.id; 
    const proyectos = await Proyectos.findAll({where:{usuarioid:usuarioid}});
    
    res.render('index',{
        nombrePagina: 'Projectes',
        proyectos
    });   
}

exports.formularioProyecto = async(req, res) => {
    const usuarioid = res.locals.usuario.id; 
    const proyectos = await Proyectos.findAll({where:{usuarioid:usuarioid}});

    res.render('nuevoProyecto', {
        nombrePagina: 'Nou Projecte',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) =>{
    const usuarioid = res.locals.usuario.id; 
    const proyectos = await Proyectos.findAll({where:{usuarioid:usuarioid}});

   //Enviar a la consola lo que el usuario escriba
   //console.log(req.body);

   //Validar que tinguem quekcom a l'input
   const{nombre} = req.body;

   let errores = [];

   if (!nombre) {
       errores.push({'texto': 'Agrega un nombre al proyecto'})
   }

   //Si hi ha errors
   if(errores.lenght>0){
        res.render('nuevoProyecto', {
            nombrePagina : "Nou Projecte",
            errores,
            proyectos
        })
   } else {
       //No hi ha errors
       //Insertem a la BDD
        const usuarioid = res.locals.usuario.id;     
        await Proyectos.create({nombre, usuarioid});
        res.redirect('/');
   }
}

exports.proyectoPorUrl = async (req, res, next) => {
 
    const usuarioid = res.locals.usuario.id; 
    const proyectosPromise =  Proyectos.findAll({where:{usuarioid:usuarioid}});
    const proyectoPromise =  Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioid:usuarioid
        }
    });
    
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
 
    //Consultar tareas del proyecto actual
    const tareas=await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
    });

        if(!proyecto) return next();

    // render a la vista
    res.render('tareas', {
        nombrePagina: 'Tasques del Projecte',
        proyectos,
        proyecto,
        tareas
    })   
}

exports.formularioEditar = async(req, res) => {
    
    const usuarioid = res.locals.usuario.id; 
    const proyectosPromise =  Proyectos.findAll({where:{usuarioid:usuarioid}});
    const proyectoPromise =  Proyectos.findOne({ 
            where:{
                id: req.params.id,
                usuarioid: usuarioid
            }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Projecte',
        proyectos,
        proyecto
    })
} 

exports.actualizarProyecto = async (req, res) =>{
    const usuarioid = res.locals.usuario.id; 
    const proyectos = await Proyectos.findAll({where:{usuarioid:usuarioid}});
   //Enviar a la consola lo que el usuario escriba
   //console.log(req.body);

   //Validar que tinguem quekcom a l'input
   const{nombre} = req.body;

   let errores = [];

   if (!nombre) {
       errores.push({'texto': 'Agrega un nombre al proyecto'})
   }

   //Si hi ha errors
   if(errores.lenght>0){
        res.render('nuevoProyecto', {
            nombrePagina : "Nou Projecte",
            errores,
            proyectos
        })
   } else {
       //No hi ha errors
       //Insertem a la BDD
              
        await Proyectos.update(
            {nombre: nombre},
            {where: {id: req.params.id}}
        );
        res.redirect('/');
   }
}

exports.eliminarProyecto = async(req, res, next)=>{
    //req pot funcionar amb query o params
    const{urlProyecto}=req.query;

    const resultado = await Proyectos.destroy({where : {url:urlProyecto}});

    if(!resultado){
        return next();
    }
    res.status(200).send('Projecte eliminat corrctament');  
}