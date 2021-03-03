const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash= require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport=require('./config/passport');

//Extreure valors de variables tipus .env
require('dotenv').config({path: 'variables.env'})

//helpers amb algunes funcions
const helpers = require('./views/helpers');
 
//Crear la connexio a la BD
const db = require('./config/db');
const { Parser } = require('webpack');

//Impoortar el model
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Connectat al servidor'))
    .catch((error) => console.log(error));

//Crear una app d'express
const app = express();

//On carregar els artxius estàtics
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//Habilitar bodyParser per llegir dades de formulari
app.use(bodyParser.urlencoded({extended: true}));

//Afegim express validator a tota la aplicacio
app.use(express.json());


//Afegir carpeta de les vistes
app.set('views',path.join(__dirname, './views'));

//Afegir flash messages
app.use(flash());

app.use(cookieParser());

//Sesions ens permeten navegar entre diferents pàgines sense tornar a autentificar-nos
app.use(session({
    secret: 'sepersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//Passar vardump a tota la aplicacio
app.use((req, res, next)=>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes=req.flash();
    res.locals.usuario={...req.user} || null;
    next();
});




app.use('/', routes());

//app.listen(3000);

//Servidor i port
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () =>{
    console.log('El servidor està funcionant');
})

