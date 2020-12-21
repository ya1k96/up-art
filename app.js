var express = require('express');
var bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config()
var mongoose = require('mongoose');
var session = require('express-session');

//Controladores
const todocontroller = require('./controllers/todocontroller.js');
const usuariocontroller = require('./controllers/usuariocontroller.js');
const proveedoresController = require('./controllers/proveedores.js');
const imagenesController = require('./controllers/imagenes.js');

const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;
const urlDB  = process.env.DBURL
const urlMongo = 'mongodb://'+ dbUser + ':'+ dbPass + urlDB; 
mongoose.connect(urlMongo,{ useMongoClient: true });

const db = mongoose.connection;
//Conexion a la base de datos

var app = express();
var urlencodedparser = bodyparser.urlencoded({ extended: true}); // ??

db.once("open", function(){
  console.log("Conectado a la bd")
});

db.on("error", function(er){
  console.log("No se pudo conectar a la base de datos")
  console.log(er);
  app.get('/', function(req, res) {
    res.render('events/error');
  })
})

app.set('secreto', process.env.SECRET)
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  user: null,
  token: null,
  role: null,
  logged: false
}))

app.use(urlencodedparser)
app.use(bodyparser.json())
app.use(fileUpload())
// Set up template engine
app.set('view engine', 'ejs');

//configuracion de cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// Static files
app.use(express.static('./public'));

//controladores
todocontroller(app);
usuariocontroller(app);
proveedoresController(app);
imagenesController(app);

// Listen to port

var port_number = (process.env.PORT || 3000);
app.listen(port_number);
console.log("Your Listening to the port", port_number)